/* js/cotizador.js */

// Cargar carrito desde LocalStorage o iniciar vacío
let cart = JSON.parse(localStorage.getItem('qb_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    initPaymentFormatters(); // Nueva función para inputs
    updateCartUI();
});

// --- 1. LÓGICA COTIZADOR ---
const preciosBase = { 'reglas': 29, 'nlp': 79, 'gpt4': 149 };
const precioPorMilMensajes = 5;

function initCalculator() {
    const inputs = document.querySelectorAll('.calc-trigger');
    if(inputs.length > 0) {
        inputs.forEach(input => input.addEventListener('input', calcularCotizacion));
        calcularCotizacion();
    }
}

function calcularCotizacion() {
    const modeloEl = document.querySelector('input[name="botModel"]:checked');
    const volumenEl = document.getElementById('volumenRange');
    
    if(!modeloEl || !volumenEl) return;

    const modelo = modeloEl.value;
    const volumen = parseInt(volumenEl.value);
    
    let extrasTotal = 0;
    const channels = [];
    if(document.getElementById('check-whatsapp').checked) { extrasTotal += 50; channels.push("WhatsApp"); }
    if(document.getElementById('check-instagram').checked) { extrasTotal += 30; channels.push("Instagram"); }
    if(document.getElementById('check-crm').checked) { extrasTotal += 40; channels.push("CRM Sync"); }

    const base = preciosBase[modelo];
    const costoVolumen = (volumen / 1000) * precioPorMilMensajes;
    const total = base + costoVolumen + extrasTotal;

    document.getElementById('display-volumen').textContent = volumen.toLocaleString();
    const displayPrice = document.getElementById("precio-final-display");
    if(displayPrice) displayPrice.innerText = "$" + Math.floor(total);

    const btnAdd = document.getElementById('btn-add-custom');
    if(btnAdd) {
        btnAdd.dataset.planName = `Configuración a Medida (${modelo.toUpperCase()})`;
        btnAdd.dataset.price = Math.floor(total);
        btnAdd.dataset.details = JSON.stringify({
            model: modelo,
            volume: volumen,
            channels: channels
        });
    }
}

// --- 2. LÓGICA CARRITO Y PERSISTENCIA ---

function saveCart() {
    localStorage.setItem('qb_cart', JSON.stringify(cart));
    updateCartUI();
}

/**
 * Añade items al carrito con validación de duplicados
 */
window.addToCart = function(type, name, price, details) {
    let finalDetails = details;
    
    if (type === 'custom' && typeof details === 'string') {
        try { finalDetails = JSON.parse(details); } 
        catch (e) { finalDetails = details; }
    }

    // Comprobación de duplicados
    const existingItem = cart.find(item => {
        // Si es el mismo nombre...
        if (item.name !== name) return false;
        
        // Y los detalles son idénticos (comparación profunda básica de JSON)
        return JSON.stringify(item.details) === JSON.stringify(finalDetails);
    });

    if (existingItem) {
        showToast(`⚠️ "${name}" ya está en tu bolsa.`);
        // Abrimos el carrito para que el usuario lo vea, pero no añadimos
        new bootstrap.Offcanvas(document.getElementById('offcanvasCart')).show();
        return;
    }

    const item = {
        id: Date.now(),
        type: type,
        name: name,
        price: price,
        details: finalDetails
    };

    cart.push(item);
    saveCart(); // Guarda en localStorage
    showToast(`"${name}" agregado a la bolsa.`);
    
    const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasCart'));
    bsOffcanvas.show();
};

window.addCustomToCart = function() {
    const btn = document.getElementById('btn-add-custom');
    addToCart('custom', btn.dataset.planName, parseInt(btn.dataset.price), btn.dataset.details);
};

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart(); // Actualiza localStorage
};

