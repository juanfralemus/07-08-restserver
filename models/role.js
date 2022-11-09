const { Schema, model } = require('mongoose');

const RoleSchema = Schema({ // Me creo un modelo de los roles que establecí en la DB para que Mongoose sea capaz de analizarlos y leerlos.
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});

module.exports = model( 'Role', RoleSchema );