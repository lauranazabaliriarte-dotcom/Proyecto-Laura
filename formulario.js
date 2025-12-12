let heroeRow = 0;
let heroeCol = 0;
let dadoValor = 0;
let tiradas = 0;
const TAMANO_TABLERO = 10;
const RECORD_KEY = 'cazaDelTesoroRecord';

const limpiarMovimientosPosibles = () => {
    document.querySelectorAll('#tablero td').forEach(celda => {
        celda.classList.remove('movimiento-posible');
        celda.removeEventListener('click', manejarMovimiento);
    });
};

const verificarVictoria = (nombre) => {
    
    const esVictoria = (heroeRow === 9) & (heroeCol === 9); 

    // Mensajes de victoria 
    esVictoria && (document.getElementById("saludo").textContent = `¡FELICIDADES ${nombre.toUpperCase()}! ¡HAS GANADO en ${tiradas} tiradas!`);
    esVictoria && (document.getElementById("aviso").textContent = "¡Has encontrado el tesoro! Fin del juego.");
    esVictoria && (document.getElementById("tirarDado").style.display = "none");
    esVictoria && (document.getElementById("imgDado").style.display = "none");
    
    // Gestión de récords
    esVictoria && (() => {
        const recordAnterior = parseInt(localStorage.getItem(RECORD_KEY)) || Infinity;
        const esNuevoRecord = tiradas < recordAnterior;
        const mensajeRecordAnterior = `Récord no superado, el actual récord es ${recordAnterior}.`;

        // Almacenar el nuevo récord si es necesario
        esNuevoRecord && (localStorage.setItem(RECORD_KEY, tiradas));

        // Determinar y mostrar el mensaje final
        document.getElementById("aviso").textContent = esNuevoRecord
            ? `¡NUEVO RÉCORD! ¡${tiradas} tiradas!`
            : (recordAnterior === Infinity ? "Fin del juego." : mensajeRecordAnterior);
    })();
    
    return esVictoria;
};

const manejarMovimiento = (ev) => {
    const nuevaCelda = ev.currentTarget;
    const esPosible = nuevaCelda.classList.contains('movimiento-posible');

    // Retornar si no es pisible un movimiento 
    esPosible || (()=>{return}) ();

    const nuevaRow = parseInt(nuevaCelda.dataset.row);
    const nuevaCol = parseInt(nuevaCelda.dataset.col);
    const celdaActual = document.querySelector(`td[data-row="${heroeRow}"][data-col="${heroeCol}"]`);
    const nombre = document.getElementById("nombre").value;

    // limpiar posicion 
    celdaActual.classList.remove('hero');
    
    // Restaurar cofre 
    const eraCofre = (heroeRow === 9) & (heroeCol === 9);
    celdaActual.textContent = eraCofre ? 'Cofre' : '';
    celdaActual.classList[eraCofre ? 'add' : 'remove']('cofre');

    //movimiento jheroe 
    heroeRow = nuevaRow;
    heroeCol = nuevaCol;
    
    //nueva posicion
    const esCofre = (heroeRow === 9) & (heroeCol === 9);
    nuevaCelda.textContent = esCofre ? '¡Tesoro!' : 'Heroe';
    nuevaCelda.classList.remove('cofre');
    nuevaCelda.classList.add('hero');

    //siguiente turno y limpieza 
    limpiarMovimientosPosibles();
    document.getElementById("tirarDado").disabled = false;
    document.getElementById("tirarDado").textContent = "Tirar dado";
    document.getElementById("aviso").textContent = "¡Turno completado! Tira el dado de nuevo.";

    verificarVictoria(nombre);
};

