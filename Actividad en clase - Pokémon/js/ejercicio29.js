document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias al DOM ---
    const pokemonContainer = document.getElementById('pokemon-container');
    const typeMenu = document.getElementById('type-menu');
    const titleElement = document.getElementById('current-type-title');
    const iconWrapper = document.getElementById('current-type-icon');
    const loader = document.getElementById('loader-overlay');
    const limitInput = document.getElementById('limit-input');
    const updateBtn = document.getElementById('btn-update');
    const searchInput = document.getElementById('sidebar-search');

    // Referencias Modales y Dock
    const detailModal = document.getElementById('detail-modal');
    const comparisonModal = document.getElementById('comparison-modal');
    const comparatorDock = document.getElementById('comparator-dock');
    const btnCompareAction = document.getElementById('btn-compare-action');
    const btnClearCompare = document.getElementById('btn-clear-compare');

    // --- Configuración y Estado ---
    const typeColors = {
        fire: '#fd7d24', water: '#4592c4', grass: '#9bcc50', electric: '#eed535',
        ice: '#51c4e7', fighting: '#d56723', poison: '#b97fc9', ground: '#ab9842',
        flying: '#3dc7ef', psychic: '#f366b9', bug: '#729f3f', rock: '#a38c21',
        ghost: '#7b62a3', dragon: '#f16e57', steel: '#9eb7b8', fairy: '#fdb9e9',
        normal: '#a4acaf', dark: '#707070'
    };

    const typeIcons = {
        fire: 'fa-fire', water: 'fa-droplet', grass: 'fa-leaf', electric: 'fa-bolt',
        ice: 'fa-snowflake', fighting: 'fa-hand-fist', poison: 'fa-skull-crossbones',
        ground: 'fa-mountain', flying: 'fa-wind', psychic: 'fa-eye', bug: 'fa-locust',
        rock: 'fa-cubes', ghost: 'fa-ghost', dragon: 'fa-dragon', steel: 'fa-shield-halved',
        fairy: 'fa-wand-magic-sparkles', normal: 'fa-circle', dark: 'fa-moon'
    };

    let currentState = {
        type: 'fire',
        limit: 20,
        pokemonList: [], // Lista actual descargada
        comparisonList: [] // Lista para comparar (Max 2)
    };

    // --- Funciones Principales ---

    const loadTypes = async () => {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/type');
            const data = await res.json();
            typeMenu.innerHTML = '';
            
            const validTypes = data.results.filter(t => t.name !== 'unknown' && t.name !== 'shadow');

            validTypes.forEach(type => {
                const btn = document.createElement('button');
                btn.className = 'type-btn';
                if(type.name === currentState.type) btn.classList.add('active');
                
                const iconClass = typeIcons[type.name] || 'fa-circle-dot';
                btn.innerHTML = `<div class="type-icon"><i class="fa-solid ${iconClass}"></i></div>${type.name}`;
                
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    searchInput.value = '';
                    currentState.type = type.name;
                    fetchData();
                });
                typeMenu.appendChild(btn);
            });
        } catch (error) { console.error('Error types:', error); }
    };

    const createCard = (pokemonDetails) => {
        const img = pokemonDetails.sprites.other.dream_world.front_default || 
                    pokemonDetails.sprites.other['official-artwork'].front_default || 
                    pokemonDetails.sprites.front_default || 'img/no-poke.png';

        const color = typeColors[currentState.type] || '#777';
        
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-xl-3 fade-in-card pokemon-item';
        col.setAttribute('data-name', pokemonDetails.name);

        // Verificar si ya está seleccionado para comparar
        const isSelected = currentState.comparisonList.some(p => p.id === pokemonDetails.id) ? 'selected' : '';
        const iconSelect = isSelected ? 'fa-check' : 'fa-plus';

        col.innerHTML = `
            <div class="poke-card" id="card-${pokemonDetails.id}">
                <div class="poke-card-actions">
                    <button class="btn-compare ${isSelected}" onclick="toggleCompare(${pokemonDetails.id}, this)">
                        <i class="fa-solid ${iconSelect}"></i>
                    </button>
                </div>
                <span class="poke-id">#${String(pokemonDetails.id).padStart(3, '0')}</span>
                
                <div class="poke-img-container" onclick="openDetailModal(${pokemonDetails.id})">
                    <img src="${img}" alt="${pokemonDetails.name}" class="poke-img" loading="lazy">
                </div>
                
                <div class="poke-info" onclick="openDetailModal(${pokemonDetails.id})">
                    <h3 class="poke-name">${pokemonDetails.name}</h3>
                    <span class="badge" style="background-color: ${color};">${currentState.type}</span>
                </div>
            </div>
        `;
        return col;
    };

    const fetchData = async () => {
        loader.classList.remove('hidden');
        pokemonContainer.innerHTML = '';
        
        titleElement.textContent = currentState.type;
        const typeColor = typeColors[currentState.type] || '#333';
        const typeIcon = typeIcons[currentState.type] || 'fa-circle';
        
        iconWrapper.style.backgroundColor = typeColor;
        iconWrapper.innerHTML = `<i class="fa-solid ${typeIcon}"></i>`;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${currentState.type}`);
            const data = await response.json();
            const allPokemon = data.pokemon;
            
            let limit = parseInt(limitInput.value);
            if (isNaN(limit) || limit <= 0) limit = 10;
            currentState.limit = limit;

            const slicedList = allPokemon.slice(0, currentState.limit);

            const detailPromises = slicedList.map(async (item) => {
                const r = await fetch(item.pokemon.url);
                return r.json();
            });

            currentState.pokemonList = await Promise.all(detailPromises);

            if (currentState.pokemonList.length === 0) {
                pokemonContainer.innerHTML = `<div class="col-12 text-center text-muted mt-5"><h4>No hay datos en esta región.</h4></div>`;
            } else {
                currentState.pokemonList.forEach(poke => {
                    pokemonContainer.appendChild(createCard(poke));
                });
            }

        } catch (error) {
            console.error(error);
            pokemonContainer.innerHTML = `<div class="text-danger text-center w-100 p-5">Error de conexión.</div>`;
        } finally {
            setTimeout(() => loader.classList.add('hidden'), 500);
        }
    };

    // --- Lógica del Comparador ---

    window.toggleCompare = (id, btn) => {
        // Evitar burbujeo al clic de la carta
        event.stopPropagation();
        
        const pokemon = currentState.pokemonList.find(p => p.id === id);
        if(!pokemon) return;

        const index = currentState.comparisonList.findIndex(p => p.id === id);

        if (index > -1) {
            // Remover
            currentState.comparisonList.splice(index, 1);
            btn.classList.remove('selected');
            btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        } else {
            // Agregar (Max 2)
            if (currentState.comparisonList.length >= 2) {
                alert("Solo puedes comparar 2 Pokémon a la vez.");
                return;
            }
            currentState.comparisonList.push(pokemon);
            btn.classList.add('selected');
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        updateDock();
    };

    const updateDock = () => {
        const slotsContainer = document.getElementById('dock-slots');
        slotsContainer.innerHTML = '';

        if (currentState.comparisonList.length > 0) {
            comparatorDock.classList.remove('hidden');
        } else {
            comparatorDock.classList.add('hidden');
        }

        // Render Slots
        for (let i = 0; i < 2; i++) {
            const poke = currentState.comparisonList[i];
            const div = document.createElement('div');
            div.className = `dock-slot ${poke ? 'filled' : ''}`;
            if(poke) {
                const img = poke.sprites.front_default;
                div.innerHTML = `<img src="${img}">`;
            } else {
                div.innerHTML = `<i class="fa-solid fa-question text-muted"></i>`;
            }
            slotsContainer.appendChild(div);
        }

        // Activar botón
        btnCompareAction.disabled = currentState.comparisonList.length !== 2;
    };

    btnCompareAction.addEventListener('click', () => {
        if(currentState.comparisonList.length === 2) {
            openComparisonModal();
        }
    });

    btnClearCompare.addEventListener('click', () => {
        currentState.comparisonList = [];
        document.querySelectorAll('.btn-compare').forEach(b => {
            b.classList.remove('selected');
            b.innerHTML = '<i class="fa-solid fa-plus"></i>';
        });
        updateDock();
    });

    // --- Lógica de Modales ---

    window.openDetailModal = (id) => {
        const pokemon = currentState.pokemonList.find(p => p.id === id);
        if(!pokemon) return;

        // Populate Modal
        document.getElementById('modal-img').src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        document.getElementById('modal-name').textContent = pokemon.name;
        
        // Color header
        const mainType = pokemon.types[0].type.name;
        document.getElementById('modal-header-bg').style.background = typeColors[mainType] || '#333';

        // Types
        const typesContainer = document.getElementById('modal-types');
        typesContainer.innerHTML = '';
        pokemon.types.forEach(t => {
            const span = document.createElement('span');
            span.className = 'modal-type-badge';
            span.style.backgroundColor = typeColors[t.type.name] || '#777';
            span.textContent = t.type.name;
            typesContainer.appendChild(span);
        });

        // Stats
        const statsList = document.getElementById('modal-stats-list');
        statsList.innerHTML = '';
        pokemon.stats.forEach(s => {
            const val = s.base_stat;
            const percent = Math.min((val / 200) * 100, 100);
            
            statsList.innerHTML += `
                <div class="stat-row">
                    <span class="stat-name">${getStatName(s.stat.name)}</span>
                    <div class="stat-bar-bg">
                        <div class="stat-bar-fill" style="width: 0%" data-width="${percent}%"></div>
                    </div>
                    <span class="stat-val">${val}</span>
                </div>
            `;
        });

        detailModal.classList.remove('hidden');
        setTimeout(() => {
            detailModal.classList.add('active');
            // Animate bars
            document.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 50);
    };

    const openComparisonModal = () => {
        const p1 = currentState.comparisonList[0];
        const p2 = currentState.comparisonList[1];

        const renderPokeCol = (containerId, p) => {
            const el = document.getElementById(containerId);
            const img = p.sprites.other.dream_world.front_default || p.sprites.front_default;
            el.innerHTML = `
                <img src="${img}" class="comp-img">
                <div class="comp-name" style="color: ${typeColors[p.types[0].type.name]}">${p.name}</div>
            `;
        };

        renderPokeCol('comp-p1', p1);
        renderPokeCol('comp-p2', p2);

        // Stats Comparison
        const statsContainer = document.getElementById('comp-stats');
        statsContainer.innerHTML = '';
        
        p1.stats.forEach((s, i) => {
            const val1 = s.base_stat;
            const val2 = p2.stats[i].base_stat;
            const statName = getStatName(s.stat.name);
            
            // Calculo relativo para la barra visual (quien gana)
            const total = val1 + val2;
            const w1 = (val1 / total) * 100;
            const w2 = (val2 / total) * 100;

            statsContainer.innerHTML += `
                <div class="comp-stat-row">
                    <span>${val1}</span>
                    <div class="comp-bar">
                        <div class="comp-bar-fill left" style="width: ${w1}%"></div>
                        <div class="comp-bar-fill right" style="width: ${w2}%"></div>
                    </div>
                    <span>${val2}</span>
                </div>
                <div style="text-align:center; font-size:0.7rem; color:#aaa; margin-bottom:5px;">${statName}</div>
            `;
        });

        comparisonModal.classList.remove('hidden');
        setTimeout(() => comparisonModal.classList.add('active'), 50);
    };

    // Helper para nombres cortos de stats
    const getStatName = (name) => {
        const map = {
            'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
            'special-attack': 'S.ATK', 'special-defense': 'S.DEF', 'speed': 'SPD'
        };
        return map[name] || name;
    };

    // Close Modals
    const closeModals = () => {
        detailModal.classList.remove('active');
        comparisonModal.classList.remove('active');
        setTimeout(() => {
            detailModal.classList.add('hidden');
            comparisonModal.classList.add('hidden');
        }, 300);
    };

    document.getElementById('close-detail-modal').addEventListener('click', closeModals);
    document.getElementById('close-comparison-modal').addEventListener('click', closeModals);
    
    // Close on backdrop click
    detailModal.addEventListener('click', (e) => {
        if(e.target === detailModal) closeModals();
    });
    comparisonModal.addEventListener('click', (e) => {
        if(e.target === comparisonModal) closeModals();
    });

    // --- Search Logic ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.pokemon-item').forEach(card => {
            const name = card.getAttribute('data-name');
            card.style.display = name.includes(term) ? 'block' : 'none';
        });
    });

    updateBtn.addEventListener('click', fetchData);
    limitInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchData(); });

    // Init
    (async function init() {
        await loadTypes();
        await fetchData();
    })();
});