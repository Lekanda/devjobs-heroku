const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,// No es un validador
        lowercase: true,// Todo Minusculas
        trim: true // Para quitar espacios al principio y final
    },
    nombre:{
        type: String,
        required: true,
    },
    apellidos:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

// Metodo para Hashear los Passwords
usuariosSchema.pre('save', async function(next){
    // Sí el password ya esta Hasheado
    if (!this.isModified('password')) {
        return next();// Detiene la Ejecucion
    }
    // Sí no esta Hasheado, Hashearlo
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

// Envia alerta cuando un usuario ya esta registrado
usuariosSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000){
        next('Ese Correo  ya esta Registrado');
    }else{
        next(error);
    }
});

// Autenticar el Usuario al Iniciar Sesion
usuariosSchema.methods = {
    compararPassword: function (password) {
        // retorna true o false si es ok o no
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);