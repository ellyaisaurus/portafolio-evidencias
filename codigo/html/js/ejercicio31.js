document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES Y ESTADO ---
    // Simulamos persistencia de sesión y carrito
    let currentUser = JSON.parse(localStorage.getItem('auraUser')) || null;
    let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
    
    // Configuración
    const TAX_RATE = 0.16;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0
        }).format(amount);
    };

    // --- ELEMENTOS DOM ---
    // Navbar Elements
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navUserArea = document.getElementById('nav-user-area');
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    
    // Cart Elements
    const cartContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    const emptyState = document.getElementById('empty-state');
    const checkoutBtn = document.getElementById('btn-checkout');
    
    // Modals
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasCart'));
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    
    // Containers
    const toastContainer = document.getElementById('toast-container');
    const subsListContainer = document.getElementById('subscriptions-list');

    // --- INICIALIZACIÓN DE LIBRERÍAS ---
    
    // 1. Popovers Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(el => new bootstrap.Popover(el));

    // 2. Flatpickr (Selector de Fechas de Lujo)
    // Inicializamos todos los inputs con la clase .date-picker-input
    flatpickr(".date-picker-input", {
        minDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y", // Ej: December 3, 2025
        theme: "light", // Ajustado por CSS
        disable: [
            function(date) {
                // Deshabilitar martes (ejemplo de lógica de negocio)
                return (date.getDay() === 2);
            }
        ],
        locale: {
            firstDayOfWeek: 1
        }
    });

    // --- AUTH SYSTEM (SIMULADO) ---

    const updateAuthUI = () => {
        if (currentUser) {
            navLoginBtn.classList.add('d-none');
            navUserArea.classList.remove('d-none');
            // Pre-fill checkout form if exists
            document.getElementById('input-card-name').value = currentUser.name;
        } else {
            navLoginBtn.classList.remove('d-none');
            navUserArea.classList.add('d-none');
        }
    };

    const login = (email, name) => {
        // Simulamos estructura de usuario con suscripciones
        // Si ya existía en un "backend" simulado, lo recuperamos, si no, creamos uno nuevo básico
        if (!currentUser || currentUser.email !== email) {
            currentUser = {
                name: name,
                email: email,
                memberSince: new Date().getFullYear(),
                subscriptions: [] // Array para guardar membresías activas
            };
        }
        localStorage.setItem('auraUser', JSON.stringify(currentUser));
        updateAuthUI();
        loginModal.hide();
        showToast('Bienvenido', `Hola de nuevo, ${name}.`, 'success');
        renderSubscriptions(); // Actualizar panel de perfil
    };

    const logout = () => {
        currentUser = null;
        localStorage.removeItem('auraUser');
        updateAuthUI();
        profileModal.hide();
        showToast('Sesión Cerrada', 'Esperamos verte pronto.', 'info');
    };

    // --- SUBSCRIPTION MANAGEMENT ---

    const renderSubscriptions = () => {
        if (!currentUser) return;
        
        subsListContainer.innerHTML = '';
        
        if (currentUser.subscriptions.length === 0) {
            subsListContainer.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fa-regular fa-id-card fs-2 mb-2"></i>
                    <p class="small">No tienes membresías activas.</p>
                    <a href="#membership" onclick="document.getElementById('profileModal').click()" class="btn btn-sm btn-link text-terracotta">Ver planes</a>
                </div>
            `;
            return;
        }

        currentUser.subscriptions.forEach((sub, index) => {
            const isActive = sub.status === 'Active';
            subsListContainer.innerHTML += `
                <div class="sub-card mb-3 ${isActive ? 'active' : 'cancelled'}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="font-display fw-bold mb-0">${sub.title}</h6>
                        <span class="sub-status ${isActive ? 'status-active' : 'status-cancelled'}">
                            ${sub.status === 'Active' ? 'Activa' : 'Cancelada'}
                        </span>
                    </div>
                    <p class="small text-muted mb-1">Renovación: ${sub.renewalDate}</p>
                    <p class="fw-bold text-terracotta small">${formatCurrency(sub.price)} / Anual</p>
                    
                    ${isActive ? `
                        <button class="btn btn-outline-danger btn-sm rounded-pill w-100 mt-2 btn-cancel-sub" data-index="${index}">
                            Cancelar Suscripción
                        </button>
                    ` : `
                        <button class="btn btn-secondary btn-sm rounded-pill w-100 mt-2" disabled>
                            Cancelada
                        </button>
                    `}
                </div>
            `;
        });

        // Attach Cancel Events
        document.querySelectorAll('.btn-cancel-sub').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cancelSubscription(parseInt(e.target.dataset.index));
            });
        });
    };

    const cancelSubscription = (index) => {
        if(confirm('¿Estás seguro de cancelar tu membresía? Perderás tus beneficios Founder.')) {
            currentUser.subscriptions[index].status = 'Cancelled';
            localStorage.setItem('auraUser', JSON.stringify(currentUser));
            renderSubscriptions();
            showToast('Suscripción Cancelada', 'Tu membresía no se renovará el próximo año.', 'secondary');
        }
    };

    // --- CART LOGIC ---

    const saveCart = () => {
        localStorage.setItem('auraCart', JSON.stringify(cart));
        renderCart();
    };

    const addToCart = (product, date = null) => {
        // Validación: Propiedades requieren fecha
        if (product.type === 'one-time' && !date) {
            showToast('Fecha Requerida', 'Por favor selecciona una fecha para tu reserva.', 'secondary');
            return;
        }

        const cartItem = { 
            ...product, 
            quantity: 1,
            selectedDate: date, // Guardamos la fecha seleccionada
            uniqueId: Date.now() // Unique ID para permitir multiples fechas del mismo destino
        };
        
        cart.push(cartItem);
        saveCart();
        cartOffcanvas.show();
        showToast('Añadido', `<b>${product.title}</b> agregado al itinerario.`, 'success');
    };

    const renderCart = () => {
        cartContainer.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            emptyState.classList.remove('d-none');
            document.querySelector('.cart-footer').classList.add('d-none');
            cartCountBadge.classList.add('d-none');
        } else {
            emptyState.classList.add('d-none');
            document.querySelector('.cart-footer').classList.remove('d-none');

            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;
                
                // Formatear fecha si existe
                let dateDisplay = '';
                if (item.selectedDate) {
                    const d = new Date(item.selectedDate);
                    // Ajuste de zona horaria simple para visualización
                    const formattedDate = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                    dateDisplay = `<div class="small text-muted mt-1"><i class="fa-regular fa-calendar me-1"></i> ${formattedDate}</div>`;
                }

                cartContainer.innerHTML += `
                    <div class="cart-item animate__animated animate__fadeIn">
                        <img src="${item.img}" class="cart-img" alt="${item.title}">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 font-display fw-bold text-espresso">${item.title}</h6>
                            ${dateDisplay}
                            <small class="text-terracotta fw-bold">${formatCurrency(item.price)}</small>
                        </div>
                        <button class="btn-remove-item btn btn-sm text-danger" data-index="${index}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                `;
            });

            // Totales
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax;

            subtotalEl.textContent = formatCurrency(subtotal);
            taxEl.textContent = formatCurrency(tax);
            totalEl.textContent = formatCurrency(total);
            
            cartCountBadge.textContent = totalItems;
            cartCountBadge.classList.remove('d-none');

            // Eventos Eliminar
            document.querySelectorAll('.btn-remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.dataset.index);
                    cart.splice(idx, 1);
                    saveCart();
                });
            });
        }
    };

    // --- CHECKOUT FLOW ---

    checkoutBtn.addEventListener('click', () => {
        if (!currentUser) {
            showToast('Identificación Requerida', 'Debes iniciar sesión para completar la reserva.', 'secondary');
            loginModal.show();
            return;
        }
        cartOffcanvas.hide();
        document.getElementById('modal-pay-btn').innerHTML = `Pagar ${totalEl.textContent}`;
        // Reset Steps
        document.getElementById('step-payment').classList.remove('d-none');
        document.getElementById('step-processing').classList.add('d-none');
        document.getElementById('step-success').classList.add('d-none');
        checkoutModal.show();
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. UI Loading
        document.getElementById('step-payment').classList.add('d-none');
        document.getElementById('step-processing').classList.remove('d-none');
        
        // 2. Proceso Lógico (Simulado)
        setTimeout(() => {
            // A. Detectar suscripciones en el carrito y agregarlas al usuario
            const subscriptionsInCart = cart.filter(item => item.type === 'recurring');
            if (subscriptionsInCart.length > 0) {
                const today = new Date();
                const nextYear = new Date(new Date().setFullYear(today.getFullYear() + 1));
                
                subscriptionsInCart.forEach(sub => {
                    currentUser.subscriptions.push({
                        title: sub.title,
                        price: sub.price,
                        status: 'Active',
                        purchaseDate: today.toISOString().split('T')[0],
                        renewalDate: nextYear.toISOString().split('T')[0]
                    });
                });
                // Guardar usuario actualizado
                localStorage.setItem('auraUser', JSON.stringify(currentUser));
                renderSubscriptions(); // Actualizar UI
            }

            // B. Limpiar carrito
            cart = [];
            saveCart();

            // C. Mostrar éxito
            document.getElementById('step-processing').classList.add('d-none');
            document.getElementById('step-success').classList.remove('d-none');
        }, 2500);
    });

    // --- EVENT LISTENERS UI ---

    // Login Form Submit
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const name = document.getElementById('login-name').value; // En un caso real, esto vendría del backend
        login(email, name);
    });

    // Logout Button
    document.getElementById('btn-logout').addEventListener('click', logout);

    // Add to Cart Buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnEl = e.currentTarget;
            // Buscar input de fecha asociado dentro de la misma tarjeta
            const cardBody = btnEl.closest('.card-body') || btnEl.closest('.row'); // Fallback para membresia
            let dateVal = null;

            if (btnEl.dataset.type === 'one-time') {
                const dateInput = cardBody.querySelector('.date-picker-input');
                if (dateInput) {
                    dateVal = dateInput.value;
                }
            }

            const product = {
                id: parseInt(btnEl.dataset.id),
                title: btnEl.dataset.title,
                price: parseFloat(btnEl.dataset.price),
                img: btnEl.dataset.img,
                type: btnEl.dataset.type
            };
            addToCart(product, dateVal);
        });
    });

    // Helper Toast
    const showToast = (title, message, type = 'success') => {
        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-aura align-items-center border-0 mb-2`;
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong class="d-block text-espresso font-display">${title}</strong>
                    <span class="small text-muted">${message}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);
        new bootstrap.Toast(toastEl, { delay: 4000 }).show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    };

    // Init
    updateAuthUI();
    renderCart();
    renderSubscriptions();
});