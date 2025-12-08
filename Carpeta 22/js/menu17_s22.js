document.addEventListener("DOMContentLoaded", function () {
    var btnEnviarPastel = document.getElementById("btnEnviarPastel");
    var alertaPastelOk = document.getElementById("pastelAlertOk");
    var alertaPastelError = document.getElementById("pastelAlertError");
    var textoEstadoPastel = document.getElementById("pastelEstado");
    var inputsPastel = document.querySelectorAll("#formPastel input, #formPastel select, #formPastel textarea");
    var camposRequeridos = document.querySelectorAll(".pastel-requerido");
    var listaPreview = document.getElementById("pedidoPreviewLista");
    var hintPreview = document.getElementById("pedidoPreviewHint");

    function marcarFormularioEditando() {
        if (textoEstadoPastel) {
            textoEstadoPastel.textContent = "Editando datos del pastel";
            textoEstadoPastel.classList.remove("pastel-estado-ok");
        }
        if (alertaPastelOk) {
            alertaPastelOk.classList.add("d-none");
            alertaPastelOk.classList.remove("show");
        }
        if (alertaPastelError) {
            alertaPastelError.classList.add("d-none");
            alertaPastelError.classList.remove("show");
        }
        actualizarPreview();
    }

    inputsPastel.forEach(function (campo) {
        campo.addEventListener("input", marcarFormularioEditando);
        campo.addEventListener("change", marcarFormularioEditando);
    });

    function validarFormulario() {
        var esValido = true;
        camposRequeridos.forEach(function (campo) {
            campo.classList.remove("pastel-input-error");
            if (!campo.value || campo.value.trim() === "") {
                esValido = false;
                campo.classList.add("pastel-input-error");
            }
        });
        return esValido;
    }

    function obtenerDecoraciones() {
        var decoraciones = [];
        var checks = document.querySelectorAll(".pastel-decor");
        checks.forEach(function (c) {
            if (c.checked) {
                decoraciones.push(c.value);
            }
        });
        return decoraciones;
    }

    function actualizarPreview() {
        if (!listaPreview || !hintPreview) {
            return;
        }
        var nombre = document.getElementById("nombreCliente").value.trim();
        var personas = document.getElementById("personas").value.trim();
        var sabor = document.getElementById("saborPastel").value.trim();
        var relleno = document.getElementById("rellenoPastel").value.trim();
        var fecha = document.getElementById("fechaEvento").value.trim();
        var decoraciones = obtenerDecoraciones();
        var comentarios = document.getElementById("comentariosPastel").value.trim();

        listaPreview.innerHTML = "";

        if (!nombre && !personas && !sabor && !relleno && !fecha && decoraciones.length === 0 && !comentarios) {
            var liVacio = document.createElement("li");
            liVacio.textContent = "Sin datos aún, comienza llenando el formulario.";
            listaPreview.appendChild(liVacio);
            hintPreview.textContent = "Faltan datos clave para sugerir una propuesta.";
            return;
        }

        if (nombre) {
            var liNombre = document.createElement("li");
            liNombre.textContent = "Para: " + nombre;
            listaPreview.appendChild(liNombre);
        }

        if (personas) {
            var liPersonas = document.createElement("li");
            liPersonas.textContent = "Número de personas: " + personas;
            listaPreview.appendChild(liPersonas);
        }

        if (fecha) {
            var liFecha = document.createElement("li");
            liFecha.textContent = "Fecha tentativa: " + fecha;
            listaPreview.appendChild(liFecha);
        }

        if (sabor) {
            var liSabor = document.createElement("li");
            liSabor.textContent = "Sabor principal: " + sabor;
            listaPreview.appendChild(liSabor);
        }

        if (relleno) {
            var liRelleno = document.createElement("li");
            liRelleno.textContent = "Relleno: " + relleno;
            listaPreview.appendChild(liRelleno);
        }

        if (decoraciones.length > 0) {
            var liDecor = document.createElement("li");
            liDecor.textContent = "Decoración: " + decoraciones.join(", ");
            listaPreview.appendChild(liDecor);
        }

        if (comentarios) {
            var liComentarios = document.createElement("li");
            liComentarios.textContent = "Notas extra: " + comentarios;
            listaPreview.appendChild(liComentarios);
        }

        if (validarFormulario()) {
            hintPreview.textContent = "Con estos datos ya se puede armar una propuesta aproximada.";
        } else {
            hintPreview.textContent = "Faltan algunos campos obligatorios para completar la propuesta.";
        }
    }

    if (btnEnviarPastel && alertaPastelOk && alertaPastelError && textoEstadoPastel) {
        btnEnviarPastel.addEventListener("click", function () {
            var esValido = validarFormulario();
            if (!esValido) {
                alertaPastelError.classList.remove("d-none");
                alertaPastelError.classList.add("show");
                alertaPastelOk.classList.add("d-none");
                alertaPastelOk.classList.remove("show");
                textoEstadoPastel.textContent = "Faltan datos por completar";
                textoEstadoPastel.classList.remove("pastel-estado-ok");
                return;
            }
            alertaPastelError.classList.add("d-none");
            alertaPastelError.classList.remove("show");
            alertaPastelOk.classList.remove("d-none");
            alertaPastelOk.classList.add("show");
            textoEstadoPastel.textContent = "Datos listos para enviar por WhatsApp";
            textoEstadoPastel.classList.add("pastel-estado-ok");
        });
    }

    var btnCargarDato = document.getElementById("btnCargarDato");
    var btnLimpiarDato = document.getElementById("btnLimpiarDato");
    var badge = document.getElementById("apiBadge");
    var texto = document.getElementById("apiTexto");
    var listaHistorial = document.getElementById("apiHistorialLista");

    function setEstadoBadge(modo) {
        if (!badge) {
            return;
        }
        badge.classList.remove("api-badge-loading", "api-badge-error", "api-badge-ok");
        if (modo === "cargando") {
            badge.textContent = "Cargando dato...";
            badge.classList.add("api-badge-loading");
        } else if (modo === "error") {
            badge.textContent = "Ocurrió un error";
            badge.classList.add("api-badge-error");
        } else if (modo === "ok") {
            badge.textContent = "Dato cargado";
            badge.classList.add("api-badge-ok");
        } else {
            badge.textContent = "Listo para consultar";
        }
    }

    function agregarAlHistorial(textoDato) {
        if (!listaHistorial) {
            return;
        }
        var actual = listaHistorial.querySelectorAll("li");
        if (actual.length === 1 && actual[0].textContent.indexOf("No hay datos") === 0) {
            listaHistorial.innerHTML = "";
        }
        var li = document.createElement("li");
        li.textContent = textoDato;
        listaHistorial.insertBefore(li, listaHistorial.firstChild);
        var items = listaHistorial.querySelectorAll("li");
        if (items.length > 5) {
            listaHistorial.removeChild(listaHistorial.lastChild);
        }
    }

    function cargarDatoAleatorio() {
        if (!texto) {
            return;
        }
        setEstadoBadge("cargando");
        texto.textContent = "Buscando un dato curioso...";

        fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")
            .then(function (respuesta) {
                if (!respuesta.ok) {
                    throw new Error("Respuesta no válida");
                }
                return respuesta.json();
            })
            .then(function (data) {
                var contenido = data && data.text ? data.text : "No se encontró un dato en este momento.";
                texto.textContent = contenido;
                setEstadoBadge("ok");
                agregarAlHistorial(contenido);
            })
            .catch(function () {
                texto.textContent = "No se pudo obtener el dato. Intenta nuevamente más tarde.";
                setEstadoBadge("error");
            });
    }

    function limpiarDato() {
        if (!texto || !listaHistorial) {
            return;
        }
        texto.textContent = "Pulsa el botón para obtener un dato aleatorio.";
        setEstadoBadge("inicial");
        listaHistorial.innerHTML = "";
        var li = document.createElement("li");
        li.textContent = "No hay datos en el historial todavía.";
        listaHistorial.appendChild(li);
    }

    if (btnCargarDato) {
        btnCargarDato.addEventListener("click", cargarDatoAleatorio);
    }

    if (btnLimpiarDato) {
        btnLimpiarDato.addEventListener("click", limpiarDato);
    }

    actualizarPreview();
});
