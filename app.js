import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCW8I1Cr-4WGfbqaBWtz5A3ajAOZUqjJTc",
    authDomain: "health-expo-quiz-test.firebaseapp.com",
    projectId: "health-expo-quiz-test",
    storageBucket: "health-expo-quiz-test.appspot.com",
    messagingSenderId: "992897944471",
    appId: "1:992897944471:web:ef0bc55963d3c10f1ad2d2",
    measurementId: "G-DSR6BVM3V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quiz Data
const questions = [
    { question: "What is an effective coping strategy for stress?", answers: ["Deep breathing", "Ignoring stress", "Overworking", "Disregarding feelings"], correct: 0 },
    { question: "What is a common treatment for anxiety?", answers: ["Therapy", "Avoiding social interaction", "Ignoring symptoms", "Overeating"], correct: 0 },
    { question: "What is the recommended amount of sleep for teenagers?", answers: ["7-8 hours", "5-6 hours", "9-10 hours", "Less than 5 hours"], correct: 2 }
];

let score = 0;
let currentQuestionIndex = 0;
let timeLeft = 60;
let timerInterval;

document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('leaderboardForm').addEventListener('submit', submitResults);

function startQuiz() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('leaderboardContainer').style.display = 'none';
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('questionContainer').innerText = question.question;
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.className = 'quiz-answer';
        button.addEventListener('click', () => checkAnswer(index));
        answersContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    if (selectedIndex === question.correct) {
        score++;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('score').innerText = score;
}

async function submitResults(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const yearGroup = document.getElementById('yearGroup').value;

    try {
        await addDoc(collection(db, 'results'), {
            name,
            yearGroup,
            score,
            timestamp: new Date()
        });
        alert('Results submitted successfully!');
        showLeaderboard();
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}

async function showLeaderboard() {
    const q = query(collection(db, 'results'), orderBy('score', 'desc'));
    const querySnapshot = await getDocs(q);
    const topThree = querySnapshot.docs.slice(0, 3);
    const topPodium = document.getElementById('topPodium');
    topPodium.innerHTML = '<h2>Leaderboard</h2>';

    topThree.forEach((doc, index) => {
        const data = doc.data();
        topPodium.innerHTML += `
            <div class="podium-entry">
                <h3>${index + 1}. ${data.name}</h3>
                <p>Score: ${data.score}</p>
                <p>Year Group: ${data.yearGroup}</p>
            </div>
        `;
    });

    document.getElementById('leaderboardContainer').style.display = 'block';
    document.getElementById('leaderboardContainer').style.opacity = '1';
}
