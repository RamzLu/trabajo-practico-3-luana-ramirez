// Agarro el contenedor donde voy a meter los personajes
const contenedorPrincipal = document.getElementById("contenedor-data");

// Esta es la URL de la API con un límite de 30 personajes (para no traer de más)
const apiDragonBall = "https://dragonball-api.com/api/characters?limit=30";

// Agarro el formulario de búsqueda
const formularioBusqueda = document.getElementById("formulario");

// Acá voy a guardar todos los personajes que traigo, para poder usarlos en la búsqueda
let todosLosPersonajes = [];


// Esta función le pega a la API para traer los datos
async function cargarDatosApi(url) {
    try {
        const response = await fetch(url); // hace el fetch (trae) a la API

        if (!response.ok) {
            // Si hay error, lo tira al catch
            throw new Error("Error API");
        }

        const data = await response.json(); // convierte la respuesta en JSON
        return data;
    } catch (error) {
        // Si algo sale mal, me lo muestra en consola
        console.log(error);
    }
}


// Esta función dibuja en pantalla cada personaje que le pase
function mostrarPersonajesDB(personajes) {
     contenedorPrincipal.innerHTML = ""; // limpiar el contenedor antes de agregar nuevos personajes
    personajes.forEach(function (personaje) {
        // Agrego una card por cada personaje
        contenedorPrincipal.innerHTML += `
        <div class="contenedor col-4 pb-2 d-flex justify-content-center" data-id="${personaje.id}">
            <div class="card">
                <img class="card-img-top" src="${personaje.image}" />
                <div class="card-body">
                   <h5 class="card-title">${personaje.name}</h5>
                    <p class="card-text">${personaje.race} - ${personaje.gender}</p>
                    <button class="btn btn-success btn-ver-detalles">Ver más</button>
                </div>
            </div>
        </div>    
    `;
    });
}


// Esta función activa el botón "ver mas" para cada card
function activarEventoVerDetalles() {
    contenedorPrincipal.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-ver-detalles")) { // Si se hace clic en un botón que tiene la clase "btn-ver-detalles"
            // Busco el div que tiene el id del personaje
            const cardPadre = e.target.closest(".col-4");
            const id = cardPadre.dataset.id;
            // Llamo a la función para mostrar la descripción
            DetallesBoton(id);
        }
    });
}
// Llamo a la función para que esté activa desde el arranque
activarEventoVerDetalles();


// Esta función se encarga de mostrar la descripción del personaje en un alert
async function DetallesBoton(id) {
    try {
        const response = await fetch(`https://dragonball-api.com/api/characters/${id}`);

        if (!response.ok) {
            throw new Error("Error al encontrar la API");
        }

        const data = await response.json();

        // Llena el contenido del modal con los detalles
        const modalContenido = document.getElementById("modalContenido");
       modalContenido.innerHTML = `
            <div class="row">
                <div class="col-md-4 text-center">
                <img src="${data.image}" class="img-fluid rounded" alt="${data.name}" />
                </div>
                <div class="col-md-8">
                <h4>${data.name}</h4>
                <p><strong>Raza:</strong> ${data.race}</p>
                <p><strong>Género:</strong> ${data.gender}</p>
                <p><strong>Descripción:</strong> ${data.description || 'No disponible'}${'.'} </p>
                <p><strong>Ki:</strong> ${data.ki || 'No disponible'}${'.'} </p>
                <p><strong>Afiliación:</strong> ${data.affiliation || 'No disponible'}${'.'}  </p>
                <p><strong>Ki máximo:</strong> ${data.maxKi || 'No disponible'}${'.'} </p>
                </div>
            </div>
                    `;

        // mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById("modalDetalles"));
        modal.show();
    } catch (error) {
        console.log(error);
    }
}



// Cuando la página carga, llamo a esta función
window.addEventListener("DOMContentLoaded", iniciarPagina);

// Esta es la función principal al iniciar
async function iniciarPagina() {
    const data = await cargarDatosApi(apiDragonBall);

    if (data && data.items) {
        // Guardo todos los personajes para después poder buscarlos sin volver a pedirlos
        todosLosPersonajes = data.items;

        // Los muestro en pantalla
        mostrarPersonajesDB(todosLosPersonajes);
    }
}


// Esta parte escucha cuando mandas el formulario de busqueda
formularioBusqueda.addEventListener("submit", function (e) {
    e.preventDefault(); // Evito que recargue la página

    // Toma lo que se escribe en el input, le saco espacios y lo paso a minúsculas
    const valorBusqueda = formularioBusqueda.querySelector("input").value.trim().toLowerCase();

    // Filtro los personajes que coincidan con lo que buscaste (nombre, raza o género)
    const personajesFiltrados = todosLosPersonajes.filter((personaje) =>
        personaje.name.toLowerCase().includes(valorBusqueda) ||
        personaje.race.toLowerCase().includes(valorBusqueda) ||
        personaje.gender.toLowerCase().includes(valorBusqueda)
    );

    // Si encontró personajes, los muestra
    if (personajesFiltrados.length > 0) {
        mostrarPersonajesDB(personajesFiltrados);
    } else {
        // si no, muestra un mensaje
        contenedorPrincipal.innerHTML = `
            <div class="col-12 text-center">
                <p>¡Oh no! No se encontraron personajes..</p>
            </div>
        `;
    }
});
