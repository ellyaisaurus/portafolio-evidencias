document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM (Document Object Model)
    const actionBtn = document.getElementById('actionBtn');
    const cardImage = document.getElementById('cardImage');
    const cardTitle = document.getElementById('cardTitle');
    const cardText = document.getElementById('cardText');
    const badgeText = document.querySelector('.badge-text');

    // Estado inicial de la aplicación
    let isOriginalState = true;

    // Rutas de las imágenes (según tus indicaciones)
    const imgInterior = 'img/pasteleria.png';
    const imgLogo = 'img/logo_pasteleria.png';

    // Función manejadora del evento Click
    actionBtn.addEventListener('click', () => {
        
        // 1. Iniciar animación de salida (CSS class)
        cardImage.classList.add('img-swap-anim');
        
        // Deshabilitar botón temporalmente para evitar glitches visuales
        actionBtn.style.pointerEvents = 'none';

        // 2. Esperar a que la transición de CSS progrese (300ms) antes de cambiar el contenido
        setTimeout(() => {
            if (isOriginalState) {
                // CAMBIO: De Interior a Logo/Producto
                cardImage.src = imgLogo;
                cardImage.style.objectFit = "contain"; // Ajuste para que el logo se vea completo
                cardImage.style.padding = "20px"; // Espacio para que el logo respire
                
                cardTitle.innerText = "¡Nuestra Dulce Especialidad!";
                cardText.innerText = "Te presentamos nuestros famosos Cupcakes de Fresa Cremosa (que, como puedes ver, también es nuestro logo). Hechos artesanalmente con ingredientes seleccionados para derretirse en tu paladar.";
                actionBtn.querySelector('.btn-content').innerText = "Volver a la Tienda";
                badgeText.innerText = "Delicioso";
            } else {
                // CAMBIO: De Logo a Interior (Regreso)
                cardImage.src = imgInterior;
                cardImage.style.objectFit = "cover"; // Regresar a cover para la foto de ambiente
                cardImage.style.padding = "0";
                
                cardTitle.innerText = "Bienvenido a ¡Que Delicia!";
                cardText.innerText = "Sumérgete en un ambiente donde el aroma a vainilla y los colores pastel crean una atmósfera de ensueño. Cada rincón está diseñado para inspirar dulzura.";
                actionBtn.querySelector('.btn-content').innerText = "Descubrir Especialidad";
                badgeText.innerText = "Premium";
            }

            // Invertir el estado lógico
            isOriginalState = !isOriginalState;

            // 3. Al cargar la nueva imagen, quitar la animación para hacer el Fade-In
            // Usamos un pequeño timeout extra para asegurar que el navegador procese el cambio de SRC
            cardImage.onload = () => {
                cardImage.classList.remove('img-swap-anim');
                actionBtn.style.pointerEvents = 'auto'; // Reactivar botón
            };

            // Fallback por si la imagen ya está en caché y onload dispara muy rápido o no dispara
            setTimeout(() => {
                cardImage.classList.remove('img-swap-anim');
                actionBtn.style.pointerEvents = 'auto';
            }, 100);

        }, 300); // Este tiempo coincide con la mitad de la transición CSS
    });
});