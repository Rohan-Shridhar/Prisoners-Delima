// Constants for moves
const COOPERATE = 0;
const DEFECT = 1;

// Payoff matrix: [player1_move][player2_move] = [player1_payoff, player2_payoff]
// Moves: 0 = Cooperate, 1 = Defect
// Payoffs:
// (C, C): Both cooperate -> 3, 3 (Reward)
// (C, D): Player1 cooperates, Player2 defects -> 0, 5 (Sucker, Temptation)
// (D, C): Player1 defects, Player2 cooperates -> 5, 0 (Temptation, Sucker)
// (D, D): Both defect -> 1, 1 (Punishment)
const PAYOFF_MATRIX = [
    // Player 2: Cooperate, Player 2: Defect
    [[3, 3], [0, 5]], // Player 1: Cooperate
    [[5, 0], [1, 1]]  // Player 1: Defect
];

// Strategy functions
// Each strategy's 'logic' property is now a function that returns another function.
// The returned function is the actual strategy logic and can maintain its own state via closure.
const STRATEGIES = {
    "Cooperate": {
        name: "One man",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => COOPERATE;
        }
    },
    "Defect": {
        name: "Zero man",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => DEFECT;
        }
    },
    "TitForTat": {
        name: "Tit-for-Tat",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (opponentHistory.length === 0) {
                    return COOPERATE;
                }
                return opponentHistory[opponentHistory.length - 1];
            };
        }
    },
    "GrimTrigger": {
        name: "Punisher",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (currentRound === 0) {
                return COOPERATE;
            }
            
            const opponentLastMove = opponentHistory[opponentHistory.length - 1];
            const playerLastMove = playerHistory[playerHistory.length - 1];

            // Java logic: Defect if opponent defected OR self defected
            if (opponentLastMove === DEFECT || playerLastMove === DEFECT) {
                return DEFECT;
            }
            return COOPERATE;
        };
        }
    },
    "TF2T": {
        name: "Tit-for-Two-Tats",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (opponentHistory.length >= 2 &&
                    opponentHistory[opponentHistory.length - 1] === DEFECT &&
                    opponentHistory[opponentHistory.length - 2] === DEFECT) {
                    return DEFECT;
                }
                return COOPERATE;
            };
        }
    },
    "TF3T": {
        name: "Tit-for-Three-Tats",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (opponentHistory.length >= 3 &&
                    opponentHistory[opponentHistory.length - 1] === DEFECT &&
                    opponentHistory[opponentHistory.length - 2] === DEFECT &&
                    opponentHistory[opponentHistory.length - 3] === DEFECT) {
                    return DEFECT;
                }
                return COOPERATE;
            };
        }
    },
    "TwoTitForTat": {
        name: "Two Tit for Tat",
        logic: () => {
            let punishmentRoundsLeft = 0;
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (currentRound === 0) {
                    return COOPERATE;
                }

                const opponentLastMove = opponentHistory[opponentHistory.length - 1];

                // Java logic for T2T is memory depth 2:
                // if Opponent defected last round OR Opponent defected 2 rounds ago
                if (opponentLastMove === DEFECT) {
                    return DEFECT;
                }

                if (currentRound >= 2) {
                    const opponentTwoRoundsAgo = opponentHistory[opponentHistory.length - 2];
                    if (opponentTwoRoundsAgo === DEFECT) {
                        return DEFECT;
                    }
                }

                return COOPERATE;
            };
        }
    },
    "Johan": {
        name: "Johan",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (opponentHistory.length === 0) {
                    return COOPERATE;
                }
                return opponentHistory[opponentHistory.length - 1] === COOPERATE ? DEFECT : COOPERATE;
            };
        }
    },
    "OneForEvenMan": {
        name: "One for Even Man",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (currentRound % 2 === 0) {
                    return COOPERATE; // Cooperate on even rounds
                } else {
                    return DEFECT; // Defect on odd rounds
                }
            };
        }
    },
    "ZeroForEvenMan": { // Cooperates only on odd rounds, defects on even
        name: "Zero for Even Man",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (currentRound % 2 !== 0) { // If current round is odd
                    return COOPERATE; // Cooperate
                } else { // If current round is even
                    return DEFECT; // Defect
                }
            };
        }
    },
    "Player1100": { // New strategy: 1 1 0 0 pattern
        name: "Player 1100",
        logic: () => {
            const pattern = [COOPERATE, COOPERATE, DEFECT, DEFECT]; // 1 1 0 0
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                const currentRoundIndex = currentRound - 1; // 0-indexed
                return pattern[currentRoundIndex % pattern.length];
            };
        }
    },
    "Player0011": { // New strategy: 0 0 1 1 pattern
        name: "Player 0011",
        logic: () => {
            const pattern = [DEFECT, DEFECT, COOPERATE, COOPERATE]; // 0 0 1 1
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                const currentRoundIndex = currentRound - 1; // 0-indexed
                return pattern[currentRoundIndex % pattern.length];
            };
        }
    },
    "Player0111": { // New strategy: 0 1 1 1 pattern
        name: "Player 0111",
        logic: () => {
            const pattern = [DEFECT, COOPERATE, COOPERATE, COOPERATE]; // 0 1 1 1
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                const currentRoundIndex = currentRound - 1; // 0-indexed
                return pattern[currentRoundIndex % pattern.length];
            };
        }
    },
    "Player1000": { // New strategy: 1 0 0 0 pattern
        name: "Player 1000",
        logic: () => {
            const pattern = [COOPERATE, DEFECT, DEFECT, DEFECT]; // 1 0 0 0
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                const currentRoundIndex = currentRound - 1; // 0-indexed
                return pattern[currentRoundIndex % pattern.length];
            };
        }
    },
    "Joss": { // New strategy: Win-Stay, Lose-Shift (WSLS) / Pavlov
        name: "Joss (Win-Stay, Lose-Shift)",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                    if (currentRound === 0) {
                    return COOPERATE; // 1 in Java
                }
                
                const opponentLastMove = opponentHistory[opponentHistory.length - 1];
                const playerLastMove = playerHistory[playerHistory.length - 1];

                // Java logic:
                // if (Opponent Cooperated) { return Self Last Move }
                if (opponentLastMove === COOPERATE) { 
                    return playerLastMove;
                } 
                // else (Opponent Defected) { return Opposite of Self Last Move }
                else { 
                    return (playerLastMove === DEFECT ? COOPERATE : DEFECT);
                }
            };
        }
    },
    "Columbus": { // New strategy: Defects forever if opponent defects two in a row
        name: "Columbus",
        logic: () => {
            let defectForever = false;
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (defectForever) {
                    return DEFECT; // Once triggered, always defect
                }

                // Check if opponent defected two in a row
                if (opponentHistory.length >= 2 &&
                    opponentHistory[opponentHistory.length - 1] === DEFECT &&
                    opponentHistory[opponentHistory.length - 2] === DEFECT) {
                    defectForever = true;
                    return DEFECT; // Defect immediately upon detection
                }

                return COOPERATE; // Otherwise, cooperate
            };
        }
    },
    "Galileo": { // New strategy: Defects forever if opponent defects three in a row
        name: "Galileo",
        logic: () => {
            let defectForever = false;
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (defectForever) {
                    return DEFECT; // Once triggered, always defect
                }

                // Check if opponent defected three in a row
                if (opponentHistory.length >= 3 &&
                    opponentHistory[opponentHistory.length - 1] === DEFECT &&
                    opponentHistory[opponentHistory.length - 2] === DEFECT &&
                    opponentHistory[opponentHistory.length - 3] === DEFECT) {
                    defectForever = true;
                    return DEFECT; // Defect immediately upon detection
                }

                return COOPERATE; // Otherwise, cooperate
            };
        }
    },
    "Sharp": { // New strategy: Defects forever if opponent defects in the first round, else cooperates forever
        name: "Sharp",
        logic: () => {
            let defectForever = false;
            let firstRoundChecked = false; // To ensure the check only happens once

            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                if (currentRound === 0) {
                    return COOPERATE;
                }

                const playerLastMove = playerHistory[playerHistory.length - 1];
                const opponentRound1Move = opponentHistory[0];

            // Java logic: Defect if opponent defected in Round 1 OR self defected last round
                if (opponentRound1Move === DEFECT || playerLastMove === DEFECT) {
                    return DEFECT;
                }
                return COOPERATE;
            };
        }
    },
    "Rayon": {
        name: "Rayon",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                // Phase 1: Cooperate for the first 10 rounds (currentRound 1 to 10)
                if (currentRound <= 10) {
                    return COOPERATE; // 1 means Cooperate
                }

                // Phase 2: Defect on the 11th round (currentRound 11)
                if (currentRound === 11) {
                    return DEFECT; // 0 means Defect
                }

                // --- Logic for rounds >= 12 onwards ---

                // Condition A (NEW PRIORITY): Opponent's Two Consecutive Defections
                // Checks if opponent defected in the last two rounds.
                // Requires opponentHistory to have at least 2 elements (i.e., currentRound >= 3)
                if (opponentHistory.length >= 2 &&
                    opponentHistory[opponentHistory.length - 1] === DEFECT && // Opponent's move in (currentRound - 1)
                    opponentHistory[opponentHistory.length - 2] === DEFECT) { // Opponent's move in (currentRound - 2)
                    return DEFECT; // 0 means Defect
                }

                // Condition B (Original Java Priority 1): Rayon's Own Past Defection & Opponent's Retaliation
                // Checks if Rayon's move two rounds ago was DEFECT.
                // Requires playerHistory to have at least 2 of Rayon's own moves in history (i.e., currentRound >= 3)
                if (playerHistory.length >= 2 && playerHistory[playerHistory.length - 2] === DEFECT) { // Rayon's move in (currentRound - 2)
                    // If Rayon defected two rounds ago, check opponent's last move
                    // If opponent's last move was COOPERATE (1)
                    if (opponentHistory.length >= 1 && opponentHistory[opponentHistory.length - 1] === COOPERATE) { // Opponent's move in (currentRound - 1)
                        return DEFECT; // 0 means Defect
                    } else { // If opponent's last move was DEFECT (0)
                        return COOPERATE; // 1 means Cooperate
                    }
                }

                // Condition C (Original Java Priority 3): Score-Based Decision
                if (myCurrentScore < opponentCurrentScore) {
                    return DEFECT; // 0 means Defect
                }

                // Default: Return opponent's previous move (Tit-for-Tat)
                // This applies if none of the above conditions were met.
                // Requires opponentHistory to have at least 1 element (i.e., currentRound >= 2)
                if (opponentHistory.length > 0) {
                    return opponentHistory[opponentHistory.length - 1];
                }

                // This line should theoretically not be reached given the conditions above
                // cover all cases for currentRound >= 2.
                // For currentRound = 1, it's handled by the `currentRound <= 10` condition.
                return COOPERATE; // Fallback, though likely unreachable
            };
        }
    },
    "Sigma": { // New strategy: Cooperates for first 3 rounds, then defects if opponent's score is higher, else cooperates
        name: "Sigma",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                // First 3 rounds (currentRound 1, 2, 3)
                if (currentRound <= 3) {
                    return COOPERATE; // 0 means Cooperate
                }

                // After the first 3 rounds
                if (opponentCurrentScore > myCurrentScore) {
                    return DEFECT; // 1 means Defect
                } else {
                    return COOPERATE; // 0 means Cooperate
                }
            };
        }
    },
    "Sure": { // New strategy: Cooperates for first 2 rounds, then checks opponent's last 2 moves and score
        name: "Sure",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
                // First 2 rounds (currentRound 1, 2)
                if (currentRound <= 2) {
                    return COOPERATE; // 0 means Cooperate
                }

                // After the first 2 rounds
                // Check if opponent has defected any time in past 2 rounds
                const opponentDefectedInLastTwoRounds = (
                    opponentHistory.length >= 1 && opponentHistory[opponentHistory.length - 1] === DEFECT
                ) || (
                    opponentHistory.length >= 2 && opponentHistory[opponentHistory.length - 2] === DEFECT
                );

                if (opponentDefectedInLastTwoRounds) {
                    // If yes, then check if opp has more score than itself
                    if (opponentCurrentScore > myCurrentScore) {
                        return DEFECT; // 1 means Defect
                    } else {
                        return COOPERATE; // 0 means Cooperate
                    }
                } else {
                    // If opponent did NOT defect in the past 2 rounds, cooperate (default behavior)
                    return COOPERATE; // 0 means Cooperate
                }
            };
        }
    },
    "Gradual": {
    name: "Gradual",
    logic: () => {
        var opponentDefectionCount = 0;
        var punishmentRoundsRemaining = 0;
        var myTotalDefections = 0;

        return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => {
            if (currentRound > 0) {
                // 1. Check if punishment is ongoing
                if (punishmentRoundsRemaining > 0) {
                    punishmentRoundsRemaining--;
                    myTotalDefections++;
                    return DEFECT;
                }

                const opponentLastMove = opponentHistory[opponentHistory.length - 1];

                // 2. Check if opponent just defected
                if (opponentLastMove === DEFECT) {
                    opponentDefectionCount++; 
                    
                    // Calculate required cumulative punishment (revenge = 1+2+...+N)
                    // N * (N + 1) / 2
                    const requiredPunishment = opponentDefectionCount * (opponentDefectionCount + 1) / 2;
                    
                    // Set new punishment debt
                    punishmentRoundsRemaining = requiredPunishment - myTotalDefections; 
                    
                    // Start punishment immediately if debt is due
                    if (punishmentRoundsRemaining > 0) {
                        punishmentRoundsRemaining--; 
                        myTotalDefections++;
                        return DEFECT;
                    }
                }
            }
            
            // 3. Cooperate otherwise
            return COOPERATE;
        };
    }
},
    "Random": {
        name: "Random",
        logic: () => {
            return (playerHistory, opponentHistory, currentRound, myCurrentScore, opponentCurrentScore) => Math.random() < 0.5 ? COOPERATE : DEFECT;
        }
    }
};

