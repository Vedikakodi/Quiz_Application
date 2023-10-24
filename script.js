const questions = [
    {
        question: "How many hearts does an octopus have?",
        answers: [
            { text: "2", correct: false },
            { text: "3", correct: true },
            { text: "4", correct: false },
            { text: "5", correct: false },
        ]
    },
    {
        question: "Which planet has the most moons?",
        answers: [
            { text: "Mars", correct: false },
            { text: "Earth", correct: false },
            { text: "Saturn", correct: true },
            { text: "Jupiter", correct: false },
        ]
    },
    {
        question: "Where did sushi originate?",
        answers: [
            { text: "Japan", correct: false },
            { text: "Korea", correct: false },
            { text: "Taiwan", correct: false },
            { text: "China", correct: true },
        ]
    },
    {
        question: "What country drinks the most coffee?",
        answers: [
            { text: "Finland", correct: true },
            { text: "India", correct: false },
            { text: "Rome", correct: false },
            { text: "Paris", correct: false },
        ]
    },
    {
        question: "What is the only continent with land in all four hemispheres?",
        answers: [
            { text: "America", correct: false },
            { text: "Australia", correct: false },
            { text: "Africa", correct: true },
            { text: "Srilanka", correct: false },
        ]
    },
    {
        question: "Which planet in the Milky Way is the hottest?",
        answers: [
            { text: "Mercury", correct: false },
            { text: "Mars", correct: false },
            { text: "Jupiter", correct: false },
            { text: "Venus", correct: true },
        ]
    },
    {
        question: "What type of bird lays the largest eggs?",
        answers: [
            { text: "Eagle", correct: false },
            { text: "Ostrich", correct: true },
            { text: "Vulture", correct: false },
            { text: "Crow", correct: false },
        ]
    },
    {
        question: "How many bones does an adult human have?",
        answers: [
            { text: "230", correct: false },
            { text: "305", correct: false },
            { text: "206", correct: true },
            { text: "205", correct: false },
        ]
    },
    {
        question: "Which is the longest river on the earth?",
        answers: [
            { text: "Nile", correct: true },
            { text: "Ganga", correct: false },
            { text: "Amazon", correct: false },
            { text: "Mississippi", correct: false },
        ]
    },
    {
        question: "Which place is known as the roof of the world?",
        answers: [
            { text: "Tibet", correct: true },
            { text: "India", correct: false },
            { text: "China", correct: false },
            { text: "Japan", correct: false },
        ]
    },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startQuizButton = document.getElementById("start-quiz-btn");
const userNameInput = document.getElementById("user-name");
const quizContainer = document.querySelector(".quiz");
const scoreDisplay = document.getElementById("score-display");
const viewLeaderboardButton = document.getElementById("view-leaderboard-btn");
const leaderboard = document.getElementById("leaderboard");
const rankings = document.getElementById("rankings");

let currentQuestionIndex = 0;
let score = 0;
let userName = '';
let leaderboardData = [];


startQuizButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", handleNextButton);
viewLeaderboardButton.addEventListener("click", showLeaderboard);

function startQuiz() {
    userName = userNameInput.value;
    if (userName.trim() === '') {
        alert("Please enter your name.");
    } else {
        userNameInput.style.display = "none";
        startQuizButton.style.display = "none";
        quizContainer.style.display = "block";
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        showQuestion();
    }
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}


function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach((button) => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    if (currentQuestionIndex === questions.length - 1) {
        // Hide the "Next" button during the score display
    nextButton.style.display = "none";

    // Use setTimeout to delay the redirection to the leaderboard
    setTimeout(() => {
        showUserScore();
    }, 1000); // Delay for 1 second (1000 milliseconds)
        
    } else {
        nextButton.style.display = "block";
    }
}

function showUserScore() {
    resetState();
    questionElement.style.display = "none";

    // Display user's score
    scoreDisplay.innerHTML = `<strong>Hello, ${userName}! You scored ${score} out of ${questions.length}!</strong>`;
    scoreDisplay.style.display = "block";

    // Show the "View Leaderboard" button after the quiz is completed
    viewLeaderboardButton.style.display = "block";

    // Retrieve the existing leaderboard data from local storage
    const existingLeaderboardData = localStorage.getItem('leaderboardData');
    let parsedData = [];

    if (existingLeaderboardData) {
        parsedData = JSON.parse(existingLeaderboardData);
    }
    

    // Add the new user's data to the existing data
    parsedData.push({ name: userName, score });
    
    // Sort the leaderboard data by score in descending order
    parsedData.sort((a, b) => b.score - a.score);

    // Save the updated leaderboard data back to local storage
    localStorage.setItem('leaderboardData', JSON.stringify(parsedData));

}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    }
}

function showLeaderboard() {
    quizContainer.style.display = "none";
    scoreDisplay.style.display = "none";
    leaderboard.style.display = "block";
    const leaderboardData = localStorage.getItem('leaderboardData');
    
    if (leaderboardData) {
        const parsedData = JSON.parse(leaderboardData);

        // Clear existing rankings in the HTML
        rankings.innerHTML = '';

        // Display leaderboard rankings
        parsedData.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${index + 1}.</strong> ${entry.name}  :   <strong>${entry.score} </strong>points`;
            rankings.appendChild(listItem);
        });
    } else {
        // If there is no leaderboard data in local storage, display a message or handle it accordingly
        rankings.innerHTML = 'No leaderboard data found.';
    }
    // Hide the "View Leaderboard" button after clicking the leaderboard button
    viewLeaderboardButton.style.display = "none";
}

// Initial setup: Hide the quiz container, "Next" button, score display, and leaderboard
quizContainer.style.display = "none";
nextButton.style.display = "none";
scoreDisplay.style.display = "none";
leaderboard.style.display = "none";
