const baseURL = 'https://pokeapi.co/api/v2/pokemon/';
const pokeForm = document.forms.pokemon;
const results = document.querySelector('.pokemons');
let isEditing = false;
let currentEditingItem = null;

const createResult = (id, name) => {  
  const li = document.createElement('li');
  const spanId = document.createElement('span');
  spanId.innerText = "#"+id;
  const span = document.createElement('span');
  span.innerText = name;

  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const editBtn = document.createElement('button');
  editBtn.innerText = 'Edit';
  editBtn.classList.add('edit');
  editBtn.addEventListener('click', () => enterEditMode(li, span, spanId, img));

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Delete';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', () => deletePokemonEntry(li));

  li.appendChild(spanId);
  li.appendChild(span);
  li.appendChild(img);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
};

const addPokemonEntry = (id, name) => {
  const newPokemon = createResult(id, name);
  results.appendChild(newPokemon);
};

const enterEditMode = (li, span, spanId, img) => {
  document.getElementById('name').value = span.innerText;
  isEditing = true;
  currentEditingItem = { li, span, spanId, img };
  pokeForm.querySelector('input[type="submit"]').value = 'Update Pokemon';
};

const updatePokemonEntry = (id, name) => {
  currentEditingItem.spanId.innerText = "#"+id;
  currentEditingItem.span.innerText =  name;
  currentEditingItem.img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  resetForm();
};

const resetForm = () => {
  document.getElementById('name').value = '';
  isEditing = false;
  currentEditingItem = null;
  pokeForm.querySelector('input[type="submit"]').value = 'Add Pokemon';
};

const deletePokemonEntry = (li) => {
  if (confirm('Are you sure you want to delete this pokemon?')) {
    li.remove();
  }
};

pokeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = pokeForm.elements;
  const pokeName = inputs['name'];

  fetch(`${baseURL}${pokeName.value}`)
    .then(res => res.json())
    .then(pokemon => {
      if(isEditing) {
        updatePokemonEntry(pokemon.id, pokemon.name)
      } else {
        addPokemonEntry(pokemon.id, pokemon.name)
      }
      pokeName.value = '';
  }).catch(error => {
    alert("Please, check if you wrote the name correctly");
  });
});