// Canvas for personality graph
let personalityGraphCanvas, personalityGraphCtx;

/**
 * Initializes the personality graph canvas element and sets up its 2D rendering context.
 * Also calls resizePersonalityCanvas to set initial dimensions.
 */
const initializePersonalityCanvas = () => {
    personalityGraphCanvas = document.getElementById('personalityGraphCanvas');
    personalityGraphCtx = personalityGraphCanvas.getContext('2d');
    resizePersonalityCanvas();
};

/**
 * Resizes the personality graph canvas based on its parent container's width, maintaining an aspect ratio.
 * The graph will be redrawn after tournament completion.
 */
const resizePersonalityCanvas = () => {
    if (personalityGraphCanvas && personalityGraphCtx) {
        const parent = personalityGraphCanvas.parentElement;
        personalityGraphCanvas.width = parent.clientWidth;
        personalityGraphCanvas.height = Math.min(parent.clientWidth * 0.8, 600); // Adjusted for horizontal bars and more height
    }
};

/**
 * Draws the personality score graph on the dedicated canvas with horizontal bars.
 * @param {Object} personalityScores - An object mapping strategy keys to their personality scores.
 */
const drawPersonalityGraph = (personalityScores) => {
    if (!personalityGraphCtx) return;

    personalityGraphCtx.clearRect(0, 0, personalityGraphCanvas.width, personalityGraphCanvas.height);

    // Draw background
    personalityGraphCtx.fillStyle = '#f8fafc'; /* A very light blue-gray for the graph background */
    personalityGraphCtx.fillRect(0, 0, personalityGraphCanvas.width, personalityGraphCanvas.height);

    const strategies = Object.keys(personalityScores);
    if (strategies.length === 0) {
        personalityGraphCtx.fillStyle = '#6b7280';
        personalityGraphCtx.font = '18px Inter, sans-serif';
        personalityGraphCtx.textAlign = 'center';
        personalityGraphCtx.textBaseline = 'middle';
        personalityGraphCtx.fillText('No strategies selected for the tournament.', personalityGraphCanvas.width / 2, personalityGraphCanvas.height / 2);
        return;
    }

    const padding = 40;
    const labelAreaWidth = 150; // Space for strategy names on the left
    const chartAreaWidth = personalityGraphCanvas.width - 2 * padding - labelAreaWidth; // Total width for bars
    const chartAreaHeight = personalityGraphCanvas.height - 2 * padding;

    // Sort strategies by personality score for better visualization (descending)
    const sortedStrategies = strategies.sort((a, b) => personalityScores[b] - personalityScores[a]);

    const barHeight = (chartAreaHeight / sortedStrategies.length) * 0.7; // 70% of available height per bar
    const barGap = (chartAreaHeight / sortedStrategies.length) * 0.3; // 30% gap

    // Find min/max scores for scaling the X-axis
    const scores = Object.values(personalityScores);
    const minScore = Math.min(0, ...scores);
    const maxScore = Math.max(0, ...scores);
    const scoreRange = maxScore - minScore;

    // X-axis (score) scaling
    const scaleX = chartAreaWidth / (scoreRange === 0 ? 1 : scoreRange);
    const zeroLineX = padding + labelAreaWidth + (Math.abs(minScore) / (scoreRange === 0 ? 1 : scoreRange)) * chartAreaWidth;

    // Draw zero line (vertical)
    personalityGraphCtx.strokeStyle = '#9ca3af'; /* Gray for zero line */
    personalityGraphCtx.lineWidth = 1;
    personalityGraphCtx.beginPath();
    personalityGraphCtx.moveTo(zeroLineX, padding);
    personalityGraphCtx.lineTo(zeroLineX, personalityGraphCanvas.height - padding);
    personalityGraphCtx.stroke();
    personalityGraphCtx.fillStyle = '#374151';
    personalityGraphCtx.font = '12px Inter, sans-serif';
    personalityGraphCtx.textAlign = 'center';
    personalityGraphCtx.textBaseline = 'top';
    personalityGraphCtx.fillText('0', zeroLineX, personalityGraphCanvas.height - padding + 5);


    // Draw bars
    sortedStrategies.forEach((key, index) => {
        const score = personalityScores[key];
        const y = padding + (index * (barHeight + barGap)) + barGap / 2;
        const barLength = Math.abs(score) * scaleX;
        const x = score >= 0 ? zeroLineX : zeroLineX - barLength;

        // Bar color: Green for positive, Red for negative
        personalityGraphCtx.fillStyle = score >= 0 ? '#10B981' : '#EF4444'; /* Emerald Green / Red */
        personalityGraphCtx.fillRect(x, y, barLength, barHeight);

        // Strategy name label to the left of the bar
        personalityGraphCtx.fillStyle = '#374151';
        personalityGraphCtx.font = '14px Inter, sans-serif';
        personalityGraphCtx.textAlign = 'right';
        personalityGraphCtx.textBaseline = 'middle';
        personalityGraphCtx.fillText(STRATEGIES[key].name, padding + labelAreaWidth - 10, y + barHeight / 2);

        // Score value label at the end of the bar
        personalityGraphCtx.font = '12px Inter, sans-serif';
        personalityGraphCtx.fillStyle = '#1f2937';
        personalityGraphCtx.textAlign = score >= 0 ? 'left' : 'right';
        personalityGraphCtx.textBaseline = 'middle';
        personalityGraphCtx.fillText(score.toFixed(0), score >= 0 ? x + barLength + 5 : x - 5, y + barHeight / 2);
    });

    // X-axis labels (min/max scores)
    personalityGraphCtx.fillStyle = '#374151';
    personalityGraphCtx.font = '12px Inter, sans-serif';
    personalityGraphCtx.textBaseline = 'top';
    if (maxScore > 0) {
        personalityGraphCtx.textAlign = 'left';
        personalityGraphCtx.fillText(maxScore.toFixed(0), zeroLineX + chartAreaWidth - (maxScore * scaleX) + 5, personalityGraphCanvas.height - padding + 5);
    }
    if (minScore < 0) {
        personalityGraphCtx.textAlign = 'right';
        personalityGraphCtx.fillText(minScore.toFixed(0), zeroLineX - (Math.abs(minScore) * scaleX) - 5, personalityGraphCanvas.height - padding + 5);
    }
};


