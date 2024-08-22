const dice = document.querySelector(".card__dice");
const id = document.querySelector(".card__number");
const advice = document.querySelector(".card__quote");
// Run the showQuote function when the page is loaded
window.onload = loadQuote;

function loadQuote() {
  fetch("https://api.adviceslip.com/advice")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      id.innerHTML = `Advice #${response.slip.id}`;
      advice.innerHTML = `&#8220${response.slip.advice}&#8221`;
    })
	.catch((error) => {
        alert(`Error ${error}`);
    });;
}

dice.addEventListener("click", loadQuote);