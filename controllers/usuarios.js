const { response, request } = require('express'); // Desestructuro "response" y "request" de Express para tener en el tipado de VSCode las funcionalidades de la "res" y la "req". Por lo que entiendo, este paso no es necesario

// Creo la ruta get
const usuariosGet = (req = request, res = response) => { // Función que trabajo por separado con fines de orden que tiene la lógica de mi ruta. Se le conoce a esta función como "controlador". Coloco "req = request" y "res = response" para tener en el tipado de VSCode las funcionalidades de la "req" y "res", pero no es necesario

    const { q, nombre = 'No name', apikey, page = 1, limit = page } = req.query; // Mando a llamar los parámetros que necesito de la request (por ejemplo, .../usuarios?q=hola&nombre=fernando&apikey=213123). Puedo establecer valores por defecto

    res.json({ // Para enviar información en formato "json" escribo "res.json" en vez de "res.send"
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

// Creo la ruta put
const usuariosPut = (req, res) => {
    
    const { id } = req.params; // Mando a llamar de los argumentos guardados en request, los que necesite. En este caso "id"

    res.status(500).json({ // De esta forma enviamos el estatus de error como programadores del backend
        msg: 'put API - controlador',
        id
    });
}

// Creo la ruta post
const usuariosPost = (req, res) => { 

    const { nombres, edad } = req.body; // Desestrucuramos las propiedades deseadas del "body" que viene de la request (req) 

    res.status(201).json({
        msg: 'post API - controlador',
        nombres,
        edad
    });
}

// Creo la ruta delete

const usuariosDelete = (req, res) => { 

    res.json({
        msg: 'delete API - controlador'
    });
}

// Creo la ruta patch

const usuariosPatch = (req, res) => { 

    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}

    
