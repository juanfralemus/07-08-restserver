
const { Router } = require('express'); // Desestructuro la función "Router" de Express

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete,
        usuariosPatch} = require('../controllers/usuarios'); // Importo mis funciones de mis rutas

const router = Router(); // Llamamos la función "Router". A esta función es a la que yo le voy a configurar las rutas

    // Configuro mi ruta (endpoint) get para la ruta "/", que es en realidad la ruta que establecí en el middleware (en el app.js) donde mandé a llamar estas rutas que estoy configurando en este archivo
    router.get('/', usuariosGet ); // Así se coniguran las rutas usando la función "Router" de Express. Se cambia "this.app" por "router" porque no existe acá dicha propiedad, más sí existe "router" perfectamente, que viene de la función "Router". 
    
    // Configuro mi ruta put para mi ruta indicada
    router.put('/:id', usuariosPut); // Coloco " :'nombre del parámetro' " para recibir un argumento desde el URL. Este se guarda en una propiedad del objeto request

    // Configuro mi ruta post para mi ruta indicada
    router.post('/', usuariosPost);

    // Configuro mi ruta delete para mi ruta indicada
    router.delete('/', usuariosDelete);

    // Configuro mi ruta patch para mi ruta indicada
    router.patch('/', usuariosPatch);



module.exports = router; // Exporto la función Router