/*
    Práctica: Manipulación del DOM con JavaScript
    Objetivo: Cambiar estilos y texto de un elemento (Pastel) en tiempo real.
*/

// Esperar a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Seleccionar Elementos del DOM ---
    const cakePreview = document.getElementById('cakePreview'); // El div del pastel
    const cakeText = document.getElementById('cakeText');       // El texto sobre el pastel
    const inputMensaje = document.getElementById('mensajeInput'); // Input de texto
    
    const btnFresa = document.getElementById('btnFresa');
    const btnChocolate = document.getElementById('btnChocolate');
    const btnVainilla = document.getElementById('btnVainilla');
    const btnReset = document.getElementById('btnResetCake');

    // --- 2. Funciones de Manipulación ---

    // Función para cambiar el texto del pastel en tiempo real
    inputMensaje.addEventListener('keyup', function() {
        const textoEscrito = inputMensaje.value;
        
        // Si el input está vacío, poner texto por defecto
        if(textoEscrito.trim() === "") {
            cakeText.textContent = "¡Felicidades!";
        } else {
            cakeText.textContent = textoEscrito;
        }
    });

    // Función genérica para cambiar color (Sabor)
    function cambiarSabor(colorFondo, colorTexto) {
        cakePreview.style.backgroundColor = colorFondo;
        cakeText.style.color = colorTexto;
        
        // Añadir una pequeña animación simple
        cakePreview.style.transform = "scale(1.05)";
        setTimeout(() => {
            cakePreview.style.transform = "scale(1)";
        }, 200);
    }

    // --- 3. Asignar Eventos a los Botones ---

    // Sabor Fresa (Rosa)
    btnFresa.addEventListener('click', function() {
        cambiarSabor('#FFB7B2', '#FFFFFF');
    });

    // Sabor Chocolate (Café)
    btnChocolate.addEventListener('click', function() {
        cambiarSabor('#8D6E63', '#FFFFFF');
    });

    // Sabor Vainilla (Amarillo claro)
    btnVainilla.addEventListener('click', function() {
        cambiarSabor('#FFF9C4', '#6F4E37'); // Texto oscuro para contraste
    });

    // Botón Restablecer
    btnReset.addEventListener('click', function() {
        // Restablecer estilos CSS
        cakePreview.style.backgroundColor = '#FFB7B2';
        cakeText.style.color = '#FFFFFF';
        
        // Restablecer texto
        cakeText.textContent = "¡Felicidades!";
        inputMensaje.value = "";
    });

});