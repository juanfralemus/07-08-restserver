const Role = require('../models/role'); // Importo mi modelo del rol para poder buscar estos en mi DB.
const Usuario = require('../models/usuario'); // Importo mi modelo de usuario para poder buscar entre estos si el email ya existe.

const esRoleValidoYNec = async(rol = '') => { // Creo una función para customear la verificación del rol contra la base de datos y verificar que un rol venga en el body. A esta le mando como argumento el valor que puede ser que tenga en el body (en este caso, el valor de "rol") en mi ruta con mi middleware "validarCampos" (que está en la carpeta de los middleware). La envío con un valor predeterminado (vacío en este caso) por si este no es enviado, lo que nos daría que tengamos "undefined" como su valor, y el programa crashearía.
    if ( rol ) { // Si el rol vino como argumento, existe, entonces verificar que esté en nuestra DB de los roles.
        const existeRol = await Role.findOne({ rol }); // Encuentra un rol en la DB que coincida con el que le envío. Somos capaces de leer la colección "roles" en la DB con Mongoose hasta que creamos un esquema para los roles. En este caso "Role".
        if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`);// Así mando un error personalizado con Express-Validator. Este, junto con los demás errores custom, se van almacenando en la cola de los errores con la función "validationResult" que usamos en "validador-campos.js" en la carpeta "middlewares".
    }
    } else { // Si el rol no viene, entonces enviar un mensaje de error.
        throw new Error(`El rol es obligatorio`);
    }
}

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo }); // "findOne" va a buscar un esquema "Usuario" que tenga un elemento dentro que le especifiquemos, en este caso va a buscar uno que tenga el objeto "correo" cuyo "valor" (como en inquirer) sea igual al "correo" que recibí como argumento (escribí solamente "{correo}" refiriréndome a "{correo:correo}", donde el primero es el valor del objeto "correo" y el segundo el argumento que vino de la "req".). Luego de buscarlo me va a regresar el elemento que le especifiqué si lo encontró, y si no, me regresa "null".
    if ( existeEmail ) { // Mandamos el mensaje de error
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById( id ); // "findById" va a buscar un esquema "Usuario" que tenga el "id" que le estoy enviando desde la "req.params". Luego de buscarlo me va a regresar el usuario. 
    if ( !existeUsuario ) { 
        throw new Error(`El ID: ${ id }, no existe`);
    }
}

const esRoleValidoMásNoNec = async(rol = '') => { // Replico la función "esRoleValidoYNec" pero sin enviar un error en caso de que no venga un rol, pues solo lo estamos actualizando. Como valor predeterminado envío un String vacío para que por si no vieniera, no tuviera "undefined" al analizar si vino mi rol como argumento.
    if ( rol ) { // Si el rol existe, hacer el análisis, si no, dejar pasar sin errores.
        const existeRol = await Role.findOne({ rol }); 
        if ( !existeRol ) {
            throw new Error(`El rol ${ rol } no está registrado en la BD`);
        }
    } 
}


module.exports = { // Exporto mi función para validar el rol.
    esRoleValidoYNec,
    emailExiste,
    existeUsuarioPorId,
    esRoleValidoMásNoNec
}