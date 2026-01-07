import {
  Chess,
  SQUARES
} from "./chunk-XZ62UXQF.js";

// node_modules/cm-pgn/src/Header.js
var TAGS = {
  // Standard "Seven Tag Roster"
  Event: "Event",
  // the name of the tournament or match event
  Site: "Site",
  // the location of the event
  Date: "Date",
  // the starting date of the game (format: YYYY.MM.TT)
  Round: "Round",
  // the playing round ordinal of the game
  White: "White",
  // the player of the white pieces (last name, pre name)
  Black: "Black",
  // the player of the black pieces (last name, pre name)
  Result: "Result",
  // the result of the game (1-0, 1/2-1/2, 0-1, *)
  // Optional (http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm#c9)
  //      Player related information
  WhiteTitle: "WhiteTitle",
  BlackTitle: "BlackTitle",
  // These use string values such as "FM", "IM", and "GM"; these tags are used only for the standard abbreviations for FIDE titles. A value of "-" is used for an untitled player.
  WhiteElo: "WhiteElo",
  BlackElo: "BlackElo",
  // These tags use integer values; these are used for FIDE Elo ratings. A value of "-" is used for an unrated player.
  WhiteUSCF: "WhiteUSCF",
  BlackUSCF: "BlackUSCF",
  // These tags use integer values; these are used for USCF (United States Chess Federation) ratings. Similar tag names can be constructed for other rating agencies.
  WhiteNA: "WhiteNA",
  BlackNA: "BlackNA:",
  // These tags use string values; these are the e-mail or network addresses of the players. A value of "-" is used for a player without an electronic address.
  WhiteType: "WhiteType",
  BlackType: "BlackType",
  // These tags use string values; these describe the player types. The value "human" should be used for a person while the value "program" should be used for algorithmic (computer) players.
  //      Event related information
  EventDate: "EventDate",
  // This uses a date value, similar to the Date tag field, that gives the starting date of the Event.
  EventSponsor: "EventSponsor",
  // This uses a string value giving the name of the sponsor of the event.
  Section: "Section",
  // This uses a string; this is used for the playing section of a tournament (e.g., "Open" or "Reserve").
  Stage: "Stage",
  // This uses a string; this is used for the stage of a multistage event (e.g., "Preliminary" or "Semifinal").
  Board: "Board",
  // This uses an integer; this identifies the board number in a team event and also in a simultaneous exhibition.
  //      Opening information (locale specific)
  Opening: "Opening",
  // This uses a string; this is used for the traditional opening name. This will vary by locale. This tag pair is associated with the use of the EPD opcode "v0" described in a later section of this document.
  ECO: "ECO",
  // This uses a string of either the form "XDD" or the form "XDD/DD" where the "X" is a letter from "A" to "E" and the "D" positions are digits.
  //      Time and date related information
  Time: "Time",
  // Time the game started, in "HH:MM:SS" format, in local clock time.
  UTCTime: "UTCTime",
  // This tag is similar to the Time tag except that the time is given according to the Universal Coordinated Time standard.
  UTCDate: "UTCDate",
  // This tag is similar to the Date tag except that the date is given according to the Universal Coordinated Time standard.
  //      Time control
  TimeControl: "TimeControl",
  // 40/7200:3600 (moves per seconds: sudden death seconds)
  //      Alternative starting positions
  SetUp: "SetUp",
  // "0": position is start position, "1": tag FEN defines the position
  FEN: "FEN",
  //  Alternative start position, tag SetUp has to be set to "1"
  //      Game conclusion
  Termination: "Termination",
  // Gives more details about the termination of the game. It may be "abandoned", "adjudication" (result determined by third-party adjudication), "death", "emergency", "normal", "rules infraction", "time forfeit", or "unterminated".
  //      Miscellaneous
  Annotator: "Annotator",
  // The person providing notes to the game.
  Mode: "Mode",
  // "OTB" (over-the-board) "ICS" (Internet Chess Server)
  PlyCount: "PlyCount",
  // String value denoting total number of half-moves played.
  Variant: "Variant"
  // "Chess960", "Fischerandom" and "Freestyle" are the same (Chess960).
};
var Header = class {
  constructor(headerString = "") {
    this.clear();
    const rows = headerString.match(/\[([^\]]+)]/g);
    if (rows && rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        let tag = rows[i].match(/\[(\w+)\s+"([^"]+)"/);
        if (tag) {
          this.tags[tag[1]] = tag[2];
        }
      }
    }
  }
  clear() {
    this.tags = {};
  }
  render() {
    let rendered = "";
    for (const tag in this.tags) {
      rendered += `[${tag} "${this.tags[tag]}"]
`;
    }
    return rendered;
  }
};

