document.addEventListener("DOMContentLoaded",function(){

    let inputDNI = document.getElementById("numero");
    let inputLetra = document.getElementById("letra");
    let btnVerificar = document.getElementById("verificar");
    let txtResultado = document.getElementById("resultado");
    let form = document.getElementById("dniForm");

    var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];

    function mostrarResultado(mensaje, tipo) {
        txtResultado.textContent = mensaje;
        txtResultado.className = tipo;
        txtResultado.style.display = "block";
    }


    form.addEventListener("submit", function(e) {
        e.preventDefault();
    });
    
    inputDNI.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    inputLetra.addEventListener("input", function() {
        this.value = this.value.replace(/[^a-zA-ZÑñ]/g, '');
        this.value = this.value.toUpperCase();
    });

    btnVerificar.addEventListener("click", function() {
        let num = inputDNI.value;
        let letraUsuario = inputLetra.value;
                
        txtResultado.className = "";
        txtResultado.style.display = "none";

        if (!num || !letraUsuario) {
            mostrarResultado("Complete todos los campos", "error");
            return;
        }

        if (num.length !== 8) {
            mostrarResultado("El número de DNI debe tener 8 dígitos", "error");
            return;
        }

        let numeroDNI = parseInt(num);
        let residuo = numeroDNI % 23;
        let letraCorrecta = letras[residuo];

        if (letraCorrecta !== letraUsuario) {
            mostrarResultado(`La letra que ha indicado no es correcta. La letra correspondiente es: ${letraCorrecta}`, "error");
        } else {
            mostrarResultado("La letra es correcta. DNI válido.", "success");
        }
    });
});