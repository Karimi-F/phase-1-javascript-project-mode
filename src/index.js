const baseUrl = 'http://localhost:3000/words'

document.addEventListener('DOMContentLoaded', () =>{
  const createBtn = document.getElementById('create-btn');
  const form = document.getElementById('flashcard-frm');

  

  createBtn.addEventListener('click', showsForm);
  form.addEventListener('submit',addFlashcard);
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
  // console.log('Selected Level:', level ? level.value : 'No level selected');

  const hanzi = document.getElementById('Hanzi').value;
  // console.log('Hanzi:', hanzi);

  const pinyin = document.getElementById('pinyin').value;
  // console.log('Pinyin:', pinyin);

  const englishTranslation = document.getElementById('english-translation').value;
  // console.log('English Translation:', englishTranslation);


  if( level && hanzi && pinyin && englishTranslation){
    const flashcardData = {
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

function getFlashcards (){
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
    console.log(data);
  })
  .catch(error => {
    console.error('A problem occurred with the GET request operation:', error);
  });
}
    
  

