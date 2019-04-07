const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const main = document.querySelector("main")
console.log("Hello welcome to the console")

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchPokemon)
document.addEventListener("click", clickHandler)

// controllers for each Event
function fetchPokemon(){
  fetch('http://localhost:3000/trainers')
  .then(function(response) {
    return response.json();
  })
  .then(function(trainers) {
    appendPokemon(trainers);
  });
}

// calls to either add a new pokemon or release a pokemon depending on what button was clicked, or does nothing if they're just clicking around the page
function clickHandler(e){
  if (e.target.dataset.trainerId){addPokemonHandler(e)}
  if (e.target.dataset.pokemonId){releasePokemonHandler(e)}
}


//renders the initial pokemon
function appendPokemon(trainers){
  main.innerHTML =''
  const trainerHTMLArray = trainers.map(trainer => {
    const newDiv = document.createElement("DIV")
    newDiv.classList.add("card")
    newDiv.setAttribute("data-id",trainer.id)
    let pokemonRenderer = trainer["pokemons"].map(pokemon => `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`).join("")
    newDiv.innerHTML =
    `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
        ${pokemonRenderer}
      </ul>
    </div>
    `
    main.appendChild(newDiv)
  })
}

// checks to see if there's space for a new pokemon, then calls the fetch for a new pokemon
function addPokemonHandler(e){
  const id = e.target.dataset.trainerId
  const amountPokemon = document.querySelector(`[data-id="${id}"]`).querySelectorAll("li").length
  if (amountPokemon < 7){addPokemonFetcher(id)}
  else {alert("Can't have more than six pokemon!")}
}

// fetches the new pokemon
function addPokemonFetcher(trainer_id){
  console.log("adding pokemon")
  fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({trainer_id: trainer_id})
    })
    .then(response => response.json())
    .then(pokemon => renderNewPokemon(pokemon, trainer_id));
}

// optimistically adds the new pokemon to its relevant trainer <ul> after the fetch
function renderNewPokemon(pokemon, id){
  const trainerUl = document.querySelector(`[data-id="${id}"]`).querySelector("ul")
  const newLi = document.createElement('LI')
  newLi.innerHTML = `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  trainerUl.appendChild(newLi)
}

// sends a delete request for the nuzlocked Pokemon
function releasePokemonHandler(e){
  id = e.target.dataset.pokemonId
  fetch(`http://localhost:3000/pokemons/${id}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(optimisticallyDeletePokemon(id));
}

// optimistically deletes the pokemon
function optimisticallyDeletePokemon(id){
  document.querySelector(`[data-pokemon-id="${id}"]`).parentElement.outerHTML ="";
}
