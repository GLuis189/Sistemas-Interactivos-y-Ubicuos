const c1 = function capitalizerFirstLetter(string) {
  let words = string.split(' ');
  let newWords = [];
  for (let word of words) {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  }
  return newWords.join(' ');
}

function capitalize(str) {
  const c = (s) => s[0].toUpperCase() + s.slice(1); 
  return str.toLowerCase().split(' ').map(c).join(' ');
}

console.log(c1('hola mundo'));
console.log(capitalize('hola mundo'));

(function() {
  var a = b = 5;
  console.log("a");
})();