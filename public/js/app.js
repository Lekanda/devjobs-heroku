import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');
    // Limpiar las alertas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }
    if(skills){
        skills.addEventListener('click', agregarSkills);

        // Una vez que estamos en Editar, llamar la Funcion
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
})

const skills = new Set();
const agregarSkills = e => {
    // console.log(e.target);
    if (e.target.tagName === 'LI') {// Si lo que se hace click es un li
        // console.log('si');
        // console.log(e.target.textContent);
        if(e.target.classList.contains('activo')){
            // Quitarlo del set y quitar la Clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            // Agregando al Set y Agregando la clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    // console.log(skills);
    const skillsArray = [...skills];//crea una copia en un array de skills
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    // console.log(seleccionadas);

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })
    // Inyectarlo en el Hidden
    const skillsArray = [...skills];//crea una copia en un array de skills
    document.querySelector('#skills').value = skillsArray;
}

//Funcion para limpiar alertas
const limpiarAlertas = () =>{
    let alertas = document.querySelector('.alertas');
    const interval =setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length === 0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 1500);
}

// Eliminar Vacantes
const accionesListado = e => {
    // console.log(e);
    // console.log(e.target);
    e.preventDefault();
    
    if(e.target.dataset.eliminar) {
        // Eliminar por Axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "Una vez eliminada, no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText : 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                // Enviar la peticion con Axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                // Axios para Eliminar el Registro
                axios.delete(url, { params: {url} })
                    .then(function(respuesta) {
                        // console.log(respuesta);
                        if(respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            );

                            // ****** Eliminar del DOM******
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        }
                        
                    })
                    .catch(() => {
                        Swal.fire({
                            icon:'error', 
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar'
                        })
                    })
            }
        })
    }else if (e.target.tagName === 'A'){
        // console.log(e.target.tagName);
        window.location.href = e.target.href;
    }
}