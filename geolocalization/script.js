const button = document.querySelector('button');
button.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
})});

const watchID = navigator.geolocation.watchPosition((position) => {
  console.log(position.coords.latitude, position.coords.longitude);
});