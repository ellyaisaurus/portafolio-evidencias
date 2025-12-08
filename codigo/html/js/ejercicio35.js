document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración Global ---
    const ITEMS_PER_PAGE = 8;
    const MAX_ITEMS = 30; // Límite de seguridad para LocalStorage
    let currentPage = 1;
    let currentSearchTerm = "";
    let sortOrder = "newest"; // 'newest' | 'oldest'

    // --- Referencias DOM ---
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const addUrlBtn = document.getElementById('addUrlBtn');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const compactSwitch = document.getElementById('compactViewSwitch');
    const galleryContainer = document.getElementById('galeria-imagenes');
    const paginationNav = document.getElementById('paginationNav');
    const emptyState = document.getElementById('emptyState');
    
    // Stats Refs
    const storageBar = document.getElementById('storageProgressBar');
    const storageText = document.getElementById('storagePercentText');
    const totalBadge = document.getElementById('totalItemsBadge');

    // Offcanvas Refs
    const offcanvasEl = document.getElementById('offcanvasDetails');
    const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
    const detailImage = document.getElementById('detailImage');
    const detailDate = document.getElementById('detailDate');
    const detailType = document.getElementById('detailType');
    const detailUrl = document.getElementById('detailUrl');
    const detailOpenLink = document.getElementById('detailOpenLink');
    const detailDeleteBtn = document.getElementById('detailDeleteBtn');
    
    // Toast
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastMessage');
    const toast = new bootstrap.Toast(toastEl);

    // Variable global para almacenar el ID del item seleccionado actualmente en el Offcanvas
    let currentDetailId = null;

    // --- Estado ---
    let galleryData = JSON.parse(localStorage.getItem('galleryData')) || [];

    // --- Funciones de Utilidad ---

    const showToast = (msg) => {
        toastBody.textContent = msg;
        toast.show();
    };

    const saveState = () => {
        try {
            localStorage.setItem('galleryData', JSON.stringify(galleryData));
            updateStats();
        } catch (e) {
            showToast("⚠️ Error: Almacenamiento lleno. Elimina imágenes.");
        }
    };

    const updateStats = () => {
        const count = galleryData.length;
        const percent = Math.min((count / MAX_ITEMS) * 100, 100);
        
        storageBar.style.width = `${percent}%`;
        storageText.textContent = `${Math.round(percent)}%`;
        totalBadge.textContent = `${count} / ${MAX_ITEMS} ítems`;

        if (percent >= 100) {
            storageBar.classList.add('bg-danger');
            storageBar.classList.remove('bg-info');
        } else {
            storageBar.classList.add('bg-info');
            storageBar.classList.remove('bg-danger');
        }
    };

    // --- Lógica de Renderizado ---

    const renderGallery = () => {
        galleryContainer.innerHTML = '';
        
        // 1. Filtrar
        let filtered = galleryData.filter(item => 
            (item.name || "Imagen").toLowerCase().includes(currentSearchTerm.toLowerCase())
        );

        // 2. Ordenar
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        if (filtered.length === 0) {
            galleryContainer.appendChild(emptyState);
            emptyState.style.display = 'block';
            paginationNav.innerHTML = '';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        // 3. Paginar
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages) currentPage = 1;

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const sliced = filtered.slice(start, start + ITEMS_PER_PAGE);

        // 4. Construir DOM
        sliced.forEach((item, index) => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3 fade-in';
            col.style.animationDelay = `${index * 0.05}s`;

            const isCompact = compactSwitch.checked;
            
            col.innerHTML = `
                <div class="card gallery-card shadow-sm h-100 ${isCompact ? 'compact-view' : ''}" onclick="openDetails(${item.id})">
                    <div class="card-img-container">
                        <img src="${item.url}" alt="Img" loading="lazy">
                        <div class="card-overlay">
                            <i class="fas fa-eye text-white fa-2x"></i>
                        </div>
                    </div>
                    <div class="card-body p-2 d-flex justify-content-between align-items-center">
                        <small class="text-muted text-truncate w-75">${new Date(item.date).toLocaleDateString()}</small>
                        <span class="badge bg-${item.type === 'local' ? 'warning' : 'info'} text-dark" style="font-size: 0.6rem;">${item.type === 'local' ? 'FILE' : 'URL'}</span>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(col);
        });

        renderPagination(totalPages);
    };

    const renderPagination = (totalPages) => {
        paginationNav.innerHTML = '';
        if (totalPages <= 1) return;

        // Loop simple
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<button class="page-link">${i}</button>`;
            li.onclick = () => {
                currentPage = i;
                renderGallery();
            };
            paginationNav.appendChild(li);
        }
    };

    // --- Lógica de Agregar Items ---

    const addItem = (url, type = 'url') => {
        if (galleryData.length >= MAX_ITEMS) {
            showToast("⛔ Límite de almacenamiento alcanzado.");
            return;
        }

        const newItem = {
            id: Date.now(),
            url: url,
            date: new Date().toISOString(),
            type: type, // 'url' o 'local'
            name: type === 'url' ? 'Imagen Externa' : 'Archivo Local'
        };

        galleryData.unshift(newItem); // Agregar al inicio
        saveState();
        renderGallery();
        showToast("Imagen añadida a la colección.");
    };

    // Manejo de URL Input
    addUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            addItem(url, 'url');
            urlInput.value = '';
        }
    });

    // Manejo de Archivos (FileReader)
    const handleFiles = (files) => {
        if (!files.length) return;
        const file = files[0]; // Solo 1 a la vez para este ejemplo

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showToast("⚠️ El archivo es muy pesado (>2MB).");
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast("⚠️ Solo se permiten imágenes.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            addItem(e.target.result, 'local');
        };
        reader.readAsDataURL(file);
    };

    // --- Event Listeners Drag & Drop ---
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Input file tradicional
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // --- Event Listeners Controles ---

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        currentPage = 1;
        renderGallery();
    });

    sortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        renderGallery();
    });

    compactSwitch.addEventListener('change', renderGallery);

    // --- Lógica Offcanvas (Detalles) ---

    // Función global expuesta para el onclick en el HTML generado
    window.openDetails = (id) => {
        const item = galleryData.find(i => i.id === id);
        if (!item) return;

        currentDetailId = id;
        detailImage.src = item.url;
        detailDate.textContent = new Date(item.date).toLocaleString();
        detailType.textContent = item.type === 'local' ? 'Archivo Local (Base64)' : 'Enlace Externo';
        detailUrl.textContent = item.url.substring(0, 50) + '...';
        detailOpenLink.href = item.url;

        offcanvas.show();
    };

    // Botón eliminar dentro del Offcanvas
    detailDeleteBtn.addEventListener('click', () => {
        if (currentDetailId) {
            galleryData = galleryData.filter(i => i.id !== currentDetailId);
            saveState();
            renderGallery();
            offcanvas.hide();
            showToast("🗑️ Imagen eliminada.");
        }
    });

    // --- Init ---
    updateStats();
    renderGallery();
});