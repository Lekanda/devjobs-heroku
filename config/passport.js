const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
//*********Estrategia Local******************
passport.use(new LocalStrategy({
    usernameField :'email',// Campo de Autenticacion Uss
    passwordField: 'password'// Campo de Autenticacion Pass
    }, async(email, password, done) => {
        const usuario = await Usuarios.findOne({email});
        // NULL: Los errores; FALSE:Usuario, en este caso false por que no hay usuario; OPCIONES: Mensaje de error
        if (!usuario) return done(null, false, {
                message: 'Usuario no Existe'
            });
            // El usuario existe vamos a verificar el Password
        const verificarPass = usuario.compararPassword(password);
        if(!verificarPass) return done(null, false, {
                message: 'Password Incorrecto'
        });
        // Usuario Existe y el Password es correcto
        return done (null, usuario);
}));

// Serializar y Deserializar
passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await  Usuarios.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;