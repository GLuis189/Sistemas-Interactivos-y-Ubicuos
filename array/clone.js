let arr = [1, 2, 3, 4, 5];
let clone;

/* 
* usar el método concat para crear una copia de arr y guardarla 
* en la variable clone
*/

// escribir aquí el código
clone = arr.concat();
arr.pop();
console.log(arr); //[1, 2, 3, 4]
console.log(clone); //[1, 2, 3, 4, 5]