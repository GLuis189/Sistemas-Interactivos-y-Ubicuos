let arr = [1, 2, 3, 4, 5];
let clone;

/* 
* usar el método slice para crear una copia de arr y guardarla 
* en la variable clone
*/

// escribir aquí el código

clone = arr.slice();

arr.pop();
console.log(arr); //[1, 2, 3, 4]
console.log(clone); //[1, 2, 3, 4, 5]