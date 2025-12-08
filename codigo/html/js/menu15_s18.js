document.addEventListener("DOMContentLoaded", function () {
    var botonesAgregar = document.querySelectorAll(".btn-agregar-postre");
    var listaPostres = document.getElementById("listaPostres");
    var contadorPostres = document.getElementById("contadorPostres");
    var btnLimpiarPostres = document.getElementById("btnLimpiarPostres");
    var btnEnviarPastel = document.getElementById("btnEnviarPastel");
    var alertaPastelOk = document.getElementById("pastelAlertOk");
    var textoEstadoPastel = document.getElementById("pastelEstado");
    var inputsPastel = document.querySelectorAll("#formPastel input, #formPastel select, #formPastel textarea");

    function actualizarContador() {
        var total = listaPostres.querySelectorAll("li").length;
        if (total === 0) {
            contadorPostres.textContent = "0 seleccionados";
        } else if (total === 1) {
            contadorPostres.textContent = "1 seleccionado";
        } else {
            contadorPostres.textContent = total + " seleccionados";
        }
    }

    botonesAgregar.forEach(function (boton) {
        boton.addEventListener("click", function () {
            var nombre = boton.getAttribute("data-nombre");
            if (!nombre) {
                return;
            }
            var item = document.createElement("li");
            item.textContent = nombre;
            listaPostres.appendChild(item);
            actualizarContador();
        });
    });

    if (btnLimpiarPostres) {
        btnLimpiarPostres.addEventListener("click", function () {
            listaPostres.innerHTML = "";
            actualizarContador();
        });
    }

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
});
