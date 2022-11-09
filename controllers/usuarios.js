const { response, request } = require('express'); // Desestructuro "response" y "request" de Express para tener en el tipado de VSCode las funcionalidades de la "res" y la "req". Por lo que entiendo, este paso no es necesario
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario'); // Importo mi modelo de usuario. Le coloco mayúscula al inicio para poder crear instancias de mi modelo.

// Creo la ruta get
const usuariosGet = async(req = request, res = response) => { // Función que trabajo por separado con fines de orden que tiene la lógica de mi ruta. Se le conoce a esta función como "controlador". Coloco "req = request" y "res = response" para tener en el tipado de VSCode las funcionalidades de la "req" y "res", pero no es necesario. Lo que sí es necesario para trabajar mis contrladores es colocar como parámetros "req" y "res", cuyas funcionalidades vienen de haber importado "response" y "request" en este archivo.

    const { desde = 0, limite = 5 } = req.query; // Traigo de la query de la request (.../usuarios?q=hola&nombre=fernando&apikey=213123, por ejemplo) los parámetros que me interesan. Puedo establecer valores por defecto.
    const query = { estado: true }; // "query" es una const que uso algunas veces en este controlador.

    const [ total, usuarios ] = await Promise.all([ // "Promise.all" me permite mandar un arreglo con todas las promesas que quiero que se ejecuten. A lo que sea que iguale este "Promise.all", será una colección (arreglo) de promesas, por lo que lo que regresen estas será guardado en lo que sea a lo que igualé el "Promise.all". En este caso, se guarda en "total" y "usuarios" que desestructuro del arreglo. Le coloco un "await" a esta promesa para que se ejecute de manera asíncrona.
        Usuario.countDocuments(query), // Recuento cuánto usuarios tengo con la condición indicada. En este caso que "estado" esté en "true".
        Usuario.find(query) // Busco en base de datos los usuarios con las restricciones que quiero. En este caso, nuevamente que el estado esté en "true". Si quisiera buscar entre todos, dejo Usuario.find().
        // Paginación
        .skip( Number(desde) ) // Establezco desde qué usuario voy a mostrar. El valor "desde" y cualquiera que venga de la query es un String, y la función "skip" requiere un número, por lo que aplicamos la función "Number" para convertirlo.
        .limit( Number(limite) ) // Establezco el límite de los usuarios a mostrar.
    ])

    res.json({ // Para enviar información en formato "json" escribo "res.json" en vez de "res.send"
        total, // Imprimo mis usuarios y el número total de estos con la conidicón indicada que tengo.
        usuarios
    });
}

// Creo la ruta put
const usuariosPut = async(req, res) => {
    
    const { id } = req.params; // Mando a llamar de los argumentos guardados en request, los que necesite. En este caso "id".
    const { password, google, correo, _id, ...resto } = req.body; // Mando a llamar el body (la request) pero desestructuro por separado los parámetros que quiero que no puedan ser modificados desde el front-end, exceptuando el "password" que lo saco para luego agregarlo a "resto" pero ya encriptado.

    if ( password ) {
        // Encriptar la constraseña. Más info. de esto en el controlador post.
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt ); // Agregamos una nueva propiedad a "resto" que se llama "password" y le asignamos el valor de la contraseña encriptada.
    }

    // Actualizamos el registro que nos envían
    const usuario = await Usuario.findByIdAndUpdate( id, resto ); // En "usuario" va a estar grabado el usuario que queremos actualizar en la DB. Lo encontramos por el "id" que recibimos de la request y lo enviamos como primer argumento. Como segundo argumento enviamos los parámetros que deseamos actualizar y se asignan los cambios a los valores de los parámetros en la DB, como sucedía en la creación de un nuevo Usuario.

    res.status(500).json(usuario); // De esta forma enviamos el estatus de error como programadores del backend
    
}

// Creo la ruta post. Esta usualmente va a enviar su data por el body (esta sería la request). Este body lo hemos enviado en Postman seleccionando la opción "raw" y en fomato "JSON". Lo lanzamos como un objeto con propiedades.
const usuariosPost = async(req, res) => { 

    // RECIBIMOS LA REQUEST
    const { nombre, correo, password, rol } = req.body; // Desestrucuramos las propiedades deseadas del "body" que viene de la request (req). Puede ser que queramos hacer esto para restringir qué datos no pueden ser cambiados desde esta vía del front-end. Por otra parte, nosotros somos capaces de importar todo el body escribiendo "body" en vez de la desestructuración.

    // Me creo una NUEVA INSTANCIA DE MI USUARIO. Tomamos las propiedades de "body" o del objeto que hayamos recibido para llenar nuestro esquema (este verifica que coincidan y las asigna). El esquema para un nuevo usuario es creado más aún no ha sido guardada en la base de datos.
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Verificar si el correo existe sin usar Express-Validator (la mejor forma es usándolo)

    //const existeEmail = await Usuario.findOne({ correo }); // "findOne" va a buscar un esquema "Usuario" que tenga un elemento dentro que le especifiquemos, en este caso va a buscar uno que tenga el objeto "correo" cuyo "valor" (como en inquirer) sea igual al "correo" que recibí como argumento (escribí solamente "{correo}" refiriréndome a "{correo:correo}", donde el primero es el valor del objeto "correo" y el segundo el argumento que vino de la "req".). Luego de buscarlo me va a regresar el elemento que le especifiqué si lo encontró, y si no, me regresa "null". Puedo buscar entre todos los esquemas (elementos) que están en mi base de datos (y también entre los que aún no, más si han sido creados en una nueva instancia de "Usuario") con el "findOne" como una función de "Mongoose" supongo.
    //if ( existeEmail ) { // Mandamos el mensaje de error
    //    return res.status(400).json({ // Colocamos "return" para que hasta aquí llegue la ejecución de este controlador
    //        msg: 'Este correo ya está registrado'
    //    }); 
    //}

    // Encriptar la constraseña
    const salt = bcryptjs.genSaltSync(); // El "salt" es básicamente el número de vueltas que quiero hacer para hacer más complicada la "desencriptación". Por defecto se envía un argumento de "10 vueltas" (como número, no String, aunque se puede enviar un String pero no he visto cómo) pero nosotros podemos configurar este número tomando en cuenta que a más vueltas más tarda en generarse la encriptación.
    usuario.password = bcryptjs.hashSync( password, salt ); // Aplico la encriptación a mi contraseña diciendo que voy a configurar la propiedad "password" que viene de "usuario". El hash es para encriptarla en una sola vía. Primero me pide el String que yo quiero encriptar y luego el salt. Escribí solo "password" en el primer argumento pues venía y está desestrucurada del body de la request.

    // Para grabar el registro en la DB
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

// Creo la ruta delete

const usuariosDelete = async(req, res) => { 

    const { id } = req.params; // Mando a llamar el "id" que recibí en el URL.

    // Físicamente lo borramos (NO RECOMENDADO)
    // const usuario = await Usuario.findByIdAndDelete( id ); // Borro el usuario con el "id" que recibo y guardo este usuario en mi const "usuario".
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } ); // Como segundo argumento envío un objeto con los cambios que deseo realizar. En la const "usuario" se guarda el usuario modificado.

    res.json(usuario);
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

    
