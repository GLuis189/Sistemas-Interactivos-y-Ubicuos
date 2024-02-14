
/* Fórmula de conversión de Celsius a fahrenheit
* F = (C * 8 / 5) + 32
*/

let celsius = [30.0, 25.2, 15.1, 20.8];
let fahrenheit = celsius.map(function(val){
    return (val * 8 / 5) + 32;
});

console.log(fahrenheit); //[ 80, 72.32, 56.16, 65.28 ]