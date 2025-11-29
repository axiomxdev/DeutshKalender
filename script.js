document.addEventListener('DOMContentLoaded', () => {

    const calendarContainer = document.getElementById('calendar-container');

    const modal = document.getElementById('quiz-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalQuestion = document.getElementById('modal-question');
    const answersContainer = document.getElementById('answers-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const closeButton = document.querySelector('.close-button');

    let questions = [];

    if (typeof questionsData !== 'undefined') {
        questions = questionsData;
        console.log("Questions chargées depuis questions.js :", questions);
    } else {
        console.error("Erreur : Le fichier questions.js n'a pas été chargé correctement.");
        alert("Erreur : Impossible de charger les questions.");
    }

    function openModal(day) {
        const questionIndex = day - 1;

        let currentQuestion = {
            question: "Pas de question disponible pour ce jour.",
            answer: [],
            response: null
        };

        if (questionIndex >= 0 && questionIndex < questions.length) {
            currentQuestion = questions[questionIndex];
        }

        modalTitle.textContent = `Tag ${day}`;
        modalQuestion.textContent = currentQuestion.question;
        feedbackMessage.textContent = ''

        answersContainer.innerHTML = '';

        if (currentQuestion.answer && currentQuestion.answer.length > 0) {
            currentQuestion.answer.forEach((answerText, index) => {
                const btn = document.createElement('button');
                btn.classList.add('answer-btn');
                btn.textContent = answerText;

                btn.addEventListener('click', () => checkAnswer(index, currentQuestion.response, btn, day));

                answersContainer.appendChild(btn);
            });
        } else {
            const msg = document.createElement('p');
            msg.textContent = "⚠️ Question en cours de création...";
            msg.style.fontStyle = "italic";
            answersContainer.appendChild(msg);
        }

        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    function checkAnswer(selectedIndex, correctIndexString, btnElement, day) {
        const correctIndex = parseInt(correctIndexString) - 1;

        const allButtons = answersContainer.querySelectorAll('.answer-btn');

        if (selectedIndex === correctIndex) {
            btnElement.classList.add('correct');
            feedbackMessage.textContent = "Richtig !";
            feedbackMessage.style.color = "#27ae60";

            allButtons.forEach(b => b.disabled = true);

            const dayCard = document.querySelector(`.day-card[data-day="${day}"]`);
            if (dayCard) {
                dayCard.classList.add('opened');

                const openedDays = JSON.parse(localStorage.getItem('openedDays') || '[]');
                if (!openedDays.includes(day)) {
                    openedDays.push(day);
                    localStorage.setItem('openedDays', JSON.stringify(openedDays));
                }
            }
        } else {
            btnElement.classList.add('wrong');
            btnElement.disabled = true;

            feedbackMessage.textContent = "Falsch !";
            feedbackMessage.style.color = "#c0392b";
        }
    }

    function closeModal() {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    const totalDays = 24;

    for (let i = 1; i <= totalDays; i++) {

        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');
        dayCard.dataset.day = i;

        const numberSpan = document.createElement('span');
        numberSpan.textContent = i;
        dayCard.appendChild(numberSpan);

        dayCard.addEventListener('click', () => {
            openModal(i);
        });

        calendarContainer.appendChild(dayCard);
    }

    const openedDays = JSON.parse(localStorage.getItem('openedDays') || '[]');
    openedDays.forEach(day => {
        const card = document.querySelector(`.day-card[data-day="${day}"]`);
        if (card) {
            card.classList.add('opened');
        }
    });
});
