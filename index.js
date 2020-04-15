const mongoose= require('mongoose');
require('./config/db');


const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const createError = require('http-errors');
const passport = require('./config/passport');

// class TestClass {
//     aMethod() {
//       return "returnValue";
//     }
//   }
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)
 
// const template = insecureHandlebars.compile('{{aMethod}}')
// const output = template(new TestClass);
 
// console.log(output)


require('dotenv').config({ path : 'variables.env'});

const app = express();
app.use(express.json());
// Validación de campos con Express-validator
// app.use(expressValidator());

// Agregar Body-Parser al proyecto
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Habilitar handlebars como View
app.engine('handlebars',
    exphbs({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
app.set('view engine', 'handlebars');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Cookie-Paresr
app.use(cookieParser());

// Sesiones
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection : mongoose.connection})
}));

//Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());


// Flash para mensajes de alerta
app.use(flash());

//Crear nuestro Middleware
app.use((req,res,next) => {
    res .locals.mensajes = req.flash();
    next();
});

// Rutas
app.use('/', router());




// 404 Pagina no existente
app.use((req,res,next) => {
    next(createError(404, 'No Encontrado'));
})
// Administracion de los Errores
app.use((error,req,res)=> {
    // console.log(error.message);
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    // console.log(error.status);
    res.render('error');
})


// Dejar que Heroku asigne el puerto
const host = '0.0.0.0';
const port = process.env.PORT;



// Puerto de escucha
app.listen(port, host, () => {
    console.log('El servidor esta funcionando....');
    
});