/**
 * Simulates a single match between two strategies.
 * @param {Function} player1StrategyInstance - The logic function for player 1.
 * @param {Function} player2StrategyInstance - The logic function for player 2.
 * @param {number} numRounds - The number of rounds for this match.
 * @returns {Array<any>} - [player1_final_score, player2_final_score, match_outcome_string, p1_moves_history, p2_moves_history]
 */
const simulateMatch = (player1StrategyInstance, player2StrategyInstance, numRounds) => {
    let p1MatchScore = 0;
    let p2MatchScore = 0;
    let p1MovesHistory = [];
    let p2MovesHistory = [];

    for (let i = 1; i <= numRounds; i++) {
        const p1Move = player1StrategyInstance(p1MovesHistory, p2MovesHistory, i, p1MatchScore, p2MatchScore);
        const p2Move = player2StrategyInstance(p2MovesHistory, p1MovesHistory, i, p2MatchScore, p1MatchScore);

        const [p1RoundScore, p2RoundScore] = PAYOFF_MATRIX[p1Move][p2Move];

        p1MatchScore += p1RoundScore;
        p2MatchScore += p2RoundScore;

        p1MovesHistory.push(p1Move);
        p2MovesHistory.push(p2Move);
    }

    let matchOutcome;
    if (p1MatchScore > p2MatchScore) {
        matchOutcome = 'p1_win';
    } else if (p2MatchScore > p1MatchScore) {
        matchOutcome = 'p2_win';
    } else {
        matchOutcome = 'draw';
    }

    return [p1MatchScore, p2MatchScore, matchOutcome, p1MovesHistory, p2MovesHistory];
};

