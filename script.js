// Attendre que la page soit complètement chargée avant de lancer le script
document.addEventListener('DOMContentLoaded', () => {

    // On récupère l'endroit où on va mettre les cases
    const calendarContainer = document.getElementById('calendar-container');

    // Éléments de la modale
    const modal = document.getElementById('quiz-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalQuestion = document.getElementById('modal-question');
    const answersContainer = document.getElementById('answers-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const closeButton = document.querySelector('.close-button');

    // Variable pour stocker les questions (chargées depuis questions.js)
    // questionsData est défini globalement dans questions.js
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

                btn.addEventListener('click', () => checkAnswer(index, currentQuestion.response, btn));

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

    function checkAnswer(selectedIndex, correctIndexString, btnElement) {
        const correctIndex = parseInt(correctIndexString) - 1;

        const allButtons = answersContainer.querySelectorAll('.answer-btn');

        if (selectedIndex === correctIndex) {
            // Bonne réponse
            btnElement.classList.add('correct');
            feedbackMessage.textContent = "Richtig! Bravo ! 🎉";
            feedbackMessage.style.color = "#27ae60";
            
            // Désactiver tous les boutons car c'est gagné
            allButtons.forEach(b => b.disabled = true);
        } else {
            // Mauvaise réponse
            btnElement.classList.add('wrong');
            // On désactive juste le bouton faux pour ne pas recliquer dessus
            btnElement.disabled = true;
            
            feedbackMessage.textContent = "Falsch!";
            feedbackMessage.style.color = "#c0392b";
        }
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    // Fermer la modale quand on clique sur la croix
    closeButton.addEventListener('click', closeModal);

    // Fermer la modale quand on clique en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Nombre de jours dans le calendrier
    const totalDays = 24;

    // Boucle pour créer les 24 cases une par une
    for (let i = 1; i <= totalDays; i++) {

        // 1. Créer l'élément div pour la case
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card'); // On lui donne la classe CSS pour le style

        // 2. Créer le numéro à l'intérieur
        const numberSpan = document.createElement('span');
        numberSpan.textContent = i; // Le numéro du jour (1, 2, 3...)
        dayCard.appendChild(numberSpan);

        // 3. Ajouter une action quand on clique dessus
        dayCard.addEventListener('click', () => {
            console.log("J'ai cliqué sur la case " + i);
            openModal(i); // Ouvrir le quiz au lieu de l'alerte
        });

        // 4. Ajouter la case finale dans la grille
        calendarContainer.appendChild(dayCard);
    }
});
