if ('Accelerometer' in window) {
    let accelerometer = null;
    var threshhold = 20;
  
    let xPreTotalAcc = 0;
    let yPreTotalAcc = 0;
    let zPreTotalAcc = 0;
    let xPostTotalAcc = 0;
    let yPostTotalAcc = 0;
    let zPostTotalAcc = 0;
  
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
      accelerometer.onreading = (e) => {
        xPreTotalAcc = accelerometer.x;
        yPreTotalAcc = accelerometer.y;
        zPreTotalAcc = accelerometer.z;
      };
      accelerometer.start();
  
      setInterval(function() {
        let change = Math.abs(xPreTotalAcc - xPostTotalAcc + yPreTotalAcc - yPostTotalAcc + zPreTotalAcc - zPostTotalAcc);
        if (change > threshhold) {
          document.body.style.backgroundColor = "red";
        } else {
          document.body.style.backgroundColor = "white";
        }
        // Update new position
        xPostTotalAcc = xPreTotalAcc;
        yPostTotalAcc = yPreTotalAcc;
        zPostTotalAcc = zPreTotalAcc;
      }, 500);
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