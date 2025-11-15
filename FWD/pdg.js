import { Assigner, score, rounds, input, scoring } from "./Game_helpers";

function tournament() {
    try {
        let player_id = ["One_man", "Zero_man", "One_for_even_man", "Zero_for_even_man", "Tic_for_tac", "Punishner", "Sure[GOAT]", "Player_1100", "Player_0011", "Alpha", "Delta", "Sigma", "Tic_for_two_tac", "Colombus", "Joss", "Johan"];
        let player_score = new Array(player_id.length).fill(0);
        let players_count = player_id.length;

        function play(player_1_index, player_2_index) {
            for (let round = 0; round < rounds; round++) {
                let choice_1 = Assigner(player_1_index, 0, round);
                let choice_2 = Assigner(player_2_index, 1, round);
                input(round, choice_1, choice_2);
                scoring(round);
            }
        }

        for (let i = 0; i < players_count; i++) {
            for (let j = i; j < players_count; j++) {
                score[0] = 0;
                score[1] = 0;
                play(i, j);
                player_score[i] += score[0];
                player_score[j] += score[1];
            }
        }

        const playersData = player_id.map((name, index) => ({
            name: name,
            score: player_score[index]
        }));

        playersData.sort((a, b) => b.score - a.score);


        const tableBody = document.querySelector('#leaderboardTable tbody');
        if (tableBody) {
            tableBody.innerHTML = ''; // Clear any existing rows

            playersData.forEach((player, index) => {
                const row = tableBody.insertRow();

                const rankCell = row.insertCell();
                rankCell.textContent = index + 1;

                const nameCell = row.insertCell();
                nameCell.textContent = player.name;

                const scoreCell = row.insertCell();
                scoreCell.textContent = player.score;
            });
            console.log("Table updated successfully.");
        } else {
            console.error("Error: Could not find the table body with ID 'leaderboardTable'. Please ensure the HTML element exists and the ID is correct.");
        }
    } catch (error) {
        console.error("An error occurred during tournament execution:", error);
    }
}

// Ensure the DOM is fully loaded before trying to access elements
document.addEventListener('DOMContentLoaded', () => {
    const runButton = document.getElementById('runTournamentButton');

    if (runButton) {
        runButton.addEventListener('click', tournament);
        console.log("Button event listener attached.");
    } else {
        console.error("Error: Could not find the button with ID 'runTournamentButton'. Please ensure the HTML element exists and the ID is correct.");
    }
});
