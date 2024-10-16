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
})

const fetchFlashcards = () = {
    fetch ('db.json')
    .then (response => response)
    .then(data => {
        flashcards = data.words;
        renderFlashcards(flashcards);
    });
};