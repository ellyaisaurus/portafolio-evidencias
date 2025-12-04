document.addEventListener("DOMContentLoaded", function () {
    var btnEnviarPastel = document.getElementById("btnEnviarPastel");
    var alertaPastelOk = document.getElementById("pastelAlertOk");
    var textoEstadoPastel = document.getElementById("pastelEstado");
    var inputsPastel = document.querySelectorAll("#formPastel input, #formPastel select, #formPastel textarea");

    function marcarFormularioEditando() {
        if (textoEstadoPastel) {
            textoEstadoPastel.textContent = "Editando datos del pastel";
            textoEstadoPastel.classList.remove("pastel-estado-ok");
        }
    }

    inputsPastel.forEach(function (campo) {
        campo.addEventListener("input", marcarFormularioEditando);
        campo.addEventListener("change", marcarFormularioEditando);
    });

    if (btnEnviarPastel && alertaPastelOk && textoEstadoPastel) {
        btnEnviarPastel.addEventListener("click", function () {
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
            })
            .catch(function () {
                texto.textContent = "No se pudo obtener el dato. Intenta nuevamente más tarde.";
                setEstadoBadge("error");
            });
    }

    function limpiarDato() {
        if (!texto) {
            return;
        }
        texto.textContent = "Pulsa el botón para obtener un dato aleatorio.";
        setEstadoBadge("inicial");
    }

    if (btnCargarDato) {
        btnCargarDato.addEventListener("click", cargarDatoAleatorio);
    }

    if (btnLimpiarDato) {
        btnLimpiarDato.addEventListener("click", limpiarDato);
    }
});
