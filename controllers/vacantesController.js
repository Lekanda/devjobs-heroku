// const Vacante = require('../models/Vacantes');//Forma habitual
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const shortid = require('shortid');


const mongoose = require('mongoose');// Otra forma de hacerlo
const Vacante = mongoose.model('Vacante');

exports.formularioNuevaVacante = (req,res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el Formulario y publica una Vacante',
        cerrarSesion: true,
        imagen: req.user.imagen,
        nombre: req.user.nombre
    })
}

// Metodo que agrega las vacantes nuevas
exports.agregarVacante = async(req,res) => {
    // console.log(req.body.salario);
    const vacante = new Vacante(req.body);
    //Usuario Autor de Vacante
    vacante.autor = req.user._id;
    // Crear Arreglo de hablilidades(skills)
    vacante.skills = req.body.skills.split(',');// Quita las comas y crea un arreglo de skills
    // console.log(vacante);
    // Almacenar en DB
    const nuevaVacante = await vacante.save();
    // Redireccionar 
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

// Metodo para Mostrar una vacante
exports.mostrarVacante = async(req,res,next) => {
   const vacante = await Vacante.findOne({url: req.params.url}).populate('autor').lean();
    console.log(vacante);
    
   if (!vacante) return next();

   res.render('vacante', {
       vacante,
       nombrePagina: vacante.titulo,
       barra: true
   })
}

exports.formEditarVacante = async (req,res,next) => {
    const vacante = await Vacante.findOne({url:req.params.url}).lean();
    if(!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        imagen: req.user.imagen,
        nombre: req.user.nombre
    })
}

exports.editarVacante = async (req,res) => {
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');
    console.log(vacanteActualizada);
    const vacante = await Vacante.findOneAndUpdate({url: req.params.url}, vacanteActualizada, {
        new: true,// Trae el actualizado
        runValidators: true// Para que tome todo lo que hay en el modelo
    }).lean();
    res.redirect(`/vacantes/${vacante.url}`);
}

// Validar y Sanitizar los campos de las vacantes
exports.validarVacante = async (req,res,next) => {
    // Sanitizar los campos
    const rules = [
        //*****SANITIZAR Y VALIDAR********* */
        // Campo Titulo
        body('titulo').not().isEmpty().withMessage('Agrega un titulo').escape(),

        // Campo 
        body('empresa').not().isEmpty().withMessage('Hay que poner Nombre de Empresa').escape(),

        // Campo Ubicacion
        body('ubicacion').not().isEmpty().withMessage('Pon una Ubicacion').escape(),

        // Campo Salario
        body('salario').escape(),

        // Campo Contrato
        body('contrato').not().isEmpty().withMessage('Elije un tipo de contrato').escape(),

        // Campo Skills
        body('skills').not().isEmpty().withMessage('Agrega una habilidad por lo menos').escape()
    ];
    await Promise.all(rules.map( validation => validation.run(req)));
    const errores = validationResult(req);

    if(errores.isEmpty()){
        return next();
    }
    req.flash('error', errores.array().map(error => error.msg));
    // console.log(errores);
    
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el Formulario y publica una Vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        mensajes:req.flash()
    })
}


// Metodo para Eliminar Vacante
exports.eliminarVacante = async (req,res)  => {
    const { id } = req.params;
    // console.log(id);
    const vacante = await Vacante.findById(id);
    // console.log(vacante);
    if (verificarAutor(vacante, req.user) ) {
        // Usuario ok , se puede eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    }else{
        // No es el usuario correcto no elimina
        res.status(403).send('Error');
    }
    
}

const verificarAutor = (vacante = {}, usuario= {}) => {
    if(!vacante.autor.equals(usuario._id)) {
        return false;
    }
    return true;
}


//******Subir Archivos en PDF*************/
exports.subirCV = (req,res,next) => {
    upload(req,res, function(error) {
        if(error) {
            // console.log(error);
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande: Maximo 500kb');
                }else{
                    req.flash('error', error.message);
                }
            } else {
                // console.log(error.message);
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
        
    });
}

const configuracionMulter = {
    limits: { fileSize: 500000 },
    storage: fileSorage = multer.diskStorage({
        destination:(req ,file, cb) => {
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename: (req,file, cb) => {
            // console.log(file);
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb) {
        if (file.mimetype === 'application/pdf') {
            // El callback se ejecuta como true o false: TRUE: Cuando la imagen se acepta;
            cb(null, true);
        }else{
            cb(new Error('Formato  no valido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('cv');

// Almacenar los candidatos en la DB
exports.contactar = async (req,res, next)=> {
    // console.log(req.params.url);
    const vacante = await Vacante.findOne({url:req.params.url});

    // Sí no existe la Vacante Salimos
    if (!vacante) return next();

    // Todo Bien construir el nuevo Objeto
    const nuevoCandidato = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        cv: req.file.filename
    }

    // Almacenar la Vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();
    console.log(vacante);
    

    // Mensaje Flash y redireccion
    req.flash('correcto', 'Se envio tu CV correctamente');
    res.redirect('/');
}

exports.mostrarCandidatos = async (req,res,next) => {
    // console.log(req.params.id);
    const vacante = await Vacante.findById(req.params.id);
    // console.log(vacante);
    console.log(vacante.autor);
    console.log(req.user._id);

    // console.log(typeof vacante.autor);
    // console.log(typeof req.user._id);

    // return;

    if(vacante.autor != req.user._id.toString()) {
        return next();        
    }
    if(!vacante) return next();

    res.render('candidatos', {
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
    // console.log('Pasamos la validacion');
}



// Buscador de Vacantes 
exports.buscarVacantes = async(req,res,next) => {
    const vacantes = await Vacante.find({
        $text : {
            $search : req.body.q
        }
    });
    // console.log(vacante);
    // Mostrar las vacantes
    res.render('home', {
        nombrePagina: `Resultados para la busqueda: ${req.body.q}`,
        barra: true,
        vacantes
    })
}