// node_modules/cm-pgn/src/parser/pgnParser.js
function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}
function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    "class": function(expectation) {
      var escapedParts = "", i;
      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
      }
      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },
    any: function(expectation) {
      return "any character";
    },
    end: function(expectation) {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = new Array(expected2.length), i, j;
    for (i = 0; i < expected2.length; i++) {
      descriptions[i] = describeExpectation(expected2[i]);
    }
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {}, peg$startRuleFunctions = { pgn: peg$parsepgn }, peg$startRuleFunction = peg$parsepgn, peg$c0 = function(pw, all) {
    var arr = all ? all : [];
    arr.unshift(pw);
    return arr;
  }, peg$c1 = function(pb, all) {
    var arr = all ? all : [];
    arr.unshift(pb);
    return arr;
  }, peg$c2 = function() {
    return [[]];
  }, peg$c3 = function(pw) {
    return pw;
  }, peg$c4 = function(pb) {
    return pb;
  }, peg$c5 = function(cm, mn, cb, hm, nag, ca, vari, all) {
    var arr = all ? all : [];
    var move = {};
    move.turn = "w";
    move.moveNumber = mn;
    move.notation = hm;
    move.commentBefore = cb;
    move.commentAfter = ca;
    move.commentMove = cm;
    move.variations = vari ? vari : [];
    move.nag = nag ? nag : null;
    arr.unshift(move);
    return arr;
  }, peg$c6 = function(cm, me, cb, hm, nag, ca, vari, all) {
    var arr = all ? all : [];
    var move = {};
    move.turn = "b";
    move.moveNumber = me;
    move.notation = hm;
    move.commentBefore = cb;
    move.commentAfter = ca;
    move.commentMove = cm;
    move.variations = vari ? vari : [];
    arr.unshift(move);
    move.nag = nag ? nag : null;
    return arr;
  }, peg$c7 = "1:0", peg$c8 = peg$literalExpectation("1:0", false), peg$c9 = function() {
    return ["1:0"];
  }, peg$c10 = "0:1", peg$c11 = peg$literalExpectation("0:1", false), peg$c12 = function() {
    return ["0:1"];
  }, peg$c13 = "1-0", peg$c14 = peg$literalExpectation("1-0", false), peg$c15 = function() {
    return ["1-0"];
  }, peg$c16 = "0-1", peg$c17 = peg$literalExpectation("0-1", false), peg$c18 = function() {
    return ["0-1"];
  }, peg$c19 = "1/2-1/2", peg$c20 = peg$literalExpectation("1/2-1/2", false), peg$c21 = function() {
    return ["1/2-1/2"];
  }, peg$c22 = "*", peg$c23 = peg$literalExpectation("*", false), peg$c24 = function() {
    return ["*"];
  }, peg$c25 = /^[^}]/, peg$c26 = peg$classExpectation(["}"], true, false), peg$c27 = function(cm) {
    return cm.join("").trim();
  }, peg$c28 = "{", peg$c29 = peg$literalExpectation("{", false), peg$c30 = "}", peg$c31 = peg$literalExpectation("}", false), peg$c32 = function(vari, all, me) {
    var arr = all ? all : [];
    arr.unshift(vari);
    return arr;
  }, peg$c33 = function(vari, all) {
    var arr = all ? all : [];
    arr.unshift(vari);
    return arr;
  }, peg$c34 = "(", peg$c35 = peg$literalExpectation("(", false), peg$c36 = ")", peg$c37 = peg$literalExpectation(")", false), peg$c38 = ".", peg$c39 = peg$literalExpectation(".", false), peg$c40 = function(num) {
    return num;
  }, peg$c41 = peg$otherExpectation("integer"), peg$c42 = /^[0-9]/, peg$c43 = peg$classExpectation([["0", "9"]], false, false), peg$c44 = function(digits) {
    return makeInteger(digits);
  }, peg$c45 = " ", peg$c46 = peg$literalExpectation(" ", false), peg$c47 = function() {
    return "";
  }, peg$c48 = function(fig, disc, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.disc = disc ? disc : null;
    hm.strike = str ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.promotion = pr;
    hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
    return hm;
  }, peg$c49 = function(fig, cols, rows, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.strike = str == "x" ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.notation = (fig && fig !== "P" ? fig : "") + cols + rows + (str == "x" ? str : "-") + col + row + (pr ? pr : "") + (ch ? ch : "");
    hm.promotion = pr;
    return hm;
  }, peg$c50 = function(fig, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.strike = str ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.notation = (fig ? fig : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
    hm.promotion = pr;
    return hm;
  }, peg$c51 = "O-O-O", peg$c52 = peg$literalExpectation("O-O-O", false), peg$c53 = function(ch) {
    var hm = {};
    hm.notation = "O-O-O" + (ch ? ch : "");
    hm.check = ch ? ch : null;
    return hm;
  }, peg$c54 = "O-O", peg$c55 = peg$literalExpectation("O-O", false), peg$c56 = function(ch) {
    var hm = {};
    hm.notation = "O-O" + (ch ? ch : "");
    hm.check = ch ? ch : null;
    return hm;
  }, peg$c57 = "+-", peg$c58 = peg$literalExpectation("+-", false), peg$c59 = "+", peg$c60 = peg$literalExpectation("+", false), peg$c61 = function(ch) {
    return ch[1];
  }, peg$c62 = "$$$", peg$c63 = peg$literalExpectation("$$$", false), peg$c64 = "#", peg$c65 = peg$literalExpectation("#", false), peg$c66 = "=", peg$c67 = peg$literalExpectation("=", false), peg$c68 = function(f) {
    return "=" + f;
  }, peg$c69 = function(nag, nags) {
    var arr = nags ? nags : [];
    arr.unshift(nag);
    return arr;
  }, peg$c70 = "$", peg$c71 = peg$literalExpectation("$", false), peg$c72 = function(num) {
    return "$" + num;
  }, peg$c73 = "!!", peg$c74 = peg$literalExpectation("!!", false), peg$c75 = function() {
    return "$3";
  }, peg$c76 = "??", peg$c77 = peg$literalExpectation("??", false), peg$c78 = function() {
    return "$4";
  }, peg$c79 = "!?", peg$c80 = peg$literalExpectation("!?", false), peg$c81 = function() {
    return "$5";
  }, peg$c82 = "?!", peg$c83 = peg$literalExpectation("?!", false), peg$c84 = function() {
    return "$6";
  }, peg$c85 = "!", peg$c86 = peg$literalExpectation("!", false), peg$c87 = function() {
    return "$1";
  }, peg$c88 = "?", peg$c89 = peg$literalExpectation("?", false), peg$c90 = function() {
    return "$2";
  }, peg$c91 = "‼", peg$c92 = peg$literalExpectation("‼", false), peg$c93 = "⁇", peg$c94 = peg$literalExpectation("⁇", false), peg$c95 = "⁉", peg$c96 = peg$literalExpectation("⁉", false), peg$c97 = "⁈", peg$c98 = peg$literalExpectation("⁈", false), peg$c99 = "□", peg$c100 = peg$literalExpectation("□", false), peg$c101 = function() {
    return "$7";
  }, peg$c102 = function() {
    return "$10";
  }, peg$c103 = "∞", peg$c104 = peg$literalExpectation("∞", false), peg$c105 = function() {
    return "$13";
  }, peg$c106 = "⩲", peg$c107 = peg$literalExpectation("⩲", false), peg$c108 = function() {
    return "$14";
  }, peg$c109 = "⩱", peg$c110 = peg$literalExpectation("⩱", false), peg$c111 = function() {
    return "$15";
  }, peg$c112 = "±", peg$c113 = peg$literalExpectation("±", false), peg$c114 = function() {
    return "$16";
  }, peg$c115 = "∓", peg$c116 = peg$literalExpectation("∓", false), peg$c117 = function() {
    return "$17";
  }, peg$c118 = function() {
    return "$18";
  }, peg$c119 = "-+", peg$c120 = peg$literalExpectation("-+", false), peg$c121 = function() {
    return "$19";
  }, peg$c122 = "⨀", peg$c123 = peg$literalExpectation("⨀", false), peg$c124 = function() {
    return "$22";
  }, peg$c125 = "⟳", peg$c126 = peg$literalExpectation("⟳", false), peg$c127 = function() {
    return "$32";
  }, peg$c128 = "→", peg$c129 = peg$literalExpectation("→", false), peg$c130 = function() {
    return "$36";
  }, peg$c131 = "↑", peg$c132 = peg$literalExpectation("↑", false), peg$c133 = function() {
    return "$40";
  }, peg$c134 = "⇆", peg$c135 = peg$literalExpectation("⇆", false), peg$c136 = function() {
    return "$132";
  }, peg$c137 = "D", peg$c138 = peg$literalExpectation("D", false), peg$c139 = function() {
    return "$220";
  }, peg$c140 = /^[RNBQKP]/, peg$c141 = peg$classExpectation(["R", "N", "B", "Q", "K", "P"], false, false), peg$c142 = /^[a-h]/, peg$c143 = peg$classExpectation([["a", "h"]], false, false), peg$c144 = /^[1-8]/, peg$c145 = peg$classExpectation([["1", "8"]], false, false), peg$c146 = "x", peg$c147 = peg$literalExpectation("x", false), peg$c148 = "-", peg$c149 = peg$literalExpectation("-", false), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location2
    );
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected2, found),
      expected2,
      found,
      location2
    );
  }
  function peg$parsepgn() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parsepgnStartWhite();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnBlack();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsepgnStartBlack();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsepgnWhite();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c1(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsewhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2();
        }
        s0 = s1;
      }
    }
    return s0;
  }
  function peg$parsepgnStartWhite() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsepgnWhite();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c3(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsepgnStartBlack() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsepgnBlack();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c4(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsepgnWhite() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
    s0 = peg$currPos;
    s1 = peg$parsewhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomment();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhiteSpace();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveNumber();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhiteSpace();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomment();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhiteSpace();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsewhiteSpace();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsewhiteSpace();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomment();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsewhiteSpace();
                            if (s13 === peg$FAILED) {
                              s13 = null;
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsevariationWhite();
                              if (s14 === peg$FAILED) {
                                s14 = peg$parsevariationBlack();
                              }
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsepgnBlack();
                                if (s15 === peg$FAILED) {
                                  s15 = null;
                                }
                                if (s15 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c5(s2, s4, s6, s8, s10, s12, s14, s15);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }
    return s0;
  }
  function peg$parsepgnBlack() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
    s0 = peg$currPos;
    s1 = peg$parsewhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomment();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhiteSpace();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveEllipse();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhiteSpace();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomment();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhiteSpace();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsewhiteSpace();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsewhiteSpace();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomment();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsewhiteSpace();
                            if (s13 === peg$FAILED) {
                              s13 = null;
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsevariationBlack();
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsepgnWhite();
                                if (s15 === peg$FAILED) {
                                  s15 = null;
                                }
                                if (s15 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c6(s2, s4, s6, s8, s10, s12, s14, s15);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }
    return s0;
  }
  function peg$parseendGame() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c7) {
      s1 = peg$c7;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c8);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c9();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c10) {
        s1 = peg$c10;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c11);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c12();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c13) {
          s1 = peg$c13;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c14);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c15();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c17);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c19) {
              s1 = peg$c19;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c20);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c21();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c22;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c23);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24();
              }
              s0 = s1;
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsecomment() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsecl();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c25.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c26);
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c25.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecr();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c27(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecl() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 123) {
      s0 = peg$c28;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c29);
      }
    }
    return s0;
  }
  function peg$parsecr() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 125) {
      s0 = peg$c30;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c31);
      }
    }
    return s0;
  }
  function peg$parsevariationWhite() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnWhite();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsewhiteSpace();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationWhite();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsewhiteSpace();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsemoveEllipse();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c32(s2, s5, s7);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsevariationBlack() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnStartBlack();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsewhiteSpace();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationBlack();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c33(s2, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepl() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 40) {
      s0 = peg$c34;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c35);
      }
    }
    return s0;
  }
  function peg$parsepr() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 41) {
      s0 = peg$c36;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c37);
      }
    }
    return s0;
  }
  function peg$parsemoveNumber() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c38;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c39);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c40(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseinteger() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c42.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c43);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c42.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c44(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c41);
      }
    }
    return s0;
  }
  function peg$parsewhiteSpace() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s2 = peg$c45;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c46);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c45;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c46);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c47();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsehalfMove() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;
    s0 = peg$currPos;
    s1 = peg$parsefigure();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      peg$silentFails++;
      s3 = peg$parsecheckdisc();
      peg$silentFails--;
      if (s3 !== peg$FAILED) {
        peg$currPos = s2;
        s2 = void 0;
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsediscriminator();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsestrike();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecolumn();
            if (s5 !== peg$FAILED) {
              s6 = peg$parserow();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsepromotion();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsecheck();
                  if (s8 === peg$FAILED) {
                    s8 = null;
                  }
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c48(s1, s3, s4, s5, s6, s7, s8);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsefigure();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsecolumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parserow();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsestrikeOrDash();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecolumn();
              if (s5 !== peg$FAILED) {
                s6 = peg$parserow();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsepromotion();
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsecheck();
                    if (s8 === peg$FAILED) {
                      s8 = null;
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c49(s1, s2, s3, s4, s5, s6, s7, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsefigure();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsestrike();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsecolumn();
            if (s3 !== peg$FAILED) {
              s4 = peg$parserow();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsepromotion();
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecheck();
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c50(s1, s2, s3, s4, s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 5) === peg$c51) {
            s1 = peg$c51;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c52);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecheck();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c53(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c54) {
              s1 = peg$c54;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c55);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsecheck();
              if (s2 === peg$FAILED) {
                s2 = null;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c56(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsecheck() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    peg$silentFails++;
    if (input.substr(peg$currPos, 2) === peg$c57) {
      s3 = peg$c57;
      peg$currPos += 2;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c58);
      }
    }
    peg$silentFails--;
    if (s3 === peg$FAILED) {
      s2 = void 0;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 43) {
        s3 = peg$c59;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c60);
        }
      }
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c61(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c62) {
        s3 = peg$c62;
        peg$currPos += 3;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c63);
        }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = void 0;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 35) {
          s3 = peg$c64;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c65);
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c61(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsepromotion() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 61) {
      s1 = peg$c66;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c67);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsefigure();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c68(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenags() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsenag();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsewhiteSpace();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenags();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenag() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 36) {
      s1 = peg$c70;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c71);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseinteger();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c72(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c73) {
        s1 = peg$c73;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c74);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c75();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c76) {
          s1 = peg$c76;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c77);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c78();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c79) {
            s1 = peg$c79;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c80);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c81();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c82) {
              s1 = peg$c82;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c83);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c84();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 33) {
                s1 = peg$c85;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c86);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c87();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 63) {
                  s1 = peg$c88;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c89);
                  }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c90();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 8252) {
                    s1 = peg$c91;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c92);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c75();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 8263) {
                      s1 = peg$c93;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c94);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c78();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 8265) {
                        s1 = peg$c95;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c96);
                        }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c81();
                      }
                      s0 = s1;
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 8264) {
                          s1 = peg$c97;
                          peg$currPos++;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c98);
                          }
                        }
                        if (s1 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c84();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 9633) {
                            s1 = peg$c99;
                            peg$currPos++;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c100);
                            }
                          }
                          if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c101();
                          }
                          s0 = s1;
                          if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 61) {
                              s1 = peg$c66;
                              peg$currPos++;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$c67);
                              }
                            }
                            if (s1 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c102();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;
                              if (input.charCodeAt(peg$currPos) === 8734) {
                                s1 = peg$c103;
                                peg$currPos++;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$c104);
                                }
                              }
                              if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c105();
                              }
                              s0 = s1;
                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 10866) {
                                  s1 = peg$c106;
                                  peg$currPos++;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$c107);
                                  }
                                }
                                if (s1 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c108();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;
                                  if (input.charCodeAt(peg$currPos) === 10865) {
                                    s1 = peg$c109;
                                    peg$currPos++;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                      peg$fail(peg$c110);
                                    }
                                  }
                                  if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c111();
                                  }
                                  s0 = s1;
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.charCodeAt(peg$currPos) === 177) {
                                      s1 = peg$c112;
                                      peg$currPos++;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$c113);
                                      }
                                    }
                                    if (s1 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c114();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$currPos;
                                      if (input.charCodeAt(peg$currPos) === 8723) {
                                        s1 = peg$c115;
                                        peg$currPos++;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                          peg$fail(peg$c116);
                                        }
                                      }
                                      if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c117();
                                      }
                                      s0 = s1;
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.substr(peg$currPos, 2) === peg$c57) {
                                          s1 = peg$c57;
                                          peg$currPos += 2;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) {
                                            peg$fail(peg$c58);
                                          }
                                        }
                                        if (s1 !== peg$FAILED) {
                                          peg$savedPos = s0;
                                          s1 = peg$c118();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$currPos;
                                          if (input.substr(peg$currPos, 2) === peg$c119) {
                                            s1 = peg$c119;
                                            peg$currPos += 2;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                              peg$fail(peg$c120);
                                            }
                                          }
                                          if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c121();
                                          }
                                          s0 = s1;
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.charCodeAt(peg$currPos) === 10752) {
                                              s1 = peg$c122;
                                              peg$currPos++;
                                            } else {
                                              s1 = peg$FAILED;
                                              if (peg$silentFails === 0) {
                                                peg$fail(peg$c123);
                                              }
                                            }
                                            if (s1 !== peg$FAILED) {
                                              peg$savedPos = s0;
                                              s1 = peg$c124();
                                            }
                                            s0 = s1;
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$currPos;
                                              if (input.charCodeAt(peg$currPos) === 10227) {
                                                s1 = peg$c125;
                                                peg$currPos++;
                                              } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                  peg$fail(peg$c126);
                                                }
                                              }
                                              if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c127();
                                              }
                                              s0 = s1;
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                if (input.charCodeAt(peg$currPos) === 8594) {
                                                  s1 = peg$c128;
                                                  peg$currPos++;
                                                } else {
                                                  s1 = peg$FAILED;
                                                  if (peg$silentFails === 0) {
                                                    peg$fail(peg$c129);
                                                  }
                                                }
                                                if (s1 !== peg$FAILED) {
                                                  peg$savedPos = s0;
                                                  s1 = peg$c130();
                                                }
                                                s0 = s1;
                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$currPos;
                                                  if (input.charCodeAt(peg$currPos) === 8593) {
                                                    s1 = peg$c131;
                                                    peg$currPos++;
                                                  } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                      peg$fail(peg$c132);
                                                    }
                                                  }
                                                  if (s1 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c133();
                                                  }
                                                  s0 = s1;
                                                  if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.charCodeAt(peg$currPos) === 8646) {
                                                      s1 = peg$c134;
                                                      peg$currPos++;
                                                    } else {
                                                      s1 = peg$FAILED;
                                                      if (peg$silentFails === 0) {
                                                        peg$fail(peg$c135);
                                                      }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                      peg$savedPos = s0;
                                                      s1 = peg$c136();
                                                    }
                                                    s0 = s1;
                                                    if (s0 === peg$FAILED) {
                                                      s0 = peg$currPos;
                                                      if (input.charCodeAt(peg$currPos) === 68) {
                                                        s1 = peg$c137;
                                                        peg$currPos++;
                                                      } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                          peg$fail(peg$c138);
                                                        }
                                                      }
                                                      if (s1 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c139();
                                                      }
                                                      s0 = s1;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsediscriminator() {
    var s0;
    s0 = peg$parsecolumn();
    if (s0 === peg$FAILED) {
      s0 = peg$parserow();
    }
    return s0;
  }
  function peg$parsecheckdisc() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$parsediscriminator();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsestrike();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecolumn();
        if (s3 !== peg$FAILED) {
          s4 = peg$parserow();
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsemoveEllipse() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c38;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c39);
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (input.charCodeAt(peg$currPos) === 46) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c39);
            }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c40(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefigure() {
    var s0;
    if (peg$c140.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c141);
      }
    }
    return s0;
  }
  function peg$parsecolumn() {
    var s0;
    if (peg$c142.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c143);
      }
    }
    return s0;
  }
  function peg$parserow() {
    var s0;
    if (peg$c144.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c145);
      }
    }
    return s0;
  }
  function peg$parsestrike() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c146;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c147);
      }
    }
    return s0;
  }
  function peg$parsestrikeOrDash() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c146;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c147);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c148;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c149);
        }
      }
    }
    return s0;
  }
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}
var pgnParser = class {
  static parse(history, options) {
    return peg$parse(history, options);
  }
};

