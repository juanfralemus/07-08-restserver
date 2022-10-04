// Orden de prioridad de importanción: 
// 1. Importaciones propias de Node
// 2. Importaciones de terceros
// 3. Importaciones de código

require('dotenv').config();
const  Server = require('./models/server');

const server = new Server(); // Inicio una nueva instancia de mi servidor

server.listen(); // Lanzo el método "listen" para levantar mi servidor