/**
 * Displays the final tournament rankings and match outcome summary.
 * @param {Array<Object>} rankings - An array of objects with { name: string, score: number }
 * @param {Object} matchResults - An object mapping strategy names to { wins: number, losses: number, draws: number }
 */
const displayTournamentRankings = (rankings, matchResults) => {
    const rankingsDiv = document.getElementById('tournamentRankings');
    rankingsDiv.innerHTML = ''; // Clear previous score rankings

    const ol = document.createElement('ol');
    ol.className = 'list-decimal list-inside space-y-3 text-lg text-gray-700';

    rankings.forEach((strategy, index) => {
        const li = document.createElement('li');
        li.className = 'bg-indigo-50 p-4 rounded-lg shadow-sm flex justify-between items-center';
        li.innerHTML = `
                    <span class="font-semibold text-indigo-800">${strategy.name}</span>
                    <span class="font-bold text-indigo-900">${strategy.score}</span>
                `;
        ol.appendChild(li);
    });
    rankingsDiv.appendChild(ol);

    // Display Match Outcome Summary
    const matchOutcomeSummaryDiv = document.getElementById('matchOutcomeSummary');
    matchOutcomeSummaryDiv.innerHTML = ''; // Clear previous match outcome summary

    const table = document.createElement('table');
    table.className = 'results-table';
    table.innerHTML = `
                <thead>
                    <tr>
                        <th>Strategy</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Draws</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
    const tbody = table.querySelector('tbody');

    // Sort strategies alphabetically for the win/loss table for consistent display
    const sortedStrategyNames = Object.keys(matchResults).sort((a, b) => {
        const nameA = STRATEGIES[a].name.toUpperCase(); // ignore case
        const nameB = STRATEGIES[b].name.toUpperCase(); // ignore case
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    sortedStrategyNames.forEach(key => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${STRATEGIES[key].name}</td>
                    <td>${matchResults[key].wins}</td>
                    <td>${matchResults[key].losses}</td>
                    <td>${matchResults[key].draws}</td>
                `;
        tbody.appendChild(row);
    });
    matchOutcomeSummaryDiv.appendChild(table);

    document.getElementById('tournamentResults').classList.remove('hidden');
};

