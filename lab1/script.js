// Eliminar las acciones por defecto
document.addEventListener('contextmenu', (event) =>{
    event.preventDefault();
});

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

    // const route = document.getElementById('route');
    // route.addEventListener('click', function() {
    //     console.log("route");
    //     // Elimina las rutas anteriores
    //     map.eachLayer(function(layer) {
    //         if (layer instanceof L.Polyline) {
    //             map.removeLayer(layer);
    //         }
    //     });

    //     // Obtiene las coordenadas de la posición actual
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         let pos = [position.coords.latitude, position.coords.longitude];
    //         console.log("route");

    //         // Dibuja la ruta desde la posición actual hasta el marcador más cercano
    //         markers.forEach((m) => {
    //             let coord = m.getLatLng();
    //             L.Routing.control({
    //                 waypoints: [
    //                     L.latLng(pos),
    //                     L.latLng(coord)
    //                 ],
    //                 router: new L.Routing.osrmv1({
    //                     serviceUrl: 'https://router.project-osrm.org/route/v1'
    //                 }),
    //                 routeWhileDragging: true
    //             }).addTo(map);
    //             console.log("route");
    //         });
    //     });
    // });

    // ACtualizar la posición del marcador yo y la vista del mapa y vibrar el dispositivo en funcion de la distancia a el marcador mas cercano
    navigator.geolocation.watchPosition(function(position) {
        let pos = [position.coords.latitude, position.coords.longitude];
    
        // Actualizar la posición del marcador y la vista del mapa
        yo.setLatLng(pos);
        map.flyTo(pos, 16);
        markers.forEach((m) => {
            let distancia = yo.getLatLng().distanceTo(m.getLatLng());
            if (distancia < 10) {
                // Eliminar el marcador
                map.removeLayer(m);
                markers = markers.filter(function(marker) {
                    return marker !== m;
                });
                navigator.vibrate([1000]);
                console.log("Eliminado")
            }
        });

        // Hacer vibrar el dispositivo en función de la distancia al marcador más cercano
        setInterval(function() {
            markers.forEach((m) => {
                let distancia = yo.getLatLng().distanceTo(m.getLatLng());
                if (distancia < 50) {
                   navigator.vibrate([500,50,500]);
                   console.log("Vibrando 50");
                }
                else if (distancia < 100) {
                    navigator.vibrate([200]);
                    console.log("Vibrando 100");
                }
                else if (distancia < 200) {
                    navigator.vibrate([100]);
                    console.log("Vibrando 200");
                }
                else if (distancia < 400) {
                    navigator.vibrate([100]);
                    console.log("Vibrando 400");
                }
                else{
                    navigator.vibrate([100,500]);
                }
            });
        }, 1000 * 15); // El intervalo de tiempo en milisegundos, 1000 ms = 1 segundo * 15 = 15 segundos
    });


} else {
    // El navegador no soporta la geolocalización
    console.log("Geolocalización no es soportada por tu navegador.");
}
