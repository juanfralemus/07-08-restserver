const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server { // Se inicia una nueva instancia de mi servidor

    constructor() {

        // Defino mis propiedades en el constructor, iniciando por ponerles "this." pues son propiedades de mis clase que pudieron haber sido definidas afuera del cosntructor. Cuando mando a llamar una propiedad de una siempre tengo que especificar la clase a la que pertenece. 
        this.app = express(); // Me creo la aplicación de Express aquí como una propiedad de la clase "Servidor". El servidor es ahora una propiedad
        this.port = process.env.PORT; // Creo una propiedad que guarda mi variable de entorno para el puerto
        this.usuariosPath = '/api/usuarios'; // Creo una propiedad que guarde un String que sea la ruta para los "usuarios". Esto es con fines de orden para que quien mire mi código pueda ver qué rutas existen en la aplicación

        // Conectar a base de datos
        this.conectarDB(); // Ejecuto el método para la conectar a mi DB.

        // Middlewares: Funciones que nos proveen herramientas para nuestra aplicación. Los que se encuentran acá siempre se van a ejecutar cuando nosotros levantemos nuestro servidor
        this.middlewares(); // Ejecuto el método para los middlewares.

        // Rutas de mi aplicación
        this.routes(); // Cuando se llame al constructor, al final, voy a llamar mis rutas. Se dispara dicho método y este configura mis rutas 
    }

    async conectarDB() { // Creo mi método asíncrono para conectar mi base de datos
        await dbConnection(); // Mando a llamar la función asíncrona que tiene el URL y los argumentos para realizar la conexión a mi DB.
    }

    middlewares() { // Creo mi método para los Middlewares

        // CORS: Restringe las páginas desde las que quiero que solo de ellas se pueda llamar mi endpoint (API)
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() ); // Cualquier información que venga del body de una petición post, put, ´patch o delete se va a intentar leer y serializar a un formato json

        // Directorio Público
        this.app.use( express.static('public') ); // El "use" es la palabra clave para decir que esto es un Middleware

    }

    routes() { // Creo mi método para las rutas

        // Creamos las rutas y les asignamos su contenido
        this.app.use( this.usuariosPath, require('../routes/usuarios')); // Aplico este middleware al cual le voy a poner ciertas rutas (Get, Post, Put, etc.). Se usa lo que se aplicó en "Router". Aquí establecemos primero el path y luego lo que vamos a cargar ahí

    }

    listen() { // Creo mi método para escuchar (ejecturar) en el puerto deseado
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port)
        })
    }
}


module.exports = Server;