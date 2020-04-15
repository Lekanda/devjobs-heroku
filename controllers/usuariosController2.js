const mongoose = require('mongoose');// Otra forma de hacerlo
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req,res,next) => {
    upload(req,res, function(error) {
        if(error) {
            // console.log(error);
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande: Maximo 100kb');
                }else{
                    req.flash('error', error.message);
                }
            } else {
                // console.log(error.message);
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
        
    });
}

// Opciones de MULTER
const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileSorage = multer.diskStorage({
        destination:(req ,file, cb) => {
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename: (req,file, cb) => {
            // console.log(file);
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/x-icon' || file.mimetype === 'image/png') {
            // El callback se ejecuta como true o false: TRUE: Cuando la imagen se acepta;
            cb(null, true);
        }else{
            cb(new Error('Formato de Imagen no valido.Solo JPEG y PNG'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');

exports.editarPerfil = async (req,res) => {
    const usuario = await Usuarios.findById(req.user._id);
    // console.log(req.user.apellidos);
    // console.log(req.body.apellidos);
    usuario.nombre = req.body.nombre;
    usuario.apellidos = req.body.apellidos;
    usuario.email = req.body.email;
    
    if(req.body.password) {
        usuario.password = req.body.password;
    }

    // console.log(req.file);
    if(req.file) {
        usuario.imagen = req.file.filename;
    }
    await usuario.save();
    // console.log(usuario.apellidos);
    // console.log(usuario);
    req.flash('correcto', 'Cambios Guardados');
    // Redirect
    res.redirect('/administracion');
}

exports.crearUsuario = async (req,res,next) => {
    // Crear el Usuario
    const usuario = new Usuarios(req.body);
    // console.log(usuario);// Se crea la instancia de Usuarios
    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}