// funcion de horizontal y vertical
const resaltarMovimientosPosibles = (dado) => {
    limpiarMovimientosPosibles();
    const tablero = document.getElementById("tablero");

    for (let f = 0; f < TAMANO_TABLERO; f++) {
        for (let c = 0; c < TAMANO_TABLERO; c++) {
            // Distancia en columnas y filas
            const deltaC = Math.abs(c - heroeCol);
            const deltaF = Math.abs(f - heroeRow);
            
            // que no vaya en diagonal 
            const esMovimientoValido = (deltaF === 0 && deltaC === dado) || 
                                       (deltaC === 0 && deltaF === dado);

            // movimiento valido 
            esMovimientoValido ? (() => {
                const celda = tablero.querySelector(`td[data-row="${f}"][data-col="${c}"]`);
                
                celda && celda.classList.add('movimiento-posible');
                celda && celda.addEventListener('click', manejarMovimiento);
            })() : 0; 
        }
    }

    // desactivar ele dado asta siguiente movimiento 
    document.getElementById("tirarDado").disabled = true;
    document.getElementById("tirarDado").textContent = "¡MUEVE AL HÉROE!";
};

// ocultar tablero y dado
document.getElementById("tablero").style.display = "none";
document.getElementById("tirarDado").style.display = "none";
document.getElementById("imgDado").style.display = "none";

// desactivar jugar
document.getElementById("btnJugar").disabled = true;

// CLICK 
document.getElementById("btnIntroducir").addEventListener("click", (ev) => {
    ev.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let soloLetras = nombre.replaceAll(" ", "");
    
    const esInvalido = (soloLetras.length < 4) || (/\d/.test(nombre));

    document.getElementById("aviso").textContent = esInvalido 
        ? (soloLetras.length < 4 ? "El nombre debe tener 4 o más letras" : "Números no permitidos")
        : "";

    document.getElementById("btnJugar").disabled = esInvalido;
    
    !esInvalido && (document.getElementById("saludo").textContent = "A luchar héroe: " + nombre);
});


// CLICK jugar
document.getElementById("btnJugar").addEventListener("click", (ev) => {
    // Inicialización de variables de juego
    heroeRow = 0;
    heroeCol = 0;
    dadoValor = 0;
    tiradas = 0; // Reiniciar contador 
    limpiarMovimientosPosibles();
    
    // mostrar zona
    let tablero = document.getElementById("tablero");
    tablero.style.display = "block";
    tablero.innerHTML = "";

    // crear tabla 10x10 
    let table = document.createElement("table");

    for (let f = 0; f < 10; f++) {
        let tr = document.createElement("tr");

        for (let c = 0; c < 10; c++) {
            let td = document.createElement("td");
            td.dataset.row = f;
            td.dataset.col = c;
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    tablero.appendChild(table);

    // poner héroe y cofre
    let celdaHeroe = tablero.querySelector('td[data-row="0"][data-col="0"]');
    let celdaCofre = tablero.querySelector('td[data-row="9"][data-col="9"]');

    celdaHeroe.textContent = "Heroe";
    celdaHeroe.classList.add("hero");

    celdaCofre.textContent = "Cofre";
    celdaCofre.classList.add("cofre");

    // ocultar botón jugar
    document.getElementById("btnJugar").style.display = "none";

    // mostrar botón dado e imagen
    document.getElementById("tirarDado").style.display = "inline-block";
    document.getElementById("imgDado").style.display = "inline-block";
    document.getElementById("tirarDado").disabled = false;
    document.getElementById("tirarDado").textContent = "Tirar dado";


    //poner dado inicial
    document.getElementById("imgDado").src = "img/dado1.png";
    document.getElementById("aviso").textContent = "¡Turno para tirar el dado!";
});

// cambiar imagen y gestionar movimiento
document.getElementById("tirarDado").addEventListener("click", (ev) => {
    // volver si esta desactivado
    !ev.currentTarget.disabled || (()=>{return}) ();

    let numero = Math.floor(Math.random() * 6) + 1;

    document.getElementById("imgDado").src = "img/dado" + numero + ".png";
    console.log("Ha salido el número:", numero);

    // Aumentar el contador de tiradas
    tiradas++;

    dadoValor = numero;
    resaltarMovimientosPosibles(dadoValor);
    document.getElementById("aviso").textContent = `Puedes moverte ${dadoValor} casillas. Tirada #${tiradas}. Haz clic en una celda resaltada en rojo.`;
});