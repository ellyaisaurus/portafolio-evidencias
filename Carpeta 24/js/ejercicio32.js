document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias al DOM ---
    const pokemonContainer = document.getElementById('pokemon-container'); // Grid View
    const listViewWrapper = document.getElementById('list-view-wrapper'); // List View Wrapper
    const pokemonListElement = document.getElementById('pokemon-list'); // UL Element
    
    const typeMenu = document.getElementById('type-menu');
    const titleElement = document.getElementById('current-type-title');
    const iconWrapper = document.getElementById('current-type-icon');
    // Loader eliminado por solicitud
    const limitInput = document.getElementById('limit-input');
    const updateBtn = document.getElementById('btn-update');
    const searchInput = document.getElementById('sidebar-search');

    // Botones de Vista
    const btnViewGrid = document.getElementById('btn-view-grid');
    const btnViewList = document.getElementById('btn-view-list');

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
        pokemonList: [], 
        comparisonList: [] 
    };

    // --- Control de Vistas (Grid vs List) ---
    const toggleView = (view) => {
        if (view === 'grid') {
            pokemonContainer.classList.remove('hidden');
            listViewWrapper.classList.add('hidden');
            btnViewGrid.classList.add('active');
            btnViewList.classList.remove('active');
        } else {
            pokemonContainer.classList.add('hidden');
            listViewWrapper.classList.remove('hidden');
            btnViewGrid.classList.remove('active');
            btnViewList.classList.add('active');
        }
    };

    btnViewGrid.addEventListener('click', () => toggleView('grid'));
    btnViewList.addEventListener('click', () => toggleView('list'));

    // --- Funciones Principales ---

    const loadTypes = async () => {
        try {
            const res = await fetch('https://pokeapi.co/api/v2/type');
            if(!res.ok) throw new Error('Network error');
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
                    currentState.type = type.name;
                    fetchData();
                });
                typeMenu.appendChild(btn);
            });
        } catch (error) { 
            console.error('Error types:', error);
            typeMenu.innerHTML = `<div class="p-3 text-center text-muted" style="font-size:0.8rem"><i class="fa-solid fa-triangle-exclamation me-1"></i> Error al cargar menú</div>`;
        }
    };

    const createCard = (pokemonDetails) => {
        const img = pokemonDetails.sprites.other.dream_world.front_default || 
                    pokemonDetails.sprites.other['official-artwork'].front_default || 
                    pokemonDetails.sprites.front_default || 'img/no-poke.png';

        const color = typeColors[currentState.type] || '#777';
        
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-xl-3 fade-in-card pokemon-item';
        col.setAttribute('data-name', pokemonDetails.name);

        const isSelected = currentState.comparisonList.some(p => p.id === pokemonDetails.id) ? 'selected' : '';
        const iconSelect = isSelected ? 'fa-check' : 'fa-plus';

        col.innerHTML = `
            <div class="poke-card" id="card-${pokemonDetails.id}" style="border-top: 4px solid ${color}">
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
                    <span class="badge text-white" style="background-color: ${color};">${currentState.type}</span>
                </div>
            </div>
        `;
        return col;
    };

    // --- Componente de Error Personalizado ---
    const renderConnectionError = () => {
        const container = document.createElement('div');
        container.className = 'col-12 connection-error-container fade-in-section';
        container.innerHTML = `
            <div class="error-content">
                <div class="error-img-wrapper">
                    <img src="img/pikachu.gif" alt="Pikachu Triste" class="error-gif">
                    <div class="error-pulse"></div>
                </div>
                <h2 class="error-heading">¡Sin Conexión a Internet!</h2>
                <p class="error-desc">
                    No pudimos establecer comunicación con el servidor Pokémon.<br>
                    Por favor, verifica tu red y vuelve a intentarlo.
                </p>
                <button id="btn-retry-network" class="btn-retry">
                    <i class="fa-solid fa-wifi me-2"></i> REINTENTAR CONEXIÓN
                </button>
            </div>
        `;

        const retryBtn = container.querySelector('#btn-retry-network');
        retryBtn.addEventListener('click', fetchData);

        return container;
    };

    const fetchData = async () => {
        // Limpieza de contenedores
        pokemonContainer.innerHTML = '';
        if(pokemonListElement) pokemonListElement.innerHTML = ''; 

        titleElement.textContent = currentState.type;
        const typeColor = typeColors[currentState.type] || '#333';
        const typeIcon = typeIcons[currentState.type] || 'fa-circle';
        
        iconWrapper.style.backgroundColor = typeColor;
        iconWrapper.innerHTML = `<i class="fa-solid ${typeIcon}"></i>`;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/type/${currentState.type}`);
            if (!response.ok) throw new Error('Network Error');
            
            const data = await response.json();
            const allPokemon = data.pokemon;
            
            let limit = parseInt(limitInput.value);
            if (isNaN(limit) || limit <= 0) limit = 10;
            currentState.limit = limit;

            const slicedList = allPokemon.slice(0, currentState.limit);

            const detailPromises = slicedList.map(async (item) => {
                const r = await fetch(item.pokemon.url);
                if(!r.ok) throw new Error('Details Error');
                return r.json();
            });

            currentState.pokemonList = await Promise.all(detailPromises);

            if (currentState.pokemonList.length === 0) {
                const msg = `<div class="col-12 text-center text-muted mt-5"><h4>No hay datos disponibles.</h4></div>`;
                pokemonContainer.innerHTML = msg;
                pokemonListElement.innerHTML = `<li class="list-group-item text-center">No hay datos</li>`;
            } else {
                
                // --- Llenado de Cards (Grid) ---
                currentState.pokemonList.forEach(poke => {
                    pokemonContainer.appendChild(createCard(poke));
                });

                // --- Llenado de Lista (List View) ---
                if (pokemonListElement) {
                    currentState.pokemonList.forEach(poke => {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.innerHTML = `
                            <div class="d-flex align-items-center w-100">
                                <span class="list-poke-id">#${String(poke.id).padStart(3, '0')}</span>
                                <span class="list-poke-name flex-grow-1">${poke.name}</span>
                                <button class="btn btn-sm btn-light rounded-circle" onclick="openDetailModal(${poke.id})">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        `;
                        li.addEventListener('click', (e) => {
                            if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') {
                                openDetailModal(poke.id);
                            }
                        });
                        pokemonListElement.appendChild(li);
                    });
                }
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            
            // Inyectar pantalla de error estilizada
            pokemonContainer.appendChild(renderConnectionError());

            // Si está en modo lista, mostrar error también ahí
            if(pokemonListElement) {
                pokemonListElement.innerHTML = '';
                const liError = document.createElement('li');
                liError.className = 'list-group-item text-center p-5 text-danger';
                liError.innerHTML = `<i class="fa-solid fa-wifi me-2"></i> Sin conexión a internet.`;
                pokemonListElement.appendChild(liError);
            }
        }
    };

    // --- Lógica del Comparador ---

    window.toggleCompare = (id, btn) => {
        event.stopPropagation();
        
        const pokemon = currentState.pokemonList.find(p => p.id === id);
        if(!pokemon) return;

        const index = currentState.comparisonList.findIndex(p => p.id === id);

        if (index > -1) {
            currentState.comparisonList.splice(index, 1);
            btn.classList.remove('selected');
            btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        } else {
            if (currentState.comparisonList.length >= 2) {
                alert("Límite de comparación alcanzado (Max 2).");
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

        for (let i = 0; i < 2; i++) {
            const poke = currentState.comparisonList[i];
            const div = document.createElement('div');
            div.className = `dock-slot ${poke ? 'filled' : ''}`;
            if(poke) {
                const img = poke.sprites.front_default;
                div.innerHTML = `<img src="${img}">`;
            } else {
                div.innerHTML = `<i class="fa-solid fa-question text-muted" style="font-size:0.8rem"></i>`;
            }
            slotsContainer.appendChild(div);
        }

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

        document.getElementById('modal-img').src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        document.getElementById('modal-name').textContent = pokemon.name;
        
        const mainType = pokemon.types[0].type.name;
        document.getElementById('modal-header-bg').style.background = typeColors[mainType] || '#333';

        const typesContainer = document.getElementById('modal-types');
        typesContainer.innerHTML = '';
        pokemon.types.forEach(t => {
            const span = document.createElement('span');
            span.className = 'modal-type-badge';
            span.style.backgroundColor = typeColors[t.type.name] || '#777';
            span.textContent = t.type.name;
            typesContainer.appendChild(span);
        });

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

        const statsContainer = document.getElementById('comp-stats');
        statsContainer.innerHTML = '';
        
        p1.stats.forEach((s, i) => {
            const val1 = s.base_stat;
            const val2 = p2.stats[i].base_stat;
            const statName = getStatName(s.stat.name);
            
            const total = val1 + val2;
            const w1 = total === 0 ? 0 : (val1 / total) * 100;
            const w2 = total === 0 ? 0 : (val2 / total) * 100;

            statsContainer.innerHTML += `
                <div class="comp-stat-row">
                    <span style="color:${val1 > val2 ? 'var(--accent-blue)' : '#aaa'}">${val1}</span>
                    <div class="comp-bar">
                        <div class="comp-bar-fill left" style="width: ${w1}%"></div>
                        <div class="comp-bar-fill right" style="width: ${w2}%"></div>
                    </div>
                    <span style="color:${val2 > val1 ? 'var(--accent-red)' : '#aaa'}">${val2}</span>
                </div>
                <div style="text-align:center; font-size:0.65rem; color:#aaa; margin-bottom:8px; font-weight:700;">${statName}</div>
            `;
        });

        comparisonModal.classList.remove('hidden');
        setTimeout(() => comparisonModal.classList.add('active'), 50);
    };

    const getStatName = (name) => {
        const map = {
            'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
            'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', 'speed': 'SPD'
        };
        return map[name] || name;
    };

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
    
    detailModal.addEventListener('click', (e) => {
        if(e.target === detailModal) closeModals();
    });
    comparisonModal.addEventListener('click', (e) => {
        if(e.target === comparisonModal) closeModals();
    });

    // --- Search Logic (Actualizada para filtrar ambas listas) ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        // Filtrar Grid
        document.querySelectorAll('.pokemon-item').forEach(card => {
            const name = card.getAttribute('data-name');
            card.style.display = name.includes(term) ? 'block' : 'none';
        });

        // Filtrar Lista LI (si existe)
        if(pokemonListElement) {
            Array.from(pokemonListElement.children).forEach(li => {
                const text = li.textContent.toLowerCase();
                li.style.display = text.includes(term) ? 'flex' : 'none';
            });
        }
    });

    updateBtn.addEventListener('click', fetchData);
    limitInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchData(); });

    // Init
    (async function init() {
        await loadTypes();
        await fetchData();
    })();
});