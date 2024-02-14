let arr = [3, 1, 3, 2, 5, 4, 4, 4];

let unique = arr.filter(function(item, index, arr){
  return arr.indexOf(item) === index;
});

console.log(unique); //[3, 1, 2, 5, 4]