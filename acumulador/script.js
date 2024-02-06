const consoleE = document.querySelector('#console');
const button = document.querySelector('button');
function Acumular(inicio){
    this.value = inicio;
    this.read = function(){
        const value = prompt('Ingrese un valor', 0);
        this.value += parseInt(value) || 0;
    }
}
const acumulador = new Acumular(parseInt(consoleE.dataset.startingvalue));

button.addEventListener('click', function(event){
    acumulador.read();
    consoleE.innerText = acumulador.value;
}
);

// const consoleEl = document.querySelector("#console");
// function Accumulator(startingValue) {
//   this.value = startingValue;
//   this.read = function() {
//     const value = prompt("¿Cuánto quieres añadir", 0);
//     this.value += parseInt(value) || 0;
//   }
// }

// const acc = new Accumulator(parseInt(consoleEl.dataset.startingvalue));

// const buttonEl = document.querySelector("button");
// buttonEl.addEventListener("click", function(event) {
//   acc.read();
//   consoleEl.innerText = acc.value;
// });