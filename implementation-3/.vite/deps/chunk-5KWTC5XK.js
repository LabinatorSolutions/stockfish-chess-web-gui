// node_modules/cm-web-modules/src/observe/Observe.js
var collectionMutationMethods = {
  array: ["copyWithin", "fill", "pop", "push", "reverse", "shift", "unshift", "sort", "splice"],
  set: ["add", "clear", "delete"],
  map: ["set", "clear", "delete"]
};
var registry = /* @__PURE__ */ new Map();
var Observe = class _Observe {
  /**
   * Intercept a function call before the function is executed. Can manipulate
   * arguments in callback.
   * @param object
   * @param functionName allows multiple names as array
   * @param callback
   * @returns Object with `remove` function to remove the interceptor
   */
  static preFunction(object, functionName, callback) {
    if (Array.isArray(functionName)) {
      let removes = [];
      functionName.forEach((functionNameItem) => {
        removes.push(_Observe.preFunction(object, functionNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedPreFunctions === void 0) {
      registryObject.observedPreFunctions = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedPreFunctions.has(functionName)) {
      registryObject.observedPreFunctions.set(functionName, /* @__PURE__ */ new Set());
      const originalMethod = object[functionName];
      object[functionName] = function() {
        let functionArguments = arguments;
        registryObject.observedPreFunctions.get(functionName).forEach(function(callback2) {
          const params = { functionName, arguments: functionArguments };
          const callbackReturn = callback2(params);
          if (callbackReturn) {
            functionArguments = callbackReturn;
          }
        });
        return originalMethod.apply(object, functionArguments);
      };
    }
    registryObject.observedPreFunctions.get(functionName).add(callback);
    return {
      remove: () => {
        registryObject.observedPreFunctions.get(functionName).delete(callback);
      }
    };
  }
  /**
   * Intercept a function call after the function is executed. Can manipulate
   * returnValue in callback.
   * @param object
   * @param functionName allows multiple names as array
   * @param callback
   * @returns Object with `remove` function to remove the interceptor
   */
  static postFunction(object, functionName, callback) {
    if (Array.isArray(functionName)) {
      let removes = [];
      functionName.forEach((functionNameItem) => {
        removes.push(_Observe.postFunction(object, functionNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedPostFunctions === void 0) {
      registryObject.observedPostFunctions = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedPostFunctions.has(functionName)) {
      registryObject.observedPostFunctions.set(functionName, /* @__PURE__ */ new Set());
      const originalMethod = object[functionName];
      object[functionName] = function() {
        let returnValue = originalMethod.apply(object, arguments);
        const functionArguments = arguments;
        registryObject.observedPostFunctions.get(functionName).forEach(function(callback2) {
          const params = { functionName, arguments: functionArguments, returnValue };
          callback2(params);
          returnValue = params.returnValue;
        });
        return returnValue;
      };
    }
    registryObject.observedPostFunctions.get(functionName).add(callback);
    return {
      remove: () => {
        registryObject.observedPostFunctions.get(functionName).delete(callback);
      }
    };
  }
  /**
   * Observe properties (attributes) of an object. Works also with Arrays, Maps and Sets.
   * The parameter `propertyName` can be an array of names to observe multiple properties.
   * @param object
   * @param propertyName allows multiple names as array
   * @param callback
   */
  static property(object, propertyName, callback) {
    if (Array.isArray(propertyName)) {
      let removes = [];
      propertyName.forEach((propertyNameItem) => {
        removes.push(_Observe.property(object, propertyNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!object.hasOwnProperty(propertyName)) {
      console.error("Observe.property", object, "missing property: " + propertyName);
      return;
    }
    let isCollection = false;
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedProperties === void 0) {
      registryObject.observedProperties = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedProperties.has(propertyName)) {
      registryObject.observedProperties.set(propertyName, {
        value: object[propertyName],
        observers: /* @__PURE__ */ new Set()
      });
      const property = object[propertyName];
      let mutationMethods = [];
      if (property instanceof Array) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.array;
      } else if (property instanceof Set || property instanceof WeakSet) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.set;
      } else if (property instanceof Map || property instanceof WeakMap) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.map;
      }
      if (delete object[propertyName]) {
        Object.defineProperty(object, propertyName, {
          get: function() {
            return registryObject.observedProperties.get(propertyName).value;
          },
          set: function(newValue) {
            const oldValue = registryObject.observedProperties.get(propertyName).value;
            if (newValue !== oldValue) {
              registryObject.observedProperties.get(propertyName).value = newValue;
              registryObject.observedProperties.get(propertyName).observers.forEach(function(callback2) {
                const params = { propertyName, oldValue, newValue };
                callback2(params);
              });
            }
          },
          enumerable: true,
          configurable: true
        });
        if (isCollection) {
          mutationMethods.forEach(function(methodName) {
            object[propertyName][methodName] = function() {
              object[propertyName].constructor.prototype[methodName].apply(this, arguments);
              const methodArguments = arguments;
              registryObject.observedProperties.get(propertyName).observers.forEach(function(observer) {
                const params = {
                  propertyName,
                  methodName,
                  arguments: methodArguments,
                  newValue: object[propertyName]
                };
                observer(params);
              });
            };
          });
        }
      } else {
        console.error("Error: Observe.property", propertyName, "failed");
      }
    }
    registryObject.observedProperties.get(propertyName).observers.add(callback);
    return {
      remove: () => {
        registryObject.observedProperties.get(propertyName).observers.delete(callback);
      }
    };
  }
};

export {
  Observe
};
//# sourceMappingURL=chunk-5KWTC5XK.js.map