// node_modules/cm-pgn/src/History.js
function IllegalMoveException(fen, notation) {
  this.fen = fen;
  this.notation = notation;
  this.toString = function() {
    return "IllegalMoveException: " + fen + " => " + notation;
  };
}
var History = class {
  constructor(historyString = null, props = {}) {
    this.props = {
      setUpFen: null,
      sloppy: false,
      chess960: false,
      ...props
    };
    if (typeof props !== "object") {
      console.error("History constructor: setUpFen and sloppy properties are deprecated, use props instead");
    }
    if (!historyString) {
      this.clear();
    } else {
      const parsedMoves = pgnParser.parse(
        historyString.replace(/\s\s+/g, " ").replace(/\n/g, " ")
      );
      this.moves = this.traverse(parsedMoves[0], this.props.setUpFen, null, 1, this.props.sloppy);
    }
  }
  clear() {
    this.moves = [];
  }
  traverse(parsedMoves, fen, parent = null, ply = 1, sloppy = false) {
    let chess;
    const options = { chess960: !!this.props.chess960 };
    chess = fen ? new Chess(fen, options) : new Chess(options);
    const moves = [];
    let previousMove = parent;
    for (let parsedMove of parsedMoves) {
      if (parsedMove.notation) {
        const notation = parsedMove.notation.notation;
        const move = chess.move(notation, { sloppy });
        if (move) {
          if (previousMove) {
            if (!move.previous) {
              move.previous = previousMove;
            }
            if (!previousMove.next) {
              previousMove.next = move;
            }
          } else {
            move.previous = null;
          }
          move.ply = ply;
          this.fillMoveFromChessState(move, chess);
          if (parsedMove.nag) {
            move.nag = parsedMove.nag[0];
          }
          if (parsedMove.commentBefore) {
            move.commentBefore = parsedMove.commentBefore;
          }
          if (parsedMove.commentMove) {
            move.commentMove = parsedMove.commentMove;
          }
          if (parsedMove.commentAfter) {
            move.commentAfter = parsedMove.commentAfter;
          }
          move.variations = [];
          const parsedVariations = parsedMove.variations;
          if (parsedVariations.length > 0) {
            const lastFen = moves.length > 0 ? moves[moves.length - 1].fen : fen;
            for (let parsedVariation of parsedVariations) {
              move.variations.push(this.traverse(parsedVariation, lastFen, previousMove, ply, sloppy));
            }
          }
          move.variation = moves;
          moves.push(move);
          previousMove = move;
        } else {
          throw new IllegalMoveException(chess.fen(), notation);
        }
      }
      ply++;
    }
    return moves;
  }
  fillMoveFromChessState(move, chess) {
    move.fen = chess.fen();
    move.uci = move.from + move.to + (move.promotion ? move.promotion : "");
    move.variations = [];
    if (chess.game_over()) {
      move.gameOver = true;
      if (chess.in_draw()) {
        move.inDraw = true;
      }
      if (chess.in_stalemate()) {
        move.inStalemate = true;
      }
      if (chess.insufficient_material()) {
        move.insufficientMaterial = true;
      }
      if (chess.in_threefold_repetition()) {
        move.inThreefoldRepetition = true;
      }
      if (chess.in_checkmate()) {
        move.inCheckmate = true;
      }
    }
    if (chess.in_check()) {
      move.inCheck = true;
    }
  }
  /**
   * @param move
   * @return the history to the move which may be in a variation
   */
  historyToMove(move) {
    const moves = [];
    let pointer = move;
    moves.push(pointer);
    while (pointer.previous) {
      moves.push(pointer.previous);
      pointer = pointer.previous;
    }
    return moves.reverse();
  }
  /**
   * Don't add the move, just validate, if it would be correct
   * @param notation
   * @param previous
   * @param sloppy
   * @returns {[]|{}}
   */
  validateMove(notation, previous = null, sloppy = true) {
    if (!previous) {
      if (this.moves.length > 0) {
        previous = this.moves[this.moves.length - 1];
      }
    }
    let chess;
    const options = { chess960: !!this.props.chess960 };
    chess = new Chess(this.props.setUpFen ? this.props.setUpFen : void 0, options);
    if (previous) {
      const historyToMove = this.historyToMove(previous);
      for (const moveInHistory of historyToMove) {
        chess.move(moveInHistory);
      }
    }
    const move = chess.move(notation, { sloppy });
    if (move) {
      this.fillMoveFromChessState(move, chess);
    }
    return move;
  }
  addMove(notation, previous = null, sloppy = true) {
    if (!previous) {
      if (this.moves.length > 0) {
        previous = this.moves[this.moves.length - 1];
      }
    }
    const move = this.validateMove(notation, previous, sloppy);
    if (!move) {
      throw new Error("invalid move");
    }
    move.previous = previous;
    if (previous) {
      move.ply = previous.ply + 1;
      move.uci = move.from + move.to + (move.promotion ? move.promotion : "");
      if (previous.next) {
        previous.next.variations.push([]);
        move.variation = previous.next.variations[previous.next.variations.length - 1];
        move.variation.push(move);
      } else {
        previous.next = move;
        move.variation = previous.variation;
        previous.variation.push(move);
      }
    } else {
      move.variation = this.moves;
      move.ply = 1;
      this.moves.push(move);
    }
    return move;
  }
  render(renderComments = true, renderNags = true) {
    const renderVariation = (variation, needReminder = false) => {
      let result = "";
      for (let move of variation) {
        if (move.ply % 2 === 1) {
          result += Math.floor(move.ply / 2) + 1 + ". ";
        } else if (result.length === 0 || needReminder) {
          result += move.ply / 2 + "... ";
        }
        needReminder = false;
        if (renderNags && move.nag) {
          result += "$" + move.nag + " ";
        }
        if (renderComments && move.commentBefore) {
          result += "{" + move.commentBefore + "} ";
          needReminder = true;
        }
        result += move.san + " ";
        if (renderComments && move.commentMove) {
          result += "{" + move.commentMove + "} ";
          needReminder = true;
        }
        if (renderComments && move.commentAfter) {
          result += "{" + move.commentAfter + "} ";
          needReminder = true;
        }
        if (move.variations.length > 0) {
          for (let variation2 of move.variations) {
            result += "(" + renderVariation(variation2) + ") ";
            needReminder = true;
          }
        }
        result += " ";
      }
      return result;
    };
    let ret = renderVariation(this.moves);
    ret = ret.replace(/\s+\)/g, ")");
    ret = ret.replace(/\s\s+/g, " ").trim();
    return ret;
  }
};

