const baseUrl = 'http://localhost:3000/words'

document.addEventListener('DOMContentLoaded', () =>{
  const createBtn = document.getElementById('create-btn');
  const form = document.getElementById('flashcard-frm');
  const filterBtn = document.getElementById('filter-btn');
  const filterDropdown = document.getElementById('filter-dropdown');
  const filterForm = document.getElementById('filter-form');
  

  createBtn.addEventListener('click', showsForm);
  form.addEventListener('submit',addFlashcard);
  filterBtn.addEventListener('click',toggleFilterDropdown);
  filterForm.addEventListener('submit', applyFilter);
  getFlashcards();
});



function showsForm() {
  const form = document.getElementById('flashcard-frm');

  // console.log('Current display:', form.style.display);

  if (form.style.display ==='none' || form.style.display ==='') {
      form.style.display = 'flex';

      // console.log('Form is now visible');

  } else {
      form.style.display = 'none';
  }

  // console.log('Form is now hidden');
}



function addFlashcard(event){
  event.preventDefault();
  // console.log('Submission prevented')

  const level = document.querySelector('input[name="level"]:checked');
  console.log('Selected Level:', level ? level.value : 'No level selected');

  const hanzi = document.getElementById('Hanzi').value;
  console.log('Hanzi:', hanzi);

  const pinyin = document.getElementById('pinyin').value;
  // console.log('Pinyin:', pinyin);

  const englishTranslation = document.getElementById('english-translation').value;
  // console.log('English Translation:', englishTranslation);


  if( level && hanzi && pinyin && englishTranslation){
    const flashcardData = {
      level: level.value,
      Hanzi : hanzi,
      Pinyin : pinyin,
      "English translation" : englishTranslation

    };

    postFlashcard(flashcardData); //so as to post data to my json
    createFlashcards(level.value, hanzi,pinyin,englishTranslation);
    resetForm();
      
    }else {
      // console.error('Please fill out all fields.');

      alert('Please fill out all fields.');
  }}

function createFlashcards(level,Hanzi,pinyin, englishTranslation){
  const createdCards = document.querySelector('.createdCards');

      const card = document.createElement('div');
      card.className = 'card-container';
      card.innerHTML = 
      `<div class = "whole-card">
      <div class = "card">
      <div class = "card-front">
      <p ><strong>Level:</strong>${level}</p>
      <p ><strong>Hanzi:</strong>${Hanzi}</p>
      <p ><strong>Pinyin:</strong>${pinyin}</p>
      </div>
      <div class = "card-back">
      <p><strong>English Translation:</strong>${englishTranslation}</p>
      </div>
      </div>
      <div class="tgl-del-btn"> 
      <button class= "button toggle-btn">Flip</button>
      <button class= "button delete-btn">Delete</button> 
      </div>
      </div>`;

      // console.log('Card created:', card.innerHTML);

      createdCards.appendChild(card);

      card.querySelector('.delete-btn').addEventListener('click', delCards);
      // console.log('deleted');

      card.querySelector('.toggle-btn').addEventListener('click', () => {
        card.querySelector('.card').classList.toggle('flipped');
        console.log('flipped');
      });
    
      // console.log('Card appended to createdCards');
      // postFlashcard(flashcardData);
}
  
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
      const card = button.closest('.card');
      card.classList.toggle('flipped');

  });
});


function displayFlashcards(flashcards){
  const createdCards = document.querySelector('.createdCards');
  createdCards.innerHTML = '';

  flashcards.forEach(flashcard => {
    const card = document.createElement('div');
    card.className = 'card-container';
    card.innerHTML = 
    `<div class="whole-card">
      <div class="card">
        <div class="card-front">
          <p><strong>Level:</strong> ${flashcard.level}</p>
          <p><strong>Hanzi:</strong> ${flashcard.Hanzi}</p>
          <p><strong>Pinyin:</strong> ${flashcard.Pinyin}</p>
        </div>
        <div class="card-back">
          <p><strong>English Translation:</strong> ${flashcard["English translation"]}</p>
        </div>
      </div>
      <div class="tgl-del-btn">
        <button class="button toggle-btn">Flip</button>
        <button class="button delete-btn">Delete</button>
      </div>
    </div>`;

    createdCards.appendChild(card);

    card.querySelector('.delete-btn').addEventListener('click', (event) =>{
      // const idToDelete = event.target.getAttribute('data-id');
      const id = flashcard.id;
      deleteFlashcard(id);
    });

    card.querySelector('.toggle-btn').addEventListener('click', () => {
      card.querySelector('.card').classList.toggle('flipped');
  });
});
}



  function postFlashcard(flashcardData){
    fetch (`${baseUrl}`,{
      method: 'POST',
      headers : {
        'Content-Type':'application/json',
        accept:'application/json'
      },
      body:JSON.stringify(flashcardData)
      })
      .then(response => {
        if ( response.ok){
          return response.json();
        } else{
          throw new Error ('Network response was not ok');
        }
      })
      .then(data => {
        console.log('Flashcard added successfully:', data);
        resetForm();
        alert('Flashcard added successfully!');
      })
      .catch(error => {
        console.error('There was an error adding the flashcard:', error);
        alert('Error adding flashcard');
      });
}


  function resetForm(){
    const form = document.getElementById('flashcard-frm');
    form.reset();
    showsForm();
 
  }


function delCards(event){
  const cardToDelete = event.target.parentElement.parentElement;
  cardToDelete.remove();
  console.log('Card deleted');
}

function getFlashcards (selectedLevel){
  fetch(`${baseUrl}`,{
    method: 'GET',
    headers : {
      'Content-Type':'application/json',
      accept: 'application/json'
    }
  })
  .then(response => {
    if(!response.ok){
      throw new Error('Network response was not ok' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Flashcards fetched:',data);
    if (selectedLevel){
      const filteredFlashcards = data.filter(flashcard =>flashcard.level == selectedLevel);
      displayFlashcards(filteredFlashcards);
    }else{
      displayFlashcards(data);
    }
    
  })
  .catch(error => {
    console.error('A problem occurred with the GET request operation:', error);
  });
}
    

function deleteFlashcard(id){
  fetch (`${baseUrl}/${id}`,{
    method: 'DELETE',
    headers : {
      'Content-Type':'application/json',
      accept:'application/json'
    },
    })
    .then(response => {
      if ( response.ok){
        console.log('Flashcard deleted successfully:',id);
        getFlashcards();
      } else{
        throw new Error ('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('There was an error deleting the flashcard:', error);
      alert('Error deleting flashcard');
    });
}
  

function toggleFilterDropdown(){
  const filterDropdown = document.getElementById('filter-dropdown');
  filterDropdown.style.display = filterDropdown.style.display === 'none' || filterDropdown.style.display === '' ? 'block' : 'none';
}

function applyFilter(event){
  event.preventDefault();
  console.log('Filter default submission prevented');

  const selectedLevel = document.querySelector('input[name="level"]:checked');
  if (selectedLevel){
    const level = selectedLevel.value;
    getFlashcards(level);
  }else{
    alert('Please select a level to filter by.');
  }
}