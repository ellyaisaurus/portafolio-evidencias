// Configuración inicial
let offset = 0;
let limit = 20;

// Referencias DOM
const container = document.getElementById('pokemonContainer');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const limitInput = document.getElementById('limitInput');
const btnUpdateLimit = document.getElementById('btnUpdateLimit');
const loader = document.getElementById('loader');
const pageInfo = document.getElementById('pageInfo');
const offsetInfo = document.getElementById('offsetInfo');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    fetchPokemons();
});

// Eventos
btnPrev.addEventListener('click', () => {
    if (offset >= limit) {
        offset -= limit;
        fetchPokemons();
    }
});

btnNext.addEventListener('click', () => {
    offset += limit;
    fetchPokemons();
});

btnUpdateLimit.addEventListener('click', () => {
    const val = parseInt(limitInput.value);
    if (val > 0 && val <= 100) {
        limit = val;
        offset = 0;
        fetchPokemons();
    } else {
        alert("Por favor ingresa un número entre 1 y 100");
    }
});

// Lógica de Fetch
async function fetchPokemons() {
    toggleLoader(true);
    updateControls();

    try {
        // 1. Obtener lista paginada
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        if (!response.ok) throw new Error('Error en la red');
        const data = await response.json();

        // 2. Obtener detalles paralelos (Nombre, ID, Tipos, Imagen)
        const detailedPromises = data.results.map(async (poke) => {
            const res = await fetch(poke.url);
            return res.json();
        });

        const pokemons = await Promise.all(detailedPromises);

        // 3. Renderizar
        renderGrid(pokemons);

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <div class="alert alert-danger">Error al cargar los Pokémon. Intenta de nuevo.</div>
            </div>`;
    } finally {
        toggleLoader(false);
    }
}

function renderGrid(pokemons) {
    container.innerHTML = '';

    if (pokemons.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted">No hay resultados.</div>';
        return;
    }

    pokemons.forEach(poke => {
        // Generar HTML de tipos
        const typesHtml = poke.types.map(t => 
            `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
        ).join('');

        // Imagen: Preferencia a SVG o Official Artwork
        const imgSrc = poke.sprites.other.dream_world.front_default 
                      || poke.sprites.other['official-artwork'].front_default 
                      || poke.sprites.front_default;

        // Crear Columna
        const col = document.createElement('div');
        col.className = 'col';

        // AQUÍ ESTÁ EL ENLACE A EJERCICIO 27
        col.innerHTML = `
            <a href="ejercicio27.html?id=${poke.id}" class="pokemon-card-link" title="Ver detalles de ${poke.name}">
                <div class="card h-100 custom-card text-center p-3 border-0">
                    <div class="pokemon-id-chip">#${poke.id.toString().padStart(3, '0')}</div>
                    
                    <div class="card-img-bg"></div>
                    <img src="${imgSrc}" class="card-img-top mx-auto d-block" alt="${poke.name}" loading="lazy">
                    
                    <div class="card-body p-2 position-relative" style="z-index:2;">
                        <h5 class="card-title">${poke.name}</h5>
                        <div class="mt-2 d-flex justify-content-center flex-wrap gap-1">
                            ${typesHtml}
                        </div>
                    </div>
                </div>
            </a>
        `;

        container.appendChild(col);
    });
}

function toggleLoader(show) {
    if (show) {
        loader.classList.remove('d-none');
        container.classList.add('d-none');
    } else {
        loader.classList.add('d-none');
        container.classList.remove('d-none');
    }
}

function updateControls() {
    btnPrev.disabled = offset === 0;
    const currentPage = Math.floor(offset / limit) + 1;
    pageInfo.innerText = `Página ${currentPage}`;
    offsetInfo.innerText = `Mostrando ${offset + 1} - ${offset + limit}`;
}