/**
 * Orchestrates the entire tournament.
 */
const startTournament = () => {
    const numRoundsPerMatch = parseInt(document.getElementById('numRoundsPerMatch').value);
    if (isNaN(numRoundsPerMatch) || numRoundsPerMatch <= 0) {
        showAlert("Please enter a valid number of rounds per match (greater than 0).");
        return;
    }

    const selectedStrategyCheckboxes = document.querySelectorAll('#strategyCheckboxes input[type="checkbox"]:checked');
    const selectedStrategyKeys = Array.from(selectedStrategyCheckboxes).map(cb => cb.value);

    if (selectedStrategyKeys.length === 0) {
        showAlert("Please select at least one strategy to run the tournament.");
        return;
    }

    // Clear previous results
    document.getElementById('tournamentResults').classList.add('hidden');
    drawPersonalityGraph({}); // Clear personality graph

    const cumulativeScores = {};
    const strategyMatchResults = {}; // To store wins, losses, draws for each strategy
    const totalCooperations = {}; // To store total cooperations for personality score
    const totalDefections = {};   // To store total defections for personality score

    // Initialize cumulative scores, match results, and move counts for selected strategies
    selectedStrategyKeys.forEach(key => {
        cumulativeScores[key] = 0;
        strategyMatchResults[key] = { wins: 0, losses: 0, draws: 0 };
        totalCooperations[key] = 0;
        totalDefections[key] = 0;
    });

    // Run matches: each selected strategy against every other selected strategy, including itself
    for (let i = 0; i < selectedStrategyKeys.length; i++) {
        for (let j = 0; j < selectedStrategyKeys.length; j++) {
            const player1Key = selectedStrategyKeys[i];
            const player2Key = selectedStrategyKeys[j];

            // Create fresh instances of strategy logic for each match
            const player1StrategyInstance = STRATEGIES[player1Key].logic();
            const player2StrategyInstance = STRATEGIES[player2Key].logic();

            const [p1MatchScore, p2MatchScore, matchOutcome, p1MovesHistory, p2MovesHistory] = simulateMatch(player1StrategyInstance, player2StrategyInstance, numRoundsPerMatch);

            cumulativeScores[player1Key] += p1MatchScore;
            cumulativeScores[player2Key] += p2MatchScore;

            // Update win/loss/draw counts
            if (matchOutcome === 'p1_win') {
                strategyMatchResults[player1Key].wins++;
                strategyMatchResults[player2Key].losses++;
            } else if (matchOutcome === 'p2_win') {
                strategyMatchResults[player1Key].losses++;
                strategyMatchResults[player2Key].wins++;
            } else { // draw
                strategyMatchResults[player1Key].draws++;
                strategyMatchResults[player2Key].draws++;
            }

            // Aggregate cooperation and defection counts for personality score
            p1MovesHistory.forEach(move => {
                if (move === COOPERATE) {
                    totalCooperations[player1Key]++;
                } else {
                    totalDefections[player1Key]++;
                }
            });
            p2MovesHistory.forEach(move => {
                if (move === COOPERATE) {
                    totalCooperations[player2Key]++;
                } else {
                    totalDefections[player2Key]++;
                }
            });
        }
    }

    // Calculate personality scores
    const personalityScores = {};
    selectedStrategyKeys.forEach(key => {
        personalityScores[key] = totalCooperations[key] - totalDefections[key];
    });

    // Prepare rankings for display (score-based)
    const rankings = Object.keys(cumulativeScores).map(key => ({
        name: STRATEGIES[key].name,
        score: cumulativeScores[key]
    }));

    // Sort rankings by score in descending order
    rankings.sort((a, b) => b.score - a.score);

    // Display the tournament rankings and match outcome summary
    displayTournamentRankings(rankings, strategyMatchResults);

    // Draw the personality score graph
    drawPersonalityGraph(personalityScores);
};

