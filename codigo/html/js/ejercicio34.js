document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todas las tarjetas de producto
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Dentro de cada tarjeta, buscamos los botones específicos
        const selectBtn = card.querySelector('.btn-select');
        const deselectBtn = card.querySelector('.btn-deselect');
        
        // Elementos a modificar
        const statusBadge = card.querySelector('.status-badge');
        const descriptionText = card.querySelector('.description-text');

        // Lógica del Botón 1: Seleccionar
        selectBtn.addEventListener('click', () => {
            // Requerimiento: añadir clases de bootstrap (border, border-success, shadow)
            card.classList.add('border', 'border-success', 'shadow');
            
            // Requerimiento: cambiar el contenido (visualmente para feedback)
            if(statusBadge) {
                statusBadge.textContent = '¡Seleccionado!';
                statusBadge.classList.add('text-success');
                statusBadge.classList.remove('text-muted');
            }
            
            // Aseguramos que la descripción sea visible si se vuelve a seleccionar
            if(descriptionText) {
                descriptionText.classList.remove('d-none');
            }
        });

        // Lógica del Botón 2: Retirar selección
        deselectBtn.addEventListener('click', () => {
            // Requerimiento: remueve clases de la card
            card.classList.remove('border-success', 'shadow');
            
            // Requerimiento: actualiza border (mantenemos border base o lo removemos si se desea resetear total)
            // Bootstrap usa 'border' para activar los bordes. Si queremos quitar el verde pero dejar el borde:
            // Simplemente removimos border-success arriba. 
            
            // Requerimiento: añade display none a un apartado del texto
            // Usamos la clase de utilidad de Bootstrap 'd-none' que equivale a display: none
            if(descriptionText) {
                descriptionText.classList.add('d-none');
            }

            // Restaurar estado del badge (parte del cambio de contenido visual)
            if(statusBadge) {
                statusBadge.textContent = 'Disponible';
                statusBadge.classList.remove('text-success');
                statusBadge.classList.add('text-muted');
            }
        });
    });
});