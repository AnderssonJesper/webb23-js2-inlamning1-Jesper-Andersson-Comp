async function getHighscores() {
    const url = 'http://localhost:3000/highscores';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network not response');
        }
        const highscores = await response.json();
        return highscores;
    } catch (error) {
        console.error('Error fetching highscores:', error);
        return [];
    }
}

const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playButtons = document.querySelectorAll('.play-button');
const resultDisplay = document.getElementById('result');
const playerChoiceDisplay = document.getElementById('playerChoice');
const computerChoiceDisplay = document.getElementById('computerChoice');
const winnerDisplay = document.getElementById('winner');
const playerScoreDisplay = document.getElementById('playerScore');
const highscoresList = document.getElementById('highscoreList');
let playerScore = 0;
let playerName = "";

getHighscores().then(displayHighscores);

document.getElementById('player-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    playerName = playerNameInput.value;
    playerNameDisplay.innerText = playerName;
    const highscores = await getHighscores();
    displayHighscores(highscores);
});

playButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        playRound(playerChoice);
    });
});

function playRound(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    playerChoiceDisplay.innerText = `Ditt val: ${playerChoice}`;
    computerChoiceDisplay.innerText = `Datorns val: ${computerChoice}`;

    if (playerChoice === computerChoice) {
        winnerDisplay.innerText = 'Oavgjort';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        playerScore++;
        winnerDisplay.innerText = playerName;
    } else {
        winnerDisplay.innerText = 'Datorn';

        if (playerName) {
            sendResultToBackend(playerName, playerScore);
        }

        playerScore = 0;
        playerScoreDisplay.innerText = `Din poäng: ${playerScore}`;
    }

    playerScoreDisplay.innerText = `Din poäng: ${playerScore}`;
}

function sendResultToBackend(playerName, playerScore) {
    const newScore = { name: playerName, score: playerScore };

    fetch('http://localhost:3000/highscores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newScore)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            getHighscores().then(highscores => displayHighscores(highscores));
        })
        
}

function displayHighscores(highscores) {
    highscoresList.innerHTML = '';
    highscores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${score.name}: ${score.score}`;
        highscoresList.appendChild(listItem);
    });
}

function resetGame() {
    playerNameInput.value = '';
    playerName = '';
    playerNameDisplay.innerText = '';
    winnerDisplay.innerText = '';
    playerScore = 0;
    playerScoreDisplay.innerText = `Din poäng: ${playerScore}`;
    playerChoiceDisplay.innerText = 'Ditt val:';
    computerChoiceDisplay.innerText = 'Datorns val:';
}