// node_modules/cm-pgn/src/Pgn.js
var Pgn = class {
  constructor(pgnString = "", props = {}) {
    const lastHeaderElement = pgnString.trim().slice(-1) === "]" ? pgnString.length : pgnString.lastIndexOf("]\n\n") + 1;
    const headerString = pgnString.substring(0, lastHeaderElement);
    const historyString = pgnString.substring(lastHeaderElement);
    this.props = {
      sloppy: false,
      chess960: false,
      ...props
    };
    this.header = new Header(headerString);
    const variant = this.header.tags[TAGS.Variant];
    if (variant && (variant.toLowerCase() === "chess960" || variant.toLowerCase() === "freestyle" || variant.toLowerCase() === "fischerandom")) {
      this.props.chess960 = true;
    }
    if (this.header.tags[TAGS.SetUp] === "1" && this.header.tags[TAGS.FEN]) {
      this.history = new History(historyString, {
        setUpFen: this.header.tags[TAGS.FEN],
        sloppy: this.props.sloppy,
        chess960: this.props.chess960
      });
    } else {
      this.history = new History(historyString, { sloppy: this.props.sloppy, chess960: this.props.chess960 });
    }
  }
  wrap(str, maxLength) {
    const words = str.split(" ");
    let lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (line.length + word.length < maxLength) {
        line += word + " ";
      } else {
        lines.push(line.trim());
        line = word + " ";
      }
    }
    lines.push(line.trim());
    return lines.join("\n");
  }
  render(renderHeader = true, renderComments = true, renderNags = true) {
    const header = renderHeader ? this.header.render() + "\n" : "";
    let history = this.history.render(renderComments, renderNags);
    if (this.header.tags[TAGS.Result]) {
      history += " " + this.header.tags[TAGS.Result];
    }
    return header + this.wrap(history, 80);
  }
};

