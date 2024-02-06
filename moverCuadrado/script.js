const constainer = document.getElementById('container');
const square = document.getElementById('square');

square.style.display = 'none';

function mover(){
    square.style.display = 'block';
    let x = event.clientX;
    let y = event.clientY;
    square.style.left = x - square.offsetWidth / 2 + 'px';
    square.style.top = y - square.offsetWidth / 2 + 'px' ;
}

container.addEventListener("click", mover);