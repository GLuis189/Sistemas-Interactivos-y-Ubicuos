if ('Accelerometer' in window) {
    // El navegador tiene el código para la interfaz 'Accelerometer'
    // Ahora tenemos que comprobar que el dispositivo tenga un accelerometro 
    // desde donde leer los datos
    let accelerometer = null;
    try {
      accelerometer = new Accelerometer({ frequency: 10 });
      accelerometer.onerror = (event) => {
        // Errores en tiempo de ejecución
        if (event.error.name === 'NotAllowedError') {
          alert('Permission to access sensor was denied.');
        } else if (event.error.name === 'NotReadableError') {
          alert('Cannot connect to the sensor.');
        }
      };
      const p = document.querySelector("#reading");
      accelerometer.onreading = (e) => {
        console.log(e);
        p.innerHTML = `${accelerometer.x} ${accelerometer.y} ${accelerometer.z}`;
      };
      accelerometer.start();
    } catch (error) {
      // Error en la creación del objeto
      if (error.name === 'SecurityError') {
        alert('Sensor construction was blocked by the Permissions Policy.');
      } else if (error.name === 'ReferenceError') {
        alert('Sensor is not supported by the User Agent.');
      } else {
        throw error;
      }
    }
  }