// node_modules/cm-chess/src/Chess.js
var PIECES = {
  p: { name: "pawn", value: 1 },
  n: { name: "knight", value: 3 },
  b: { name: "bishop", value: 3 },
  r: { name: "rook", value: 5 },
  q: { name: "queen", value: 9 },
  k: { name: "king", value: Infinity }
};
var COLOR = {
  white: "w",
  black: "b"
};
var FEN = {
  empty: "8/8/8/8/8/8/8/8 w - - 0 1",
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
};
var EVENT_TYPE = {
  illegalMove: "illegalMove",
  legalMove: "legalMove",
  undoMove: "undoMove",
  initialized: "initialized"
};
var GAME_VARIANT = {
  standard: "standard",
  chess960: "chess960"
  //  kingOfTheHill: "kingOfTheHill",
  //  threeCheck: "threeCheck",
  //  antichess: "antichess",
  //  atomic: "atomic",
  //  horde: "horde",
  //  racingKings: "racingKings",
  //  crazyhouse: "crazyhouse"
};
function publishEvent(observers, event) {
  for (const observer of observers) {
    setTimeout(() => {
      observer(event);
    });
  }
}
var Chess2 = class {
  /**
   * @param props {object}
   * - an object with these properties:
   *      fen: a FEN string
   *      pgn: a PGN
   *      gameVariant:
   *      chess960: true, if chess960 are used
   *      sloppy: true, if sloppy parsing is allowed
   */
  constructor(props = {}) {
    this.observers = [];
    this.props = {
      fen: void 0,
      // use a fen or a pgn with setUpFen
      pgn: void 0,
      gameVariant: GAME_VARIANT.standard,
      chess960: void 0,
      sloppy: true,
      // sloppy parsing allows small mistakes in SAN
      ...props
    };
    if (this.props.chess960 !== void 0) {
      console.warn("props.chess960 is deprecated, use GAME_VARIANT");
      this.props.gameVariant = GAME_VARIANT.chess960;
    }
    if (typeof props === "string") {
      console.warn('directly passing a FEN is deprecated, use `{fen: "' + props + '"}`');
      this.props.fen = props;
    }
    if (!this.props.fen && !this.props.pgn) {
      this.props.fen = FEN.start;
    }
    if (this.props.fen) {
      this.load(this.props.fen);
    } else if (this.props.pgn) {
      this.loadPgn(this.props.pgn);
    } else {
      this.load(FEN.start);
    }
  }
  /**
   * @returns {string} the FEN of the last move, or the setUpFen(), if no move was made.
   */
  fen(move = this.lastMove()) {
    if (move) {
      return move.fen;
    } else {
      return this.setUpFen();
    }
  }
  /**
   * @returns {string} the setUp FEN in the header or the default start-FEN
   */
  setUpFen() {
    if (this.pgn.header.tags[TAGS.SetUp]) {
      return this.pgn.header.tags[TAGS.FEN];
    } else {
      return FEN.start;
    }
  }
  /**
   * @returns {Map<string, string>} the header tags of the PGN.
   */
  header() {
    return this.pgn.header.tags;
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is over at that move
   */
  gameOver(move = this.lastMove()) {
    if (move) {
      return move.gameOver;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).game_over();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw at that move
   */
  inDraw(move = this.lastMove()) {
    if (move) {
      return move.inDraw === true;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).in_draw();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in statemate at that move
   */
  inStalemate(move = this.lastMove()) {
    if (move) {
      return move.inStalemate === true;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).in_stalemate();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw, because of unsufficiant material at that move
   */
  insufficientMaterial(move = this.lastMove()) {
    if (move) {
      return move.insufficientMaterial === true;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).insufficient_material();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw, because of threefold repetition at that move
   */
  inThreefoldRepetition(move = this.lastMove()) {
    return move && move.inThreefoldRepetition === true;
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in checkmate at that move
   */
  inCheckmate(move = this.lastMove()) {
    if (move) {
      return move.inCheckmate === true;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).in_checkmate();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in check at that move
   */
  inCheck(move = this.lastMove()) {
    if (move) {
      return move.inCheck === true;
    } else {
      return new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }).in_check();
    }
  }
  /**
   * cm-chess uses cm-pgn for the history and header. See https://github.com/shaack/cm-pgn
   * @returns {[]} the moves of the game history
   */
  history() {
    return this.pgn.history.moves;
  }
  /**
   * @returns {null|move} the last move of the main variation or `null`, if no move was made
   */
  lastMove() {
    if (this.pgn.history.moves.length > 0) {
      return this.pgn.history.moves[this.pgn.history.moves.length - 1];
    } else {
      return null;
    }
  }
  /**
   * Load a FEN
   * @param fen
   */
  load(fen) {
    const chess = new Chess(fen, { chess960: this.props.gameVariant === GAME_VARIANT.chess960 });
    if (chess && chess.fen() === fen) {
      this.pgn = new Pgn(void 0, { chess960: this.props.gameVariant === GAME_VARIANT.chess960 });
      if (fen !== FEN.start) {
        this.pgn.header.tags[TAGS.SetUp] = "1";
        this.pgn.header.tags[TAGS.FEN] = chess.fen();
        this.pgn.history.props.setUpFen = fen;
      }
    } else {
      throw Error("Invalid fen " + fen);
    }
    publishEvent(this.observers, { type: EVENT_TYPE.initialized, fen });
  }
  /**
   * Load a PGN with variations, NAGs, header and annotations. cm-chess uses cm-pgn
   * for the header and history. See https://github.com/shaack/cm-pgn
   * @param pgn
   * @param sloppy to allow sloppy SAN
   */
  loadPgn(pgn, sloppy = this.props.sloppy) {
    this.pgn = new Pgn(pgn, { sloppy });
    if (this.pgn.props.chess960) {
      this.props.gameVariant = GAME_VARIANT.chess960;
    }
    publishEvent(this.observers, { type: EVENT_TYPE.initialized, pgn });
  }
  /**
   * Make a move in the game.
   * @param move
   * @param previousMove optional, the previous move (for variations)
   * @param sloppy to allow sloppy SAN
   * @returns {{}|null}
   */
  move(move, previousMove = void 0, sloppy = this.props.sloppy) {
    try {
      const moveResult = this.pgn.history.addMove(move, previousMove, sloppy);
      publishEvent(
        this.observers,
        { type: EVENT_TYPE.legalMove, move: moveResult, previousMove }
      );
      return moveResult;
    } catch (e) {
      publishEvent(
        this.observers,
        { type: EVENT_TYPE.illegalMove, move, previousMove }
      );
      return null;
    }
  }
  /**
   * Return all valid moves
   * @param options {{ square: "e2", piece: "n", verbose: true }}
   * Fields with { verbose: true }
   * - `color` indicates the color of the moving piece (w or b).
   * - `from` and `to` fields are from and to squares in algebraic notation.
   * - `piece`, `captured`, and `promotion` fields contain the lowercase representation of the applicable piece (pnbrqk). The captured and promotion fields are only present when the move is a valid capture or promotion.
   * - `san` is the move in Standard Algebraic Notation (SAN).
   * - `flags` field contains one or more of the string values:
   *      n - a non-capture
   *      b - a pawn push of two squares
   *      e - an en passant capture
   *      c - a standard capture
   *      p - a promotion
   *      k - kingside castling
   *      q - queenside castling
   *   A flags value of pc would mean that a pawn captured a piece on the 8th rank and promoted.
   * @param move
   * @returns {{}}
   */
  moves(options = void 0, move = this.lastMove()) {
    const chessJs = new Chess(this.fen(move), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 });
    return chessJs.moves(options);
  }
  /**
   * Don't make a move, just validate, if it would be a correct move
   * @param move
   * @param previousMove optional, the previous move (for variations)
   * @param sloppy to allow sloppy SAN
   * @returns the move object or null if not valid
   */
  validateMove(move, previousMove = void 0, sloppy = this.props.sloppy) {
    return this.pgn.history.validateMove(move, previousMove, sloppy);
  }
  /**
   * Render the game as PGN with header, comments and NAGs
   * @param renderHeader optional, default true
   * @param renderComments optional, default true
   * @param renderNags optional, default true
   * @returns {string} the PGN of the game.
   */
  renderPgn(renderHeader = true, renderComments = true, renderNags = true) {
    return this.pgn.render(renderHeader, renderComments, renderNags);
  }
  /**
   * Get the position of the specified figures at a specific move
   * @param type "p", "n", "b",...
   * @param color "b" or "w"
   * @param move
   * @returns {[]} the pieces (positions) at a specific move
   */
  pieces(type = void 0, color = void 0, move = this.lastMove()) {
    const chessJs = move ? new Chess(move.fen, { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }) : new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 });
    let result = [];
    for (let i = 0; i < 64; i++) {
      const square = SQUARES[i];
      const piece = chessJs.get(square);
      if (piece) {
        piece.square = square;
      }
      if (!type) {
        if (!color && piece) {
          result.push(piece);
        }
      } else if (!color && piece && piece.type === type) {
        result.push(piece);
      } else if (piece && piece.color === color && piece.type === type) {
        result.push(piece);
      }
    }
    return result;
  }
  /**
   * get the piece on a square
   * @param square
   * @param move
   * @returns {{color: any, type: any}|null}
   */
  piece(square, move = this.lastMove()) {
    const chessJs = move ? new Chess(move.fen, { chess960: this.props.gameVariant === GAME_VARIANT.chess960 }) : new Chess(this.fen(), { chess960: this.props.gameVariant === GAME_VARIANT.chess960 });
    return chessJs.get(square);
  }
  /**
   * @param move
   * @returns {string} "b" or "w" the color to move in the main variation
   */
  turn(move = this.lastMove()) {
    let factor = 0;
    if (this.setUpFen()) {
      const fenParts = this.setUpFen().split(" ");
      if (fenParts[1] === COLOR.black) {
        factor = 1;
      }
    }
    const ply = move ? move.ply : 0;
    return ply % 2 === factor ? COLOR.white : COLOR.black;
  }
  /**
   * Undo a move and all moves after it
   * @param move
   */
  undo(move = this.lastMove()) {
    if (move.previous) {
      move.previous.next = void 0;
    }
    const index = move.variation.findIndex((element) => {
      return element.ply === move.ply;
    });
    move.variation = move.variation.splice(index);
    publishEvent(this.observers, { type: EVENT_TYPE.undoMove, move });
  }
  plyCount() {
    return this.history().length;
  }
  fenOfPly(plyNumber) {
    if (plyNumber > 0) {
      return this.history()[plyNumber - 1].fen;
    } else {
      return this.setUpFen();
    }
  }
  addObserver(callback) {
    this.observers.push(callback);
  }
};

export {
  PIECES,
  COLOR,
  FEN,
  GAME_VARIANT,
  Chess2 as Chess
};
//# sourceMappingURL=chunk-RHYLFANV.js.map
