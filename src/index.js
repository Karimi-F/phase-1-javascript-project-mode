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
  // closeButton.addEventListener('click', hideFlashcardForm);
  getFlashcards();
});

// function hideFlashcardForm() {
//   const formContainer = document.getElementById('flashcard-form-container');
//   formContainer.style.display = 'none'; 
// }


// const closeButton = document.getElementById('close-btn');



//This function allows the visibility and invisibility of the create a flashcard form 
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


//The function that allows cards to be added to the flashcard data
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

  // The function that creates flashcards and ensures each input is correctly placed.
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
  //Allows the card to flip once the toggle button is clicked on.
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
      const card = button.closest('.card');
      card.classList.toggle('flipped');

  });
});

//This function allows the flashcards to be displayed once they are created.
function displayFlashcards(flashcards){
  const createdCards = document.querySelector('.createdCards');
  createdCards.innerHTML = '';

  //Allows each card to be displayed separately.
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

    //Allows the card to be deleted upon the clicking of the delete button.
    card.querySelector('.delete-btn').addEventListener('click', (event) =>{
      const id = flashcard.id;
      deleteFlashcard(id);
    });

    
    card.querySelector('.toggle-btn').addEventListener('click', () => {
      card.querySelector('.card').classList.toggle('flipped');
  });
});
}


//Allows us to POST data to the database once the card is created.
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

//Allows the create flashcard form to reset once a card has been created.
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

//Allows us to fetch data from the database using the GET method.
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
    
//Allows us to delete a card on the database using the DELETE method.
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
  
//Allows the visibility and invisibility of the filter by level form.
function toggleFilterDropdown(){
  const filterDropdown = document.getElementById('filter-dropdown');
  filterDropdown.style.display = filterDropdown.style.display === 'none' || filterDropdown.style.display === '' ? 'block' : 'none';
}

//Allows the array iterator method, filter, tofilter through the levels and provide the level checked in the option.
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

