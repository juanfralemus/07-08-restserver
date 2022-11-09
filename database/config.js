// Creo este archivo para poner mi base de datos en modo online y conectarla con mi aplicación. Desde aquí me puedo conectar y agregar data a mi base de datos (teniendo el usuario y contraseñas requeridos, que se ingresan como un link) y desde Mongo Compass puedo levantar mi DB y visualizar la data (teniendo este mismo link con el usuario y contraseña).   

const mongoose = require('mongoose'); // Importamos nuestro Object Data Modeling "Mongoose". Un ODM nos permite modelar objetos de nuestra información quue tenemos grabada en la base de datos y conectar esta a nuestra aplicación.

// Creo la función asíncrona que tiene el URL y los argumentos para realizar la conexión a mi DB.
const dbConnection = async() => {

    try {

        // Establecemos la conexión a Mongo
        await mongoose.connect( process.env.MONGODB_CNN, { // Esto me regresa una promesa, por lo que colocamos en await. Ingresamos nuestro URL de conexión y luego mandamos ciertos objetos para completar la conexión.
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); 

        console.log('Base de datos online');
        
    } catch (error) {
        console.log(error); // Miramos el error en el servidor web
        throw new Error('Error a la hora de iniciar la base de datos'); // Miramos el error en la consola
    }
}

module.exports = {
    dbConnection
}