function updateCartUI() {
    const badge = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    
    if(badge) {
        badge.innerText = cart.length;
        badge.classList.toggle('d-none', cart.length === 0);
    }

    let total = 0;
    if(container) {
        container.innerHTML = '';

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 opacity-50">
                    <div class="display-1 mb-3">🛍️</div>
                    <p>Tu bolsa está vacía.</p>
                    <button class="btn btn-sm btn-outline-primary" data-bs-dismiss="offcanvas">Ver Planes</button>
                </div>`;
        } else {
            cart.forEach(item => {
                total += item.price;
                
                let descHTML = "";
                if(item.type === 'custom' && typeof item.details === 'object') {
                    const extras = item.details.channels.length > 0 ? item.details.channels.join(', ') : 'Sin extras';
                    descHTML = `<span class="badge bg-light text-dark border">Vol: ${item.details.volume.toLocaleString()}</span> <small class="text-muted d-block mt-1">${extras}</small>`;
                } else {
                    descHTML = `<small class="text-muted">${item.details}</small>`;
                }

                container.innerHTML += `
                    <div class="card mb-3 border shadow-sm position-relative animate-slide-in">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="fw-bold mb-1 text-primary">${item.name}</h6>
                                    ${descHTML}
                                </div>
                                <span class="fw-bold fs-5">$${item.price}</span>
                            </div>
                            <button onclick="removeFromCart(${item.id})" class="btn btn-sm text-danger mt-2 p-0 text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>`;
            });
        }
        if(totalEl) totalEl.innerText = `$${total}`;
    }
}

function showToast(message) {
    const toastEl = document.getElementById('liveToast');
    if(toastEl) {
        const toastBody = toastEl.querySelector('.toast-body');
        toastBody.innerText = message;
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    }
}

// --- 3. FORMATO Y VALIDACIÓN INPUTS (UX) ---

function initPaymentFormatters() {
    // 1. Formato Tarjeta (xxxx xxxx xxxx xxxx)
    const cardInput = document.getElementById('inputCardNumber');
    if(cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            // Insertar espacio cada 4 dígitos
            e.target.value = value.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    // 2. Formato Expiración (MM/YY)
    const expiryInput = document.getElementById('inputExpiry');
    if(expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            if (value.length >= 2) {
                // Insertar slash después de 2 chars
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
        });
    }

    // 3. Reset error de email al escribir
    const emailInput = document.getElementById('cardEmail');
    if(emailInput) {
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('is-invalid');
        });
    }
}

// --- 4. CHECKOUT ---

window.openPaymentModal = function() {
    if(cart.length === 0) return;
    const offcanvasEl = document.getElementById('offcanvasCart');
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    bsOffcanvas.hide();

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('payment-total').innerText = `$${total}`;

    const modalPayment = new bootstrap.Modal(document.getElementById('modalPayment'));
    modalPayment.show();
};

window.processPayment = function(event) {
    event.preventDefault();
    
    // Validar Email Estricto
    const emailInput = document.getElementById('cardEmail');
    const emailValue = emailInput.value.trim();
    // Regex: algo + @ + algo + . + algo (sin espacios)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
        emailInput.classList.add('is-invalid');
        // Animación de "shake" o focus
        emailInput.focus();
        return; // DETENER ENVÍO
    }

    // Si pasa validación:
    const btn = document.getElementById('btn-pay-now');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Procesando...`;

    setTimeout(() => {
        const modalPaymentEl = document.getElementById('modalPayment');
        const modalPayment = bootstrap.Modal.getInstance(modalPaymentEl);
        modalPayment.hide();

        const apiKey = "pk_live_" + Math.random().toString(36).substr(2, 16).toUpperCase();
        
        document.getElementById('success-email-user').innerText = emailValue;
        document.getElementById('generated-api-key').innerText = apiKey;
        
        const modalSuccess = new bootstrap.Modal(document.getElementById('modalSuccess'));
        modalSuccess.show();

        cart = [];
        saveCart(); // Limpiar localStorage también
        
        btn.disabled = false;
        btn.innerHTML = originalText;
        document.getElementById('payment-form').reset();
    }, 2000);
};