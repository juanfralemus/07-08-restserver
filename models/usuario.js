const { Schema, model } = require('mongoose');

// Creo mi esquema para el usuario
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // Envío el boolean y luego un mensaje de error en caso de que no sea enviado
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'] 
    },
    img: {
        type: String, // No es requerida por lo que no le agrego la propiedad "required"
    },
    rol: {
        type: String,
        required: true ,
        emun:['ADMIN_ROLE', 'USER_ROLE'] // Esta propiedad me va a validar que el rol sea una de las opciones ingresada en el arreglo.
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false 
    }

});

// Me creo un método para sobreescibir el método ".toJSON". 
UsuarioSchema.methods.toJSON = function() { // Debemos usar una función normal para poder usar el objeto "this". Cuando se mande a llamar el "toJSON" se va a ejecutar esta función. Por lo que entiendo, el "toJSON" se manda a llamar cuando imprimo la instancia de mi esquema en formato JSON al escribir "res.json(usuario)".
    const { __v, password, ...usuario } = this.toObject(); // Desestructuro las propiedades que no deseo mostrar al devolver mi usuario, que vienen de mi instancia "UsuarioSchema" convertida a un objeto con el método "toObject"; es decir, que las desestructuramos ahora solo teniendo las propiedades con sus valores respectivos. Todas las demás propiedades, que sí quiero que aparezcan, las almaceno en "usuario".
    return usuario; // Ahora mi método "toJSON" me devuelve este valor que representa solamente las propiedades que me interesa mostrar.
}



module.exports = model( 'Usuario', UsuarioSchema ); // Exportamos el modelo de cómo queremos que luzca nuestro elemento "usuario" en la base de datos. Primero le ingresamos un nombre (este también será el que tenga mi colección) y después el esquema que creamos.