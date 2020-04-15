const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false// De esta forrma tambien vale
});
// mongoose.set('useFindAndModify', false);  
mongoose.set('useCreateIndex', true);

mongoose.connection.on('error', (error)=> {
    console.log(error);
    
})

//Importar los Modelos
require('../models/Usuarios');
require('../models/Vacantes');