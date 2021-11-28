const Server = require('./models/server');
require('dotenv').config();

//creamos instancia del servidor
const server = new Server();

//levantamos el servidor
server.listen();


 

 
