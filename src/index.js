const baseUrl = 'https://my-json-server.typicode.com/Karimi-F/phase-1-javascript-project-mode/words'

document.addEventListener('DOMContentLoaded', () =>{
  const createBtn = document.getElementById('create-btn');
  const form = document.getElementById('flashcard-frm');

  

  createBtn.addEventListener('click', showsForm);
  form.addEventListener('submit',addFlashcard);
});



function showsForm() {
  const form = document.getElementById('flashcard-frm');

  console.log('Current display:', form.style.display);

  if (form.style.display ==='none' || form.style.display ==='') {
      form.style.display = 'flex';

      console.log('Form is now visible');

  } else {
      form.style.display = 'none';
  }

  console.log('Form is now hidden');
}



function addFlashcard(event){
  event.preventDefault();
  console.log('Submission prevented')

  const level = document.querySelector('input[name="level"]:checked');
  console.log('Selected Level:', level ? level.value : 'No level selected');

  const hanzi = document.getElementById('Hanzi').value;
  console.log('Hanzi:', hanzi);

  const pinyin = document.getElementById('pinyin').value;
  console.log('Pinyin:', pinyin);

  const englishTranslation = document.getElementById('english-translation').value;
  console.log('English Translation:', englishTranslation);


  if( level && hanzi && pinyin && englishTranslation){
      const createdCards = document.querySelector('.createdCards');

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = 
      `<div>
      <p class="toggle-on"><strong>Level:</strong>${level.value}</p>
      <p class="toggle-on"><strong>Hanzi:</strong>${hanzi}</p>
      <p class="toggle-on"><strong>Pinyin:</strong>${pinyin}</p>
      <p class="toggle-off" style="display:none;"><strong>English Translation:</strong>${englishTranslation}</p>
      <div class="tgl-del-btn"> 
      <button class= "button toggle-btn">Flip</button>
      <button class= "button delete-btn">Delete</button> 
      </div>
      </div>`;

      console.log('Card created:', card.innerHTML);

      createdCards.appendChild(card);

      card.querySelector('.delete-btn').addEventListener('click', delCards);

      card.querySelector('.toggle-btn').addEventListener('click', () => toggleCard(card));
      
      console.log('Card appended to createdCards');

      document.querySelector('input[name = "level"]:checked').checked = false;
      document.getElementById('Hanzi').value = '';
      document.getElementById('pinyin').value = '';
      document.getElementById('english-translation').value = '';
      console.log('Form fields reset');

      showsForm();
  }else{
      console.error('Please fill out all fields.');

      alert('Please fill out all fields.');
  }
}

function delCards(event){
  const cardToDelete = event.target.parentElement.parentElement;
  cardToDelete.remove();
  console.log('Card deleted');
}

function toggleCard(card) {
  const toggleOnElements = card.querySelectorAll('.toggle-on');
  const toggleOffElements = card.querySelectorAll('.toggle-off');

  // Check if the toggle-on elements are currently visible
  const isVisible = toggleOnElements[0].style.display !== 'none';

  // Toggle visibility
  toggleOnElements.forEach(element => {
      element.style.display = isVisible ? 'none' : 'block';
  });
  toggleOffElements.forEach(element => {
      element.style.display = isVisible ? 'block' : 'none';
  });
}