// Simple modal for alerts, replacing window.alert() to avoid browser pop-ups
const showAlert = (message) => {
    const modal = document.getElementById('alertModal');
    const modalMessage = document.getElementById('alertMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalBtnBottom = document.getElementById('closeModalBtnBottom'); // Get bottom button too

    modalMessage.textContent = message;
    modal.classList.remove('hidden');

    const hideModal = () => {
        modal.classList.add('hidden');
    };

    closeModalBtn.onclick = hideModal;
    closeModalBtnBottom.onclick = hideModal; // Attach to both buttons

    // Close if clicked outside the modal content
    modal.onclick = (event) => {
        if (event.target === modal) {
            hideModal();
        }
    };
};

// Override window.alert for this specific application to use the custom modal
window.alert = showAlert;

// Populate strategy checkboxes and set up event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const strategyCountValue = document.getElementById('strategyCountValue');
    strategyCountValue.textContent = Object.keys(STRATEGIES).length;

    const strategyCheckboxesContainer = document.getElementById('strategyCheckboxes');
    const selectAllCheckbox = document.getElementById('selectAllStrategies');

    // Populate individual strategy checkboxes
    for (const key in STRATEGIES) {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `strategy-${key}`;
        checkbox.name = 'selectedStrategies';
        checkbox.value = key;
        checkbox.checked = true; // Default to all selected

        const label = document.createElement('label');
        label.htmlFor = `strategy-${key}`;
        label.textContent = STRATEGIES[key].name;

        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        strategyCheckboxesContainer.appendChild(checkboxItem);

        // Add event listener to individual checkboxes to update "Select All"
        checkbox.addEventListener('change', () => {
            const allIndividualCheckboxes = document.querySelectorAll('#strategyCheckboxes input[type="checkbox"]');
            const allChecked = Array.from(allIndividualCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    }

    // Set "Select All" to checked initially if all are default checked
    selectAllCheckbox.checked = true;

    // Add event listener for "Select All" checkbox
    selectAllCheckbox.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        const allIndividualCheckboxes = document.querySelectorAll('#strategyCheckboxes input[type="checkbox"]');
        allIndividualCheckboxes.forEach(cb => {
            cb.checked = isChecked;
        });
    });


    document.getElementById('startTournamentBtn').addEventListener('click', startTournament);

    // Initialize personality canvas and set up resize listener
    initializePersonalityCanvas();
    window.addEventListener('resize', resizePersonalityCanvas);
});