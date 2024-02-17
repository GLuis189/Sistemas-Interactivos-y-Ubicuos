// Eliminar las acciones por defecto
document.addEventListener('contextmenu', (event) =>{
    event.preventDefault();
});
// alert("Hola, en esta aplicación continene las siguientes aplicaciones: \n 1. Poner marcadores al hacer click. \n 2. Eliminar marcadores al manter pulsado. \n 3. Eliminar marcadores al agitar el dispositivo. \n 4. Vibración dependiente de la distancia a los marcadores. \n 5. Simular una ruta al marcador mas cercano (solo funciona si no se simula la ubicación).");
const manIcon = L.icon({
    iconUrl: 'man.png',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 30], // point of the icon which will correspond to marker's location
});

const marcadorIcon = L.icon({
    iconUrl: 'marcador.png',

    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
});

// Vibracion escalabre, variar rutas, mantener para eliminar marcadores

// Verifica si el navegador soporta la geolocalización
if (navigator.geolocation && window.navigator.vibrate) {

    let map; 
    let yo;
    let markers = []; 

    //Inicializar el mapa en al posicion actual
    navigator.geolocation.getCurrentPosition(function(position) {
        // Obtiene las coordenadas de la posición actual
        let pos = [position.coords.latitude, position.coords.longitude];

        // Inicializa el mapa con la posición actual
        map = L.map('map').setView(pos, 16);

        // Añade la capa de mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
        }).addTo(map);

        // Dibuja el marcador en el mapa
        yo = L.marker(pos, {icon : manIcon}).addTo(map);

        // Al hacer click o touch en el mapa, se añade un marcador
        map.on('click', function(e) {
        // Obtiene las coordenadas del evento
        let coord = [e.latlng.lat, e.latlng.lng];

        // Dibujar el marcador en el mapa si no hay otro marcador en la misma posición o cercano
        let existe = false;
        markers.forEach((m) => {
            if (m.getLatLng().distanceTo(e.latlng) < 10) {
                existe = true;
            }
        });
        if (!existe) {
            let marker = L.marker(coord, {icon : marcadorIcon}).addTo(map);
            markers.push(marker);
        }
        

        // Al mantener dos segundos el click o touch en un marcador, se elimina el marcador
        markers.forEach((pulsado) => pulsado.on("contextmenu", function(e) {
            // Obtiene el marcador
            let marker = e.target;
            // Elimina el marcador del mapa
            map.removeLayer(marker);
            // Elimina el marcador del arreglo
            markers = markers.filter(function(m) {
                return m !== marker;
            })}));
    });
    });

    const route = document.getElementById('route');
    const cancel = document.getElementById('cancel');
    let rutas = [];
    route.addEventListener('click', function() {
        if (markers.length === 0) {
            alert("No hay marcadores para trazar la ruta");
            return;
        }
        route.style.display = "none";
        cancel.style.display = "block";

        console.log("route");
        // Elimina las rutas anteriores
        map.eachLayer(function(layer) {
            if (layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        // Obtiene las coordenadas de la posición actual
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = [position.coords.latitude, position.coords.longitude];
            console.log("route");

            // Dibuja la ruta desde la posición actual hasta el marcador más cercano
            markers.forEach((m) => {
                let coord = m.getLatLng();
                rutas.push(L.Routing.control({
                    waypoints: [
                        L.latLng(pos),
                        L.latLng(coord)
                    ],
                    router: new L.Routing.osrmv1({
                        serviceUrl: 'https://router.project-osrm.org/route/v1'
                    }),
                    routeWhileDragging: true
                }).addTo(map));
            });
            
            // Eliminar la interfaz de ruta sin eliminar los marcadores
            cancel.addEventListener('click', function() {
                route.style.display = "block";
                cancel.style.display = "none";
                
                // Puede ser q una ruta tenga varais paradas, varios marcadores
                // por lo que se eliminan todas las rutas
                rutas.forEach((ruta) => {
                    map.removeControl(ruta);
                    ruta = [];
                });
            });
        });
    });

    let intervalId = null;

    navigator.geolocation.watchPosition(function(position) {
    let pos = [position.coords.latitude, position.coords.longitude];

    // Actualizar la posición del marcador y la vista del mapa
    yo.setLatLng(pos);
    map.flyTo(pos, 16);

    markers.forEach((m) => {
        let distancia = yo.getLatLng().distanceTo(m.getLatLng());
        if (distancia < 20) {
            // Eliminar el marcador
            map.removeLayer(m);
            markers = markers.filter(function(marker) {
                return marker !== m;
            });
            navigator.vibrate([1000]);
            console.log("Eliminado")
        }
    });

    // Limpiar el intervalo anterior
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Hacer vibrar el dispositivo en función de la distancia al marcador más cercano
    intervalId = setInterval(function() {
        if(markers.length > 0) {
            // Encontrar el marcador más cercano
            let closestMarker = markers.reduce((prev, curr) => {
                let prevDistance = yo.getLatLng().distanceTo(prev.getLatLng());
                let currDistance = yo.getLatLng().distanceTo(curr.getLatLng());
                return (prevDistance < currDistance) ? prev : curr;
            });

            let distancia = yo.getLatLng().distanceTo(closestMarker.getLatLng());

            console.log("Vibrando")
            if (distancia < 50) {
                navigator.vibrate([700,50,700]);
                console.log("Vibrando 50");
            }
            else if (distancia < 100) {
                navigator.vibrate([500]);
                console.log("Vibrando 100");
            }
            else if (distancia < 200) {
                navigator.vibrate([200]);
                console.log("Vibrando 200");
            }
            else if (distancia < 400) {
                navigator.vibrate([100]);
                console.log("Vibrando 400");
            }
            else{
                navigator.vibrate([100]);
            }
        }
        }, 1000*10); // El intervalo de tiempo en milisegundos, 1000 ms = 1 segundo * 15 = 15 segundos
    });
    
    // Definir un umbral de agitación
    const SHAKE_THRESHOLD = 3000;
    let lastX, lastY, lastZ;
    let lastUpdate = 0;

    // Función para manejar el evento de agitación
    // Si se porduce mucha velocidad (cambio de posiciones) en poco timepo
    // se eliminan todos los marcadores
    function agitarMarcadores(event) {
        let curTime = new Date().getTime();
        if ((curTime - lastUpdate) > 100) {
            let diffTime = (curTime - lastUpdate);
            lastUpdate = curTime;

            let x = event.accelerationIncludingGravity.x;
            let y = event.accelerationIncludingGravity.y;
            let z = event.accelerationIncludingGravity.z;

            let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

            if (speed > SHAKE_THRESHOLD) {
                // Si se detecta una agitación, eliminar todos los marcadores
                markers.forEach((m) => {
                    map.removeLayer(m);
                });
                markers = [];
                console.log("Todos los marcadores han sido eliminados");
            }

            lastX = x;
            lastY = y;
            lastZ = z;
        }
    }

    // Añadir el evento de agitación
    window.addEventListener('devicemotion', agitarMarcadores, false);

} else {
    // El navegador no soporta la geolocalización
    console.log("Geolocalización no es soportada por tu navegador.");
}
