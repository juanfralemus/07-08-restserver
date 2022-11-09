
const { Router } = require('express'); // Desestructuro la función "Router" de Express
const { check, query } = require('express-validator'); // Desestructuro "check" para validar valores del body y de los params. Desestructuro "query" para validar valores del query. 

const { validarCampos } = require('../middlewares/validar-campos'); // Importo la función para validar los campos en el router.
const { esRoleValidoYNec, emailExiste, existeUsuarioPorId, esRoleValidoMásNoNec } = require('../helpers/db-validators'); // Importo mi función para validar el rol contra la base de datos.

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete,
        usuariosPatch} = require('../controllers/usuarios'); // Importo mis funciones de mis rutas

const router = Router(); // Llamamos la función "Router". A esta función es a la que yo le voy a configurar las rutas

    // Configuro mi ruta (endpoint) get para la ruta "/", que es en realidad la ruta que establecí en el middleware (en el app.js) donde mandé a llamar estas rutas que estoy configurando en este archivo
    router.get('/', [ // Así se configuran las rutas usando la función "Router" de Express. Se cambia "this.app" por "router" porque no existe acá dicha propiedad, más sí existe "router" perfectamente, que viene de la función "Router". 
    query('desde', `El valor de 'desde' debe ser numérico`) // El query es un "check" pero para parámetros del query.
        .isNumeric()
        .optional(), // Puedo agregar dos validaciones en un solo middleware cuando utilizo "optional()".
    query('limite', 'El límite debe tener un valor numérico')
        .isNumeric()
        .optional(),
    validarCampos // Middleware que hace funcionar mis "query" y "check".
    ], usuariosGet );
    
    // Configuro mi ruta PUT para mi ruta indicada. Este se puede utilizar para actualizar algo. En este caso, un usuario.
    // Coloco " :'nombre del parámetro' " para recibir un argumento desde el URL. Este se guarda en una propiedad del objeto request llamado "params" que mandamos a llamar en nuestros controladores. Esta ruta ahora solo funciona con ese argumento que recibimos
    router.put('/:id', [ // Envío como segundo argumento los middlewares que quiero usar en esta ruta
    check('id', 'No es un ID válido').isMongoId(), // El check también puede jalar los segmentos (los req.params) que ingreso en la URL. Verifico que sea un ID válido de Mongo con la función "isMongoId" de Express-Validator. Si no lo es, mando el mensaje de error.
    check('id').custom( existeUsuarioPorId ), // Verifico que el ID ingresado como segmento exista en algún usuario de la DB.
    check('rol').custom( esRoleValidoMásNoNec ), // Verifico que el rol para actualizar sea válido. Configuro que no sea necesario ingresarlo.
    validarCampos 
    ], usuariosPut); 

    // Configuro mi ruta POST para mi ruta indicada. Esta usualmente se utliza para crear algo. En este caso, un usuario.
    router.post('/', [ 
        check('nombre', 'El nombre es obligatorio' ).not().isEmpty(), // "Check" es un middleware que viene de Express-Validator en el cual yo le puedo especificar qué campo del body o de los params necesito revisar y enviar un mensaje de error. Luego le especifico qué tipo de dato espero tener, en este caso que no sea algo vacío. Para ello, coloco la negación de un "isEmpty()".
        check('password', 'El password debe tener 6 o más letras' ).isLength({ min:6 }), // En este caso le asignamos un mínimo de caracteres.
        check('correo', 'El correo no es válido' ).isEmail(), // Que sea un email.
        check('correo').custom( emailExiste ), // Que el email no exista ya en la DB, para lo que enviamos una verificación customizeada. Más detalles de cómo funciona esto en el "check" del "rol".
        // check('rol', 'No es un rol válido' ).isIn(['ADMIN_ROLE', 'USER_ROLE']), // Este check revisa que este campo se encuentre dentro del arreglo indicado.
        check('rol').custom( esRoleValidoYNec ), // En vez del mensaje de error le mando una verificación personalizada con el "custom". Recibe como argumento una función donde customeo la verificación del rol contra la DB y también el error por si no viniera desde el body un valor para el rol. La forma original de colocar esta función sería escribiendo "(rol) => esRoleValido(rol)", donde recibimos como argumento el rol que viene del body y lo enviamos a nuestra función que creamos en nuestra carpeta "helpers". Sin embargo, somos capaces de colocar solamente la función para representar esa expresión. 
        validarCampos // Valido los "check" (y cualquier otro middleware) anteriormente colocados en esta ruta.  
    ], usuariosPost); 

    // Configuro mi ruta DELETE para mi ruta indicada
    router.delete('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
    ], usuariosDelete); // Recibimos el id en la "req.params".

    // Configuro mi ruta PATCH para mi ruta indicada
    router.patch('/', usuariosPatch);



module.exports = router; // Exporto la función Router