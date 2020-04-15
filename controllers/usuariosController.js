const mongoose = require('mongoose');// Otra forma de hacerlo
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Cuenta DevJobs',
        tagline: 'Comienza a publicar tus vacantes Gratis, Solo debes crear una cuenta'
    })
}

 // *******************METODO ACTUAL*********************
exports.validarRegistro = async (req, res, next) => {
    const rules = [
        // Campo Nombre
        body('nombre').not().isEmpty().withMessage('El nombre es Obligatorio').escape(),
        // Campo Apellidos
        body('apellidos').not().isEmpty().withMessage('El Apellido es Obligatorio').escape(),
        // Campo eMail
        body('email').isEmail().withMessage('El email debe ser valido').escape(),
        // Campo Password
        body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
        body('password').isLength(3).withMessage('El password debe tener 3 cifras o letras').escape(),
        // Campo confirmar Password
        body('confirmar').not().isEmpty().withMessage('Confirmar password no puede ir vacío').escape(),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente').escape()
    ];

    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
    // console.log(errores);
    
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes: req.flash()
    });
    return;
}

// // *******************METODO DEL VIDEO*********************
// exports.validarRegistro =  (req, res, next) => {
//         // Sanitizar los campos
//         req.sanitizeBody('nombre').escape();
//         req.sanitizeBody('apellidos').escape();
//         req.sanitizeBody('email').escape();
//         req.sanitizeBody('password').escape();
//         req.sanitizeBody('confirmar').escape();
        
//         // Validacion de Campos
//         req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();
//         req.checkBody('apellidos', 'El Nombre es Obligatorio').notEmpty();
//         req.checkBody('email', 'El email debe ser valido').isEmail();
//         req.checkBody('password', 'El password no puede ir vacio').notEmpty();
//         req.checkBody('confirmar', 'Confirmar password no puede ir vacio').notEmpty();
//         req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

//         const errores = req.validationErrors();
//         console.log(errores);
       
//         if(errores){
//             // si hay errores
//             console.log(errores);
            
//             req.flash('error', errores.map(error => error.msg));
    
//             res.render('crear-cuenta', {
//                 nombrePagina: 'Crea tu cuenta en devJobs',
//                 tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',mensajes: req.flash()
//             });
//             return;
//         }
        
//         // Si toda la validación es correcta
//         next();
// }
 

exports.formIniciarSesion = (req,res) => {
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesion devJobs'
    })
}

// Formulario para  Editar el perfil
exports.formEditarPerfil = (req,res) => {
    console.log(req.user);;
    console.log(req.user.imagen);
    
    res.render('editar-perfil', {
        nombrePagina: 'Editar Perfil',
        usuario: req.user,
        cerrarSesion: true,
        imagen: req.user.imagen
    })
    // console.log(req.user);
}

//****************Validar y Sanitizar*******************/
exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Cuenta DevJobs',
        tagline: 'Comienza a publicar tus vacantes Gratis, Solo debes crear una cuenta'
    })
}

// Sanitizar y Validar el Formulaio de Editar Perfiles

    //  *******************METODO ACTUAL*********************
exports.validarPerfil = async (req, res, next) => {
    console.log(req.body);

    const rules = [
        // Campo Nombre******
        body('nombre').not().isEmpty().withMessage('El nombre esObligatorio').escape(),
        // Campo Apellidos******
        body('apellidos').not().isEmpty().withMessage('El Apellido esObligatorio').escape(),
        // Campo eMail
        body('email').isEmail().withMessage('El email debe ser valido').escape(),
        
    ];
    if(req.body.password ) {
        const rules = [
            // ***********Campo Password*************
            body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
            body('password').isLength(3).withMessage('El password debe tener 3 cifras o letras').escape(),
        ];
    }
    
    // console.log(req.user.password);
    
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);
    // console.log(errores);
    
    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    res.render('editar-perfil', {
        nombrePagina: 'Editar Perfil',
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        mensajes: req.flash()
    })
    return;
}