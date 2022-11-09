const { validationResult } = require('express-validator'); // Importo la función "validationResult" del paquete Express-Validator

// Creamos nuestro middleware personalizado.
const validarCampos = ( req, res, next ) => { // Un middleware es una función. Como los controladores, tiene como parámetros la req. y la res. Colocamos un tercer parámetro "next", que lo tenemos que llamar para que ejecute los vaya ejecutando mis siguientes middlewares (mis "check" por ejemplo) que coloqué en mi router; y si no hubieran más middleware, pues para que ejecute el controlador también en el router.

    // Hacemos una VALIDACIÓN DE QUE LOS DATOS QUE VIENEN EN LA REQUEST ESTÉN CORRECTOS antes de intentar guardarlos en la base de datos, con el fin de poder mostrar mensajes de error al usuario y que no crashee el programa al no poder guardar en DB. Esto lo hacemos con ayuda de Express-Validator, que ya empezamos a usar en el Router con nuestros middleware "check".
    const errors = validationResult(req); // El check (o query) que puse en el router viene acumulando los errores en la request. Guardamos estos errores en la constante "errors".
    
    if( !errors.isEmpty() ){ // Por lo que entiendo, este proceso no ocurre antes que el "next()" (no es asíncrono), ya que primero espera a revisar todos los check y luego manda los errores si es que hay. 
        return res.status(400).json(errors); // Si la const de errores no está vacía entonces mostramos estos errores y acá acaba la ejecución de la ruta para que el usuario ingrese los datos de manera correcta.
    }  

    next();
}

module.exports = {
    validarCampos
}






