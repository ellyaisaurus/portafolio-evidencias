document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES Y SELECTORES ---
    let cart = JSON.parse(localStorage.getItem('solsticeCart')) || [];
    const IVA = 0.16;

    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const badgeCount = document.getElementById('cart-badge');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const btnCheckout = document.getElementById('btn-checkout');
    const btnClear = document.getElementById('btn-clear');
    
    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // Modal Elements
    const checkoutModalEl = document.getElementById('checkoutModal');
    const checkoutModal = new bootstrap.Modal(checkoutModalEl);
    const paymentForm = document.getElementById('payment-form');
    const stepForm = document.getElementById('step-form');
    const stepLoading = document.getElementById('step-loading');
    const stepSuccess = document.getElementById('step-success');
    const modalTotalBtn = document.getElementById('modal-total-btn');

    // Inicializar Popovers de Bootstrap (Requisito: Usar Popovers)
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // --- FUNCIONES DE NOTIFICACIÓN (TOASTS) ---
    const showToast = (title, message, type = 'success') => {
        // Icono basado en el tipo
        let iconClass = 'fa-check-circle';
        if (type === 'danger') iconClass = 'fa-trash-can';
        if (type === 'info') iconClass = 'fa-circle-info';

        const toastEl = document.createElement('div');
        toastEl.className = 'toast toast-solstice align-items-center mb-2';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="toast-header">
                <i class="fa-solid ${iconClass} me-2 text-sunset"></i>
                <strong class="me-auto font-playfair">${title}</strong>
                <small class="text-muted text-white-50">Ahora</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
        bsToast.show();

        // Limpiar DOM después de ocultarse
        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    };

    // --- FUNCIONES CORE ---

    const updateCartUI = () => {
        localStorage.setItem('solsticeCart', JSON.stringify(cart));
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5 opacity-50">
                    <i class="fa-solid fa-suitcase-rolling fs-1 mb-3 text-liver"></i>
                    <p class="font-playfair text-liver">Tu maleta está vacía</p>
                </div>
            `;
            btnCheckout.disabled = true;
        } else {
            btnCheckout.disabled = false;
            
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;

                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <img src="${item.img}" class="cart-item-img" alt="${item.title}">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 font-playfair text-liver text-truncate" style="max-width: 140px;">${item.title}</h6>
                        <span class="text-burnt fw-bold small">$${item.price.toLocaleString()}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn-qty btn-minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
                        <span class="small fw-bold text-liver">${item.quantity}</span>
                        <button class="btn-qty btn-plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(row);
            });
        }

        const total = subtotal * (1 + IVA);
        summarySubtotal.textContent = `$${subtotal.toLocaleString()}`;
        summaryTotal.textContent = `$${total.toLocaleString()}`;
        modalTotalBtn.textContent = `$${total.toLocaleString()}`;

        badgeCount.textContent = totalItems;
        if(totalItems > 0) badgeCount.classList.remove('d-none');
        else badgeCount.classList.add('d-none');

        assignCartEvents();
    };

    const addToCart = (product) => {
        const existing = cart.find(p => p.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        
        // TOAST: Informativo al agregar
        showToast('Producto Agregado', `Has agregado <strong>${product.title}</strong> a tu maleta.`);
        
        // Opcional: Abrir el carrito
        // const offcanvasEl = document.getElementById('cartOffcanvas');
        // const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
        // bsOffcanvas.show();
    };

    const changeQty = (id, delta) => {
        const item = cart.find(p => p.id === id);
        if (item) {
            item.quantity += delta;
            
            if (item.quantity <= 0) {
                // Guardar nombre antes de borrar para el mensaje
                const title = item.title;
                cart = cart.filter(p => p.id !== id);
                // TOAST: Informativo al eliminar
                showToast('Producto Eliminado', `Has eliminado <strong>${title}</strong> de tu viaje.`, 'danger');
            }
            updateCartUI();
        }
    };

    const assignCartEvents = () => {
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(parseInt(btn.dataset.id), 1));
        });
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', () => changeQty(parseInt(btn.dataset.id), -1));
        });
    };

    // --- EVENT LISTENERS ---

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const data = e.target.closest('.btn-add-cart').dataset;
            addToCart({
                id: parseInt(data.id),
                title: data.title,
                price: parseFloat(data.price),
                img: data.img
            });
        });
    });

    btnClear.addEventListener('click', () => {
        if(cart.length > 0) {
            // Confirmación simple o personalizada, pero el requerimiento son toasts
            if(confirm('¿Deseas vaciar completamente tu maleta?')) {
                cart = [];
                updateCartUI();
                showToast('Maleta Vacía', 'Has vaciado tu maleta de viaje.', 'info');
            }
        }
    });

    btnCheckout.addEventListener('click', () => {
        stepForm.classList.remove('d-none');
        stepLoading.classList.add('d-none');
        stepSuccess.classList.add('d-none');
        
        const offcanvasEl = document.getElementById('cartOffcanvas');
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
        offcanvasInstance.hide();
        checkoutModal.show();
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        stepForm.classList.add('d-none');
        stepLoading.classList.remove('d-none');

        setTimeout(() => {
            stepLoading.classList.add('d-none');
            stepSuccess.classList.remove('d-none');
            cart = [];
            updateCartUI();
            paymentForm.reset();
        }, 2500);
    });

    // Init
    updateCartUI();
});