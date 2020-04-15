module.exports =  {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        // console.log(seleccionadas);
        // console.log(opciones.fn());
        
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress', 'C', 'C+', 'VStudio'];
        
        let html = '';
        skills.forEach(skill => {
            // Sí la skill esta en seleccionadas => entones clase activo , si no, =>  vacio(sin iliuminar)
            html += `
            <li ${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>
            `;
        });
        
        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        // console.log(opciones.fn());
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
        )
    },
    mostrarAlertas: (errores = {}, alertas ) => {
        // console.log(alertas.fn(this));
        // console.log('=======');
        // console.log(errores);

        const categoria = Object.keys(errores);
        // console.log(categoria);
        // console.log(errores[categoria]);
        let html = '';
        if (categoria.length) {
            errores[categoria].forEach(error => {
                html += `<div class="${categoria} alerta">
                      ${error}  
                </div>
                `;
            })
        }
        // console.log(html);
        return alertas.fn().html = html;
    }
}