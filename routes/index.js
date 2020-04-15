const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const usuariosController2 = require('../controllers/usuariosController2');
const authController = require('../controllers/authController');

router.use(express.json())


module.exports = () => {
    // *************Index*********************
    router.get('/', homeController.mostrarTrabajos);

    /**************************************************************/
    /**************************************************************/
    /**************************************************************/
    
    // **********Crear Vacantes******************
    router.get('/vacantes/nueva', 
            authController.verificarUsuario,
            vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', 
            authController.verificarUsuario,
            vacantesController.validarVacante,
            vacantesController.agregarVacante
    );
    
    // *************Mostrar Vacante(singular)**************
    router.get('/vacantes/:url', vacantesController.mostrarVacante);
    
    //***************Editar Vacante******************
    router.get('/vacantes/editar/:url', 
            authController.verificarUsuario,
            vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',
            authController.verificarUsuario,
            vacantesController.validarVacante,
            vacantesController.editarVacante
    );

    //*************Eliminar Vacante***********************/
    router.delete('/vacantes/eliminar/:id',
            vacantesController.eliminarVacante
    );
    /**************************************************************/
    /**************************************************************/
    /**************************************************************/


    //*********** Crear Cuentas***************
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);

    router.post('/crear-cuenta', usuariosController.validarRegistro, 
                                 usuariosController2.crearUsuario 
    );


    // **********Inicia-sesion y autenticar*****************
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    router.post('/iniciar-sesion', authController.autenticarUsuario);
    // Cerrar Sesion
    router.get('/cerrar-sesion', 
        authController.verificarUsuario,
        authController.cerrarSesion
    );
    /**************************************************************/
    /**************************************************************/
    /**************************************************************/

    //Resetear Password(emails)
    router.get('/reestablecer-password', authController.formReestablecerPassword);

    router.post('/reestablecer-password', authController.enviarToken);

    // Resetear Password ( Almacenar en al DB)
    router.get('/reestablecer-password/:token', authController.reestablecerPassword);
    router.post('/reestablecer-password/:token', authController.guardarPassword);



    // ********Panel de Administracion********
    router.get('/administracion', 
        authController.verificarUsuario,
        authController.mostrarPanel
    );


    //****************Editar Perfil******************
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );
    router.post('/editar-perfil',
        authController.verificarUsuario,
        // usuariosController.validarPerfil,
        usuariosController2.subirImagen,
        usuariosController2.editarPerfil 
    );

    /************Recibir mensajes de candidatos***************/
    router.post('/vacantes/:url', 
        vacantesController.subirCV,
        vacantesController.contactar
    );

    //**********Muestra los candidatos por Vacante***********/
    router.get('/candidatos/:id', 
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    );

    // Buscador de Vacantes
    router.post('/buscador', vacantesController.buscarVacantes);



    return router;
} 