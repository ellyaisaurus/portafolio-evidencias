document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias UI Globales ---
    const productsContainer = document.getElementById('products-container');
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');
    const bsToast = new bootstrap.Toast(toastEl);

    // Función Helper para Toast
    const showToast = (msg) => {
        if(toastBody) {
            toastBody.textContent = msg;
            bsToast.show();
        }
    };

    // ==========================================
    // PARTE 1: LÓGICA DE INTERACCIÓN DE TARJETAS
    // (Esta función se aplica a cards viejas y nuevas)
    // ==========================================
    const attachCardLogic = (card) => {
        const selectBtn = card.querySelector('.btn-select');
        const deselectBtn = card.querySelector('.btn-deselect');
        const statusBadge = card.querySelector('.status-badge');
        const descriptionText = card.querySelector('.description-text');

        // Lógica Seleccionar
        if(selectBtn) {
            // Removemos listeners previos para evitar duplicados si se llamara de nuevo
            const newSelectBtn = selectBtn.cloneNode(true);
            selectBtn.parentNode.replaceChild(newSelectBtn, selectBtn);

            newSelectBtn.addEventListener('click', () => {
                card.classList.add('border', 'border-success', 'shadow');
                if(statusBadge) {
                    statusBadge.textContent = '¡Seleccionado!';
                    statusBadge.classList.remove('text-muted');
                    statusBadge.classList.add('text-success');
                }
                if(descriptionText) descriptionText.classList.remove('d-none');
                showToast("Producto seleccionado para compra");
            });
        }

        // Lógica Retirar
        if(deselectBtn) {
            const newDeselectBtn = deselectBtn.cloneNode(true);
            deselectBtn.parentNode.replaceChild(newDeselectBtn, deselectBtn);

            newDeselectBtn.addEventListener('click', () => {
                card.classList.remove('border-success', 'shadow');
                // Opcional: ocultar descripción como en el ejercicio original
                // if(descriptionText) descriptionText.classList.add('d-none');
                
                if(statusBadge) {
                    statusBadge.textContent = 'Disponible';
                    statusBadge.classList.remove('text-success');
                    statusBadge.classList.add('text-muted');
                }
            });
        }
    };

    // Inicializar lógica en tarjetas estáticas existentes
    document.querySelectorAll('.product-card').forEach(card => attachCardLogic(card));


    // ==========================================
    // PARTE 2: CREATOR STUDIO (Subir Imagen + Crear Card)
    // ==========================================
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const triggerFileBtn = document.getElementById('triggerFileBtn');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const btnPublish = document.getElementById('btn-publish');
    
    let currentImageBase64 = null;

    // A. Manejo de Archivos (Drag & Drop y Click)
    if(triggerFileBtn) triggerFileBtn.addEventListener('click', () => fileInput.click());

    if(dropZone) {
        // Drag Events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        
        dropZone.addEventListener('drop', (e) => {
            dropZone.classList.remove('dragover');
            handleFile(e.dataTransfer.files[0]);
        });
    }

    if(fileInput) {
        fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    }

    // Procesar archivo a Base64
    const handleFile = (file) => {
        if(!file) return;
        if(!file.type.startsWith('image/')) {
            showToast("⚠️ Error: Solo se permiten imágenes.");
            return;
        }
        if(file.size > 2 * 1024 * 1024) { // 2MB
            showToast("⚠️ Error: Imagen demasiado pesada (>2MB).");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImageBase64 = e.target.result;
            // Mostrar Preview
            imagePreview.src = currentImageBase64;
            imagePreviewContainer.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    };

    // Botón borrar imagen preview
    if(removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            currentImageBase64 = null;
            imagePreview.src = '';
            fileInput.value = ''; // Reset input
            imagePreviewContainer.classList.add('d-none');
        });
    }

    // B. Publicar Producto (Crear Card Dinámica)
    if(btnPublish) {
        btnPublish.addEventListener('click', () => {
            // 1. Obtener valores
            const title = document.getElementById('productTitle').value.trim();
            const price = document.getElementById('productPrice').value.trim();
            const badge = document.getElementById('productBadge').value;
            const desc = document.getElementById('productDesc').value.trim();

            // 2. Validar
            if(!title || !price || !currentImageBase64) {
                showToast("⚠️ Faltan datos (Imagen, Título o Precio).");
                return;
            }

            // 3. Crear Estructura HTML (String Template)
            const newCol = document.createElement('div');
            newCol.className = 'col-md-6 col-lg-4 col-xl-3 fade-in'; // Bootstrap grid + animación
            
            // Usamos Date.now() para un ID único simulado
            const uniqueId = Date.now();

            newCol.innerHTML = `
                <div class="card h-100 product-card p-3" id="product-${uniqueId}">
                    <div class="img-wrapper">
                        <img src="${currentImageBase64}" class="card-img-top" alt="${title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-white">${title}</h5>
                        <p class="card-text text-muted description-text">${desc || 'Sin descripción detallada.'}</p>
                        <p class="price-tag">$${parseFloat(price).toFixed(2)}</p>
                        <div class="status-badge mb-2 text-muted">${badge}</div>
                    </div>
                    <div class="card-footer bg-transparent border-0 d-flex justify-content-between gap-2">
                        <button class="btn btn-primary-custom w-100 btn-select">Seleccionar</button>
                        <button class="btn btn-outline-danger w-100 btn-deselect">Retirar</button>
                    </div>
                </div>
            `;

            // 4. Inyectar al inicio del Grid
            productsContainer.prepend(newCol);

            // 5. IMPORTANTE: Asignar lógica JS a la nueva card
            const newCard = newCol.querySelector('.product-card');
            attachCardLogic(newCard);

            // 6. Limpiar formulario
            document.getElementById('productTitle').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productDesc').value = '';
            removeImageBtn.click(); // Resetea la imagen

            showToast("✅ ¡Producto publicado exitosamente!");
        });
    }


    // ==========================================
    // PARTE 3: GESTIÓN DE TAREAS / ADMIN PANEL
    // (Requisitos Específicos: lista, remove(), append)
    // ==========================================

    // Referencias DOM con IDs específicos
    const btnEliminarPrimero = document.getElementById('btn-eliminar-primero'); // 3. ID al botón
    const btnAgregarTarea = document.getElementById('btn-agregar-tarea');
    const inputNuevaTarea = document.getElementById('input-nueva-tarea');
    const listaTareas = document.getElementById('lista-tareas'); // Lista UL

    // 4. addEventListener al botón de eliminar
    if(btnEliminarPrimero && listaTareas) {
        btnEliminarPrimero.addEventListener('click', () => {
            // Verificar si hay hijos
            if (listaTareas.children.length > 0) {
                const elementoAEliminar = listaTareas.firstElementChild;
                
                // Efecto visual antes de eliminar
                elementoAEliminar.style.transition = 'all 0.3s';
                elementoAEliminar.style.opacity = '0';
                elementoAEliminar.style.transform = 'translateX(50px)';
                
                setTimeout(() => {
                    // 5. Utiliza remove() para eliminar el primer elemento
                    elementoAEliminar.remove();
                    showToast("Tarea eliminada de la lista.");
                }, 300);
            } else {
                showToast("⚠️ No hay tareas para eliminar.");
            }
        });
    }

    // 6. Añadir nueva tarea a la lista
    if(btnAgregarTarea && inputNuevaTarea) {
        const agregarTarea = () => {
            const texto = inputNuevaTarea.value.trim();
            if(!texto) {
                showToast("Escribe una tarea válida.");
                return;
            }

            // Crear LI
            const li = document.createElement('li');
            li.id = `tarea-${Date.now()}`; // 3. ID único al elemento
            li.className = 'task-item glass-item d-flex align-items-center justify-content-between p-3 mb-2 rounded-3 border border-secondary border-opacity-25 fade-in';
            
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-plus-circle text-primary-accent me-3"></i>
                    <span class="text-light">${texto}</span>
                </div>
                <span class="badge bg-primary-accent">Nueva</span>
            `;

            // Incluir en la lista
            listaTareas.appendChild(li);
            inputNuevaTarea.value = '';
            showToast("Tarea añadida al panel administrativo.");
        };

        btnAgregarTarea.addEventListener('click', agregarTarea);
        
        // Enter key support
        inputNuevaTarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') agregarTarea();
        });
    }

});