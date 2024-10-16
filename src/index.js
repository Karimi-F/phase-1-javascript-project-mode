// Event Listeners to be used
// 1. OnSubmit
// 2. Onclick
// 3. On Toggle
// 4. Double Click

// Array iterator method to be used
// 1. Filter
// 2. Map
// 3. For Each

// Fetch methods to be used
// 1. GET
// 2. POST
// 3. PATCH
// 4. DELETE

document.addEventListener("DOMContentLoaded", () => {
    const flashcardsContainer = document.querySelector('.flashcards-container');
    const createBtn = document.getElementById('new-flashcard');
    const deleteBtn = document.getElementById('del-flashcard');
    const submitBtn = document.getElementById('submit-btn');
    const saveBtn = document.getElementById('save-btn');
    const closeBtn = document.getElementById('close-btn');
    let flashcards = [];
});

const fetchFlashcards = () = {
    fetch ('db.json')
    .then (response => response)
    .then(data => {
        flashcards = data.words;
        renderFlashcards(flashcards);
    });
};

const renderFlashcards = (flashcardsArray) => {
    flashcardsContainer.innerHTML = '';  // Clear current flashcards
    flashcardsArray.map(card => {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcards');
        flashcard.innerHTML = `
            <div class="flashcard-content" id="flashcard-${card.id}">
                <div class="front-card">
                    <p class="question">${card.Hanzi} (${card.Pinyin})</p>
                    <button class="flipping" data-id="${card.id}">Flip to show answer</button>
                </div>
                <div class="back-card hidden">
                    <p class="answer">${card['English translation']}</p>
                    <button class="flipping" data-id="${card.id}">Back to question</button>
                </div>
            </div>
        `;
        flashcardsContainer.appendChild(flashcard);
    });
};

// Flip card (OnToggle event)
flashcardsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('flipping')) {
        const flashcardId = e.target.dataset.id;
        const flashcardContent = document.getElementById(`flashcard-${flashcardId}`);
        flashcardContent.querySelector('.front-card').classList.toggle('hidden');
        flashcardContent.querySelector('.back-card').classList.toggle('hidden');
    }
});

// Create new flashcard (POST)
saveBtn.addEventListener('click', () => {
    const question = document.getElementById('question-area').value;
    const answer = document.getElementById('answer-area').value;

    const newCard = {
        id: Date.now().toString(),
        Hanzi: question,
        Pinyin: "",
        'English translation': answer
    };

    flashcards.push(newCard);
    fetch('db.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCard)
    }).then(() => fetchFlashcards());  // Refresh the flashcards display
});

// Delete flashcard (DELETE)
deleteBtn.addEventListener('click', () => {
    const flashcardId = prompt('Enter flashcard ID to delete:');

    flashcards = flashcards.filter(card => card.id !== flashcardId);
    fetch(`db.json/${flashcardId}`, {
        method: 'DELETE'
    }).then(() => fetchFlashcards());
});

// Submit HSK Level form (OnSubmit event)
submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const level = document.querySelector('input[name="hsk-level"]:checked').value;

    const filteredFlashcards = flashcards.filter(card => card.level === level);
    renderFlashcards(filteredFlashcards);  // Display filtered flashcards
});

// Initialize flashcards on page load
fetchFlashcards();
});