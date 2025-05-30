const contenedorPrincipal = document.getElementById("contenedor-data")
const apiDragonBall = "https://dragonball-api.com/api/characters?limit=30";


// Pide los datos a la api del internet y la retorna en "data"
async function cargarDatosApi(url) {
    try {
        const response = await fetch(url); // busca la api

        if (!response.ok) {
            throw new Error("Error API");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}
// funcion para mostrar los personajes
function mostrarPersonajesDB(personajes) {
    personajes.forEach(function (personaje) {
        contenedorPrincipal.innerHTML += `
        <div class="col-3 pb-2 d-flex justify-content-center" data-id="${personaje.id}">
            <div class="card" style="width: 15rem;">
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

window.addEventListener("DOMContentLoaded", iniciarPagina);

async function iniciarPagina() {
    const data = await cargarDatosApi(apiDragonBall);
    if (data && data.items) {
        mostrarPersonajesDB(data.items);
    }
}

