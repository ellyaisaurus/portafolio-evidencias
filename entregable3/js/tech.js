/* js/tech.js */

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    initDriverTour();
});

// 1. Configuración de Chart.js
function initChart() {
    const ctx = document.getElementById('speedChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0ms', '100ms', '200ms', '300ms', '400ms'],
            datasets: [
                {
                    label: '¡Qué Botón! (WebSocket)',
                    data: [0, 92, 98, 100, 100],
                    borderColor: '#7C3AED', // Primary
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'REST API Tradicional',
                    data: [0, 25, 50, 65, 80],
                    borderColor: '#9CA3AF', // Gray
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { beginAtZero: true, max: 100, title: { display: true, text: '% Respuesta Completa' } }
            }
        }
    });
}

// 2. Configuración del Tour Driver.js
function initDriverTour() {
    const driver = window.driver.js.driver;
    
    const driverObj = driver({
        showProgress: true,
        animate: true,
        nextBtnText: 'Siguiente →',
        prevBtnText: '← Atrás',
        doneBtnText: '¡Entendido!',
        steps: [
            { 
                element: '#code-window-container', 
                popover: { 
                    title: 'Editor de Código', 
                    description: 'Así se ve la integración en tu sitio web. Es solo copiar y pegar.' 
                } 
            },
            { 
                element: '#step-script', 
                popover: { 
                    title: 'Paso 1: El Loader', 
                    description: 'Importa nuestro script ligero desde el CDN. No afecta la velocidad de tu sitio.' 
                } 
            },
            { 
                element: '#step-config', 
                popover: { 
                    title: 'Paso 2: Inicialización', 
                    description: 'Configura el objeto "QueBoton" para personalizar la experiencia.' 
                } 
            },
            { 
                element: '#step-apikey', 
                popover: { 
                    title: 'Tu Llave Secreta', 
                    description: 'Esta llave única conecta tu sitio con el cerebro entrenado para tu negocio.',
                    side: 'left'
                } 
            }
        ]
    });

    const btn = document.getElementById('start-tour-btn');
    if(btn) {
        btn.addEventListener('click', () => {
            driverObj.drive();
        });
    }
}