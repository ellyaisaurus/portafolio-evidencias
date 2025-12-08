// js/ejercicio27.js

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// UI References
const $input = document.getElementById('search-input');
const $form = document.getElementById('search-form');
const $lightBlue = document.getElementById('light-blue');
const $loading = document.getElementById('loading-spinner');
const $display = document.getElementById('pokemon-display');

// Pokemon Info Elements
const $img = document.getElementById('pokemon-image');
const $name = document.getElementById('pokemon-name');
const $id = document.getElementById('pokemon-id');
const $types = document.getElementById('pokemon-types');
const $height = document.getElementById('pokemon-height');
const $weight = document.getElementById('pokemon-weight');
const $stats = document.getElementById('pokemon-stats');
const $abilitiesContainer = document.getElementById('pokemon-abilities');

// Description & Species
const $desc = document.getElementById('pokemon-description');
const $gen = document.getElementById('pokemon-generation');
const $habitat = document.getElementById('pokemon-habitat');

// Controls
const $btnCry = document.getElementById('btn-cry');
const $btnPrev = document.getElementById('btn-prev');
const $btnNext = document.getElementById('btn-next');
const $spritesContainer = document.getElementById('sprites-container');

// Ability Modal Elements
const abilityModalObj = new bootstrap.Modal(document.getElementById('abilityModal'));
const $abName = document.getElementById('ability-name');
const $abHidden = document.getElementById('ability-is-hidden');
const $abEffect = document.getElementById('ability-effect');
const $abShort = document.getElementById('ability-short');

// Toast
const toast = new bootstrap.Toast(document.getElementById('error-toast'));
const $toastMsg = document.getElementById('error-message');

let currentId = 1;
let currentCry = null;

// --- Main Logic ---

async function fetchPokemon(query) {
    // UI Loading State
    $lightBlue.classList.add('blinking'); // Asumimos clase definida o efecto JS
    $loading.classList.remove('d-none');
    $display.classList.add('d-none');
    $desc.innerText = "Buscando en la Pokédex...";
    
    try {
        const q = String(query).toLowerCase().trim();
        const res = await fetch(`${API_URL}${q}`);
        if(!res.ok) throw new Error("No registrado.");
        
        const data = await res.json();
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        currentId = data.id;
        renderView(data, speciesData);

    } catch (err) {
        $toastMsg.innerText = "Pokémon no encontrado.";
        toast.show();
        $desc.innerText = "Error de lectura.";
    } finally {
        $loading.classList.add('d-none');
        $display.classList.remove('d-none');
        // Simular parpadeo de luz azul terminado
    }
}

function renderView(data, species) {
    // 1. Basic Info
    const imgUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    $img.src = imgUrl || '';
    $name.innerText = data.name;
    $id.innerText = `No. ${String(data.id).padStart(3, '0')}`;
    
    // 2. Types
    $types.innerHTML = '';
    data.types.forEach(t => {
        const tag = document.createElement('span');
        tag.className = `badge-type badge-${t.type.name}`;
        tag.innerText = t.type.name;
        $types.appendChild(tag);
    });

    // 3. Physical
    $height.innerText = `${data.height / 10} m`;
    $weight.innerText = `${data.weight / 10} kg`;

    // 4. Stats
    renderStats(data.stats);

    // 5. Abilities (Buttons)
    $abilitiesContainer.innerHTML = '';
    data.abilities.forEach(a => {
        const btn = document.createElement('button');
        btn.className = `ability-pill ${a.is_hidden ? 'ability-hidden' : ''}`;
        btn.innerHTML = `${a.ability.name.replace('-', ' ')} ${a.is_hidden ? '<i class="bi bi-eye-slash-fill ms-1" style="font-size:0.7em"></i>' : ''}`;
        btn.onclick = () => showAbilityDetails(a.ability.url, a.ability.name, a.is_hidden);
        $abilitiesContainer.appendChild(btn);
    });

    // 6. Description
    const entry = species.flavor_text_entries.find(e => e.language.name === 'es') 
               || species.flavor_text_entries.find(e => e.language.name === 'en');
    $desc.innerText = entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : "Sin descripción.";

    // 7. Gen & Habitat
    $gen.innerText = `GEN: ${species.generation.name.split('-')[1].toUpperCase()}`;
    $habitat.innerText = `HÁBITAT: ${species.habitat ? species.habitat.name.toUpperCase() : '???'}`;

    // 8. Sprites & Sound
    renderSprites(data);
    currentCry = data.cries?.latest || data.cries?.legacy;
}

function renderStats(stats) {
    $stats.innerHTML = '';
    stats.forEach(s => {
        const name = s.stat.name.replace('-', ' ');
        // Mapeo simple de colores por nombre
        let color = 'bg-primary';
        if(s.stat.name === 'hp') color = 'stat-hp';
        if(s.stat.name === 'attack') color = 'stat-attack';
        if(s.stat.name === 'defense') color = 'stat-defense';
        if(s.stat.name === 'special-attack') color = 'stat-special-attack';
        if(s.stat.name === 'special-defense') color = 'stat-special-defense';
        if(s.stat.name === 'speed') color = 'stat-speed';

        const row = document.createElement('div');
        row.className = 'mb-1';
        row.innerHTML = `
            <div class="d-flex justify-content-between" style="font-size:0.75rem">
                <span class="fw-bold text-uppercase text-muted">${name}</span>
                <span class="fw-bold">${s.base_stat}</span>
            </div>
            <div class="progress">
                <div class="progress-bar ${color}" style="width: ${Math.min(s.base_stat, 150) / 1.5}%"></div>
            </div>
        `;
        $stats.appendChild(row);
    });
}

function renderSprites(data) {
    $spritesContainer.innerHTML = '';
    const arr = [
        { l: 'Normal', u: data.sprites.front_default },
        { l: 'Espalda', u: data.sprites.back_default },
        { l: 'Shiny', u: data.sprites.front_shiny },
        { l: 'Shiny Esp.', u: data.sprites.back_shiny }
    ];
    arr.forEach(item => {
        if(item.u) {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3';
            col.innerHTML = `
                <div class="sprite-box h-100 d-flex flex-column align-items-center justify-content-center">
                    <img src="${item.u}" class="img-fluid mb-1">
                    <small class="text-muted fw-bold">${item.l}</small>
                </div>
            `;
            $spritesContainer.appendChild(col);
        }
    });
}

// --- Ability Modal Logic ---
async function showAbilityDetails(url, name, isHidden) {
    $abName.innerText = name.replace('-', ' ');
    $abHidden.classList.toggle('d-none', !isHidden);
    $abEffect.innerText = "Consultando base de datos...";
    $abShort.innerText = "...";
    
    abilityModalObj.show();

    try {
        const res = await fetch(url);
        const data = await res.json();

        // Ingles para Effect (suele ser mas completo)
        const effect = data.effect_entries.find(e => e.language.name === 'en');
        // Español para flavor text
        const short = data.flavor_text_entries.find(e => e.language.name === 'es') 
                   || data.flavor_text_entries.find(e => e.language.name === 'en');

        $abEffect.innerText = effect ? effect.effect : "Sin detalles técnicos.";
        $abShort.innerText = short ? short.flavor_text : "Sin descripción.";

    } catch (e) {
        $abEffect.innerText = "Error al cargar información.";
    }
}

// Listeners
$form.addEventListener('submit', (e) => { e.preventDefault(); if($input.value) fetchPokemon($input.value); });
$btnPrev.addEventListener('click', () => { if(currentId > 1) fetchPokemon(currentId - 1); });
$btnNext.addEventListener('click', () => { fetchPokemon(currentId + 1); });
$btnCry.addEventListener('click', () => { if(currentCry) new Audio(currentCry).play(); });

// Init from URL
const params = new URLSearchParams(window.location.search);
fetchPokemon(params.get('id') || 1);