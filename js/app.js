// SELECTORES
// IMPORTANTE - ESTA API REQUIERE QUE LE MANDES EL VALOR EN EL CODIGO DE DOS DIGITO
//   <option value="PE">Perú</option>
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


// load - window es similar a DOMContentLoaded - document
window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});


function buscarClima(e) {
    e.preventDefault();

    // Validar 
    const ciudad = document.querySelector('#ciudad').value; // obteer el valor de lo que el usuario ha escrito
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    // En caso de pasar la validacion - consultamos la API

    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    // si este selector retorna vacio, entonces podemos agregar una alerta
    // ESTA VALIDACION ES PARA NO TENER MULTIPLES ALERTAS
    if (!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `<strong class="font-bold">Error</strong>
                            <span class="block">${mensaje}</span>`;

        container.appendChild(alerta);


        // Elimina la alerta después de cinco segundos
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }

}


function consultarAPI(ciudad, pais) {
    const appId = '9d2ac97a83ba88e21bcf26096493bc85';
    // Tienes que enviar los datos de forma estructurada como la API lo espera
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    // Llamamos spinner de carga de informacion
    Spinner();


    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
            limpiarHTML(); // Limpiar el HTML previo
            if (datos.cod === "404") { // viene de la API
                mostrarError('City not found, try again');
                return;
            }

            // Imprime la respuesta en el HTML
            mostrarClima(datos);
        });
}

// los grados vienen en kelvin, por lo que tenemos que hacer una operacion para convertirla
function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos; // destruction de un objeto que esta dentro de otro
    const centigrados = kelvinAcentrigrados(temp);
    const max = kelvinAcentrigrados(temp_max);
    const min = kelvinAcentrigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Weather in ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`; // es una entidad como si fueran grados centigrados &#8451;
    // toFixed(2) - centigrados.toFixed(0)  convierte un numero en una cadena conservando solo dos decimales
    actual.classList.add('font-bold', 'text-6xl');

    // Maxima
    const temperaturaMaxima = document.createElement('p');
    temperaturaMaxima.innerHTML = `Max: ${max} &#8451;`;
    temperaturaMaxima.classList.add('text-xl');

    // Minima
    const temperaturaMinima = document.createElement('p');
    temperaturaMinima.innerHTML = `Min: ${min} &#8451;`;
    temperaturaMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(temperaturaMaxima);
    resultadoDiv.appendChild(temperaturaMinima);

    resultado.appendChild(resultadoDiv);
}

// return se da por implicito en arrow function
const kelvinAcentrigrados = grados => parseInt(grados - 273.15);


// convertir esta temperatura que viene en grados kelvia a grados centigrados -273.15

// Limpiamos HTML, si se van poniendo en fila los nuevos climas consultados

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}


function Spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}