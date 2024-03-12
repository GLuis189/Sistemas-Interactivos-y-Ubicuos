const http = require('http');
const fs = require('fs');

const PORT = 8080;

const serveStaticFile = async (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function(err, data) {
      if(err) reject(err);
      resolve(data);
    });
  });
} 

const sendResponse = (response, content, contentType) => {
  response.writeHead(200, {"Content-Type": contentType});
  response.end(content);
}

const handleRequest = async (request, response) => {
  const url = request.url;

  if(request.method === "GET"){
    let content;
    let contentType;
    switch(url){
      case "/":
      case "/index.html":
        content = await serveStaticFile("www/index.html");
        contentType = "text/html";
        break;
      case "/script.js":
        content = await serveStaticFile("www/script.js");
        contentType = "text/javascript";
        break;
      case "/style.css":
        content = await serveStaticFile("www/style.css");
        contentType = "text/css";
        break;
      case "/tasks/get":
        content = await serveStaticFile("tasks.json");
        contentType = "application/json";
        break;
      default: 
        content = "Ruta no v&aacutelida\r\n";
        contentType = "text/html";
    }

     sendResponse(response, content, contentType);
    } else if (request.method === "POST" && url === "/tasks/update") {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString(); // Convertir los datos del cuerpo de la solicitud a cadena
      });
      request.on('end', async () => {
        try {
          const updatedTasks = JSON.parse(body); // Convertir la cadena JSON a objeto JavaScript
          await fs.promises.writeFile("tasks.json", JSON.stringify(updatedTasks, null, 2)); // Escribir los datos actualizados en el archivo tasks.json
          sendResponse(response, "Tasks updated successfully", "text/plain");
        } catch (error) {
          console.error("Error updating tasks:", error);
          response.writeHead(500, {"Content-Type": "text/html"});
          response.write("Internal Server Error");
          response.end();
        }
      });
    } else {
      response.writeHead(405, {"Content-Type": "text/html"});
      response.write(`Método ${request.method} no permitido!\r\n`);
      response.end();
    }
  }


const server = http.createServer(handleRequest);
server.listen(PORT);