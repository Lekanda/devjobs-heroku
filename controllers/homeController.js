// const Vacante = require('../models/Vacantes');//Forma habitual
const mongoose = require('mongoose');// Otra forma de hacerlo
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req,res,next)=> {
    const vacantes = await Vacante.find({}).lean();

    if (!vacantes) return next();
   


    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica trabajos para desarrolladores Web',
        barra: true,
        boton: true,
        vacantes
    })
}