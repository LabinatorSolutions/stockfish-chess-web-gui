document.addEventListener("DOMContentLoaded", function() {
    let game = new Chess();
    let useDepth = true;
    let currentMode = 'Player vs Engine';
    let board;

    function engineGame(options) {
        options = options || {};
        let engine = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(options.stockfishjs || './engine/stockfish-nnue-16-single.js');
        let evaler = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(options.stockfishjs || './engine/stockfish-nnue-16-single.js');
        let engineStatus = {};
        let displayScore = true;
        let playerColor = 'white';
        let isEngineRunning = false;
        let evaluation_el = document.getElementById("evaluation");
        let gameScoreEl = document.getElementById("game-score");
        let engineAnalysisEl = document.getElementById("engineAnalysis");
        let announced_game_over;
        let playerColorOriginal = playerColor;

        let onDragStart = function(source, piece, position, orientation) {
            if (currentMode === 'Player vs Player') {
                return !game.game_over();
            }
            let re = playerColor == 'white' ? /^b/ : /^w/;
            if (game.game_over() || piece.search(re) !== -1) {
                return false;
            }
        };

        let onClickPiece = function(source, target) {
            let move = game.move({
                from: source,
                to: target,
                promotion: document.getElementById("promote").value
            });
            if (move === null) return 'snapback';
            prepareMove();
        };

        setInterval(function() {
            if (announced_game_over) {
                return;
            }
            if (game.game_over()) {
                announced_game_over = true;
                $('#game-score').text("Game Over");
            }
        }, 1000);

        function uciCmd(cmd, which) {
            console.log("UCI: " + cmd);
            (which || engine).postMessage(cmd);
        }
        uciCmd('uci');

        function displayStatus() {
            let status = 'Stockfish 16 NNUE => ';
            if (engineStatus.search) {
                status += engineStatus.search + ' | ';
                if (engineStatus.score && displayScore) {
                    status += (engineStatus.score.substr(0, 4) === "Mate" ? " " : ' Score: ') + engineStatus.score;
                }
            }
            $('#game-score').html(status);
            updateScoreBar(engineStatus.score || 0);
        }

        function updateScoreBar(score) {
            let scoreBar = document.getElementById('score-bar');
            let maxScore = 10;
            let scorePercentage = (score / maxScore) * 50 + 50;

            scorePercentage = Math.max(0, Math.min(100, scorePercentage));

            scoreBar.style.height = scorePercentage + '%';
        }

        function get_moves() {
            let moves = '';
            let history = game.history({ verbose: true });

            for (let i = 0; i < history.length; ++i) {
                let move = history[i];
                moves += ' ' + move.from + move.to + (move.promotion ? move.promotion : '');
            }

            return moves;
        }

        function prepareMove() {
            $('#pgn').text(game.pgn());
            document.getElementById("pgnInput").value = game.pgn();
            document.getElementById("fenInput").value = game.fen();
            board.position(game.fen());
            if (currentMode === 'Player vs Engine') {
                let turn = game.turn() == 'w' ? 'white' : 'black';
                if (!game.game_over() && turn != playerColor) {
                    uciCmd('position startpos moves' + get_moves());
                    uciCmd('position startpos moves' + get_moves(), evaler);
                    evaluation_el.textContent = "";
                    engineAnalysisEl.textContent = "";
                    uciCmd("eval", evaler);

                    if (useDepth) {
                        let depth = parseInt(document.getElementById("depthLevel").value, 10);
                        depth = Math.max(1, Math.min(30, depth));
                        uciCmd("go depth " + depth);
                    } else {
                        let time = parseInt(document.getElementById("thinkingTime").value, 10) * 1000;
                        time = Math.max(1000, Math.min(30000, time));
                        uciCmd("go movetime " + time);
                    }
                    isEngineRunning = true;
                }
            }
        }

        evaler.onmessage = function(event) {
            let line;
            if (event && typeof event === "object") {
                line = event.data;
            } else {
                line = event;
            }
            console.log("evaler: " + line);
            if (line === "uciok" || line === "readyok" || line.substr(0, 11) === "option name") {
                return;
            }
            if (evaluation_el.textContent) {
                evaluation_el.textContent += "\n";
            }
            evaluation_el.textContent += line;
        };

        engine.onmessage = function(event) {
            let line;
            if (event && typeof event === "object") {
                line = event.data;
            } else {
                line = event;
            }
            console.log("Reply: " + line);
            if (line == 'uciok') {
                engineStatus.engineLoaded = true;
            } else if (line == 'readyok') {
                engineStatus.engineReady = true;
                displayStatus();
            } else {
                let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
                if (match) {
                    isEngineRunning = false;
                    game.move({ from: match[1], to: match[2], promotion: match[3] });
                    prepareMove();
                    uciCmd("eval", evaler);
                    evaluation_el.textContent = "";
                } else if (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                    engineStatus.search = 'Depth: ' + match[1] + ' Nps: ' + match[2];
                }
                if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                    let score = parseInt(match[2]) * (game.turn() == 'w' ? 1 : -1);
                    if (match[1] == 'cp') {
                        engineStatus.score = (score / 100.0).toFixed(2);
                    } else if (match[1] == 'mate') {
                        engineStatus.score = 'Mate in ' + Math.abs(score);
                    }
                    if (match = line.match(/\b(upper|lower)bound\b/)) {
                        engineStatus.score = ((match[1] == 'upper') == (game.turn() == 'w') ? '<= ' : '>= ') + engineStatus.score;
                    }
                }

                let analysisMatch = line.match(/^info .*\bpv ((?:[a-h][1-8][a-h][1-8][qrbn]? ?)+)/);
                if (analysisMatch) {
                    engineAnalysisEl.textContent = analysisMatch[1];
                }

                gameScoreEl.textContent = engineStatus.score;
            }
            displayStatus();
        };

        let onDrop = function(source, target) {
            let move = game.move({
                from: source,
                to: target,
                promotion: document.getElementById("promote").value
            });
            if (move === null) return 'snapback';
            prepareMove();
        };

        let onSnapEnd = function() {
            board.position(game.fen());
        };

        let onClick = function(source, target) {
            onClickPiece(source, target);
            prepareMove();
        };

        let cfg = {
            showErrors: true,
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd,
            onClick: onClick
        };

        board = new ChessBoard('board', cfg);

        return {
            reset: function() {
                game.reset();
                uciCmd('setoption name Contempt value 0');
                this.setSkillLevel(0);
                uciCmd('setoption name King Safety value 0');
                prepareMove();
            },
            setPlayerColor: function(color) {
                playerColor = color;
                board.orientation(playerColor);
            },
            setSkillLevel: function(skill) {
                if (skill < 0) {
                    skill = 0;
                }
                if (skill > 20) {
                    skill = 20;
                }
                uciCmd('setoption name Skill Level value ' + skill);
                let max_err = Math.round((skill * -0.5) + 10);
                let err_prob = Math.round((skill * 6.35) + 1);
                uciCmd('setoption name Skill Level Maximum Error value ' + max_err);
                uciCmd('setoption name Skill Level Probability value ' + err_prob);
            },
            setDepth: function(depth) {
                uciCmd('setoption name Depth value ' + depth);
            },
            setNodes: function(nodes) {
                uciCmd('setoption name Nodes value ' + nodes);
            },
            setContempt: function(contempt) {
                uciCmd('setoption name Contempt value ' + contempt);
            },
            setAggressiveness: function(value) {
                uciCmd('setoption name Aggressiveness value ' + value);
            },
            setDisplayScore: function(flag) {
                displayScore = flag;
                displayStatus();
            },
            start: function() {
                uciCmd('ucinewgame');
                uciCmd('isready');
                engineStatus.engineReady = false;
                engineStatus.search = null;
                displayStatus();
                prepareMove();
                announced_game_over = false;
            },
            undo: function() {
                game.undo();
                game.undo();
                prepareMove();
            },
            flipBoard: function() {
                board.flip();
            },
            switchBoard: function() {
                playerColorOriginal = playerColor;
                playerColor = (playerColor === 'white') ? 'black' : 'white';
                board.orientation(playerColor);
                prepareMove();
            },
            setMode: function(mode) {
                currentMode = mode;
                displayStatus();
            }
        };
    }

    let gameInstance = engineGame();

    function adjustScoreBarHeight() {
        const boardElement = document.getElementById('board');
        const scoreBarContainer = document.getElementById('score-bar-container');
        const boardHeight = boardElement.offsetHeight;
        scoreBarContainer.style.height = `${boardHeight}px`;
    }

    adjustScoreBarHeight();
    window.addEventListener('resize', adjustScoreBarHeight);

    document.getElementById("skillLevel").addEventListener("change", function() {
        let skillLevel_parsed = parseInt(this.value, 10);
        if (skillLevel_parsed > 20) {
            document.getElementById("skillLevel").value = 20;
        } else if (skillLevel_parsed < 0) {
            document.getElementById("skillLevel").value = 0;
        }
        gameInstance.setSkillLevel(skillLevel_parsed);
    });

    document.getElementById("depthLevel").addEventListener("change", function() {
        let depthLevel_parsed = parseInt(this.value, 10);
        if (depthLevel_parsed > 30) {
            document.getElementById("depthLevel").value = 30;
        } else if (depthLevel_parsed < 1) {
            document.getElementById("depthLevel").value = 1;
        }
        gameInstance.setDepth(depthLevel_parsed);
    });

    document.getElementById("thinkingTime").addEventListener("change", function() {
        let thinkingTime_parsed = parseInt(this.value, 10);
        if (thinkingTime_parsed > 30) {
            document.getElementById("thinkingTime").value = 30;
        } else if (thinkingTime_parsed < 1) {
            document.getElementById("thinkingTime").value = 1;
        }
    });

    document.getElementById("depthToggle").addEventListener("change", function() {
        useDepth = true;
    });

    document.getElementById("timeToggle").addEventListener("change", function() {
        useDepth = false;
    });

    document.getElementById("promote").addEventListener("change", function() {
        gameInstance.setPlayerColor(document.querySelector('input[name="color"]:checked').value);
    });

    document.getElementById("color-white").addEventListener("change", function() {
        gameInstance.setPlayerColor('white');
    });

    document.getElementById("color-black").addEventListener("change", function() {
        gameInstance.setPlayerColor('black');
    });

    document.getElementById("newGameBtn").addEventListener("click", function() {
        gameInstance.reset();
        gameInstance.start();
    });

    document.getElementById("takeBackBtn").addEventListener("click", function() {
        gameInstance.undo();
    });

    document.getElementById("flipBoardBtn").addEventListener("click", function() {
        gameInstance.flipBoard();
    });

    document.getElementById("switchBoardBtn").addEventListener("click", function() {
        gameInstance.switchBoard();
    });

    document.getElementById("resetGameBtn").addEventListener("click", function() {
        gameInstance.reset();
        gameInstance.start();
    });

    document.getElementById("gameMode").addEventListener("change", function() {
        gameInstance.setMode(this.value);
    });

    document.getElementById("copyPgnBtn").addEventListener("click", function() {
        const pgnText = game.pgn();
        document.getElementById("pgnInput").value = pgnText;
        navigator.clipboard.writeText(pgnText);
    });

    document.getElementById("copyFenBtn").addEventListener("click", function() {
        const fenText = game.fen();
        document.getElementById("fenInput").value = fenText;
        navigator.clipboard.writeText(fenText);
    });

    gameInstance.start();
});
