console.log("start")
const btn_start = document.getElementById("btn_start")
const solver = document.getElementById("solver")

var inSolve = false; /// esta variable se refiere a si su algoritmo esta en ejecucion
var current = [0, 0]; /// esta es su posicion en el laverinto

/**
 * @n cantidad de columnas
 * @m cantidad de filas
 * @table matriz del laverinto n x m de valores enteros definidos como : {-1: muro, 0: libre, 1: llave, 2:entrada, 3:salida }
 * 
 * @key posicion de la llave [i, j]
 * @entrance entrada del laverinto [i, j]
 * @exit salida del laverinto [i, j
 */
var n = 0
var m = 0
var table = [[]]
var key = [0, 0]
var exit = [0, 0]
var entrance = [0, 0]

/** 
 * SU CODIGO VA EN LA LINEA 162, PUEDEN USAR TANTAS FUNCIONES COMO QUIERAN
 * POR FAVOR NO MODIFICAR NINGUN CODIGO DE ESTE JS SIN EL CONSENTIMIENTO DEL PROFESOR 
 * 🍖🧀 EXCEPCION: EN LA LINEA 40 Y 41 SE GENERA EL TAMAÑO DEL TABLERO PEDEN MODIFICARLO PARA PROVAR SU CODIGO
 *
 * SI SU CODIGO SE FUNDE, F5 A LA PAGINA WEB 😃
 * USEN LOS console.log(...) PARA VER EL COMPORTAMIENTO DE SU CODIGO
 * 💥 EL OBJETIVO DEL JUEGO ES OBVIO, LLEGAR A LA PUERTA 💥
 * 💥 DEMAS ESTA DECIR QUE LA PUERTA NO SE ABRE SIN LA LLAVE 💥
 * UN PUNTO MENOS SI ROMPEN LA PUERTA 🤣🤣
 * ⭐⭐ HAPPI CODING ⭐⭐
 */

function ready() {
    if (inSolve) return;

    const h = 10 + Math.floor(Math.random() * (10));
    const w = 10 + Math.floor(Math.random() * (10));

    let Maze = new MazeBuilder(h, w);
    Maze.placeKey() // agregar llave, pueden agregar mas si decean, solo que tienen que iterar por Maze.keys para cojerlas todas.
    Maze.display("maze_container");

    n = Maze.rows
    m = Maze.cols
    table = Maze.table

    key = Maze.keys[0]
    exit = Maze.doorPosExit
    entrance = Maze.doorPosIn

    console.log('Tabla de ' + n + ' x ' + m)
    console.log('LLave: ', key)
    console.log('Entrada: ', entrance)
    console.log('Salida: ', exit)

    configureSolver(n, m)
    current = [...entrance]
    getCell(current).classList.add("current")
}

function configureSolver(n, m) {
    solver.style.width = `calc(1em * ${m})`
    solver.style.height = `calc(1em * ${n})`

    while (solver.firstChild) {
        solver.removeChild(solver.firstChild);
    }

    const container = document.createElement("div");
    container.id = "maze_solver";

    for (let i = 0; i < n; i++) {
        let rowDiv = document.createElement("div");
        for (let j = 0; j < m; j++) {
            let cellDiv = document.createElement("div");
            cellDiv.setAttribute("row", i)
            cellDiv.setAttribute("col", j)
            cellDiv.classList.add("cell_solver")
            rowDiv.appendChild(cellDiv);
        }
        container.appendChild(rowDiv);
    }

    solver.appendChild(container);
}

function getCell(pos) {
    return document.querySelector(`#maze_solver > div:nth-child(${pos[0] + 1}) > div:nth-child(${pos[1] + 1})`)
}

function moveTop(ind = 0, inc = -1) {

    const to = [...current]
    to[ind] += inc;
    const cell = getCell(current)
    const cell_to = getCell(to)

    console.log(cell_to)

    cell.classList.remove("current")
    if (cell_to.classList.contains("path")) {
        cell.classList.add("old")
    }
    else {
        cell.classList.add("path")
    }
    cell_to.classList.add("current")
    cell_to.classList.remove("path")
    cell_to.classList.remove("old")
    current = [...to]
}

function moveDown() {
    moveTop(0, 1)
}

function moveLeft() {
    moveTop(1, -1)
}

function moveRight() {
    moveTop(1, 1)
}

function start() {
    btn_start.innerText = "Stop"
    btn_start.classList.remove("start")
    btn_start.classList.add("stop")
    inSolve = true;

    YOUR_CODE_HERE()

    stop()
}

function stop() {
    btn_start.innerText = "Start"
    btn_start.classList.remove("stop")
    btn_start.classList.add("start")
    inSolve = false;
}

btn_start.addEventListener('click', () => {
    if (inSolve) stop()
    else if (!inSolve) start();
})

document.getElementById("reset").addEventListener('click', () => {
    ready();
}, false)

document.addEventListener("DOMContentLoaded", function (event) {
    ready();
});

// Lista para almacenar los puntos que han sido visitados
const visited = new Set()

function YOUR_CODE_HERE() {
    /* SU CODIGO COMIENZA AQUI */

    // Limpiar lista de puntos visitados
    visited.clear()

    // Agregar punto actual a la lista de puntos visitados.
    visited.add(JSON.stringify(current))

    // Ir desde la posición actual (la entrada) hasta donde está la llave.
    goTo(table, current, key)

    // Después de encontrar la llave se vuelve a resolver el mismo problema
    // de ir de una posición del laberinto a otra.

    // Limpiar lista de puntos visitados.
    visited.clear()

    // Agregar punto actual a la lista de puntos visitados
    visited.add(JSON.stringify(current))

    // Ir desde la posición actual (la llave) hasta la salida
    goTo(table, current, exit)

    /* HASTA AQUI */
}

// Función para desplazarse desde un punto a otro
const goTo = (map, [x, y], [xt, yt]) => {
    // Si el punto actual es igual al punto de destino, devuelve true
    // problema resuelto
    if (x == xt && y == yt) return true

    // Si no
    // Obtener lista de posibles acciones
    // Las acciones sería moveTop, moveDown, moveLeft, moveRigth
    // Pero esta función devuelve las acciones permitidas,
    // teniendo en cuenta que no se atraviesen las paredes.
    // Además calcula la distancia entre el próximo punto y el objetivo
    // y ordena las acciones para seleccionar primero las que disminuyen más la
    // distancia.
    const actions = getActionList(map, [x, y], [xt, yt])

    // Para cada acción de la lista de acciones seleccionadas
    for (let a of actions) {
        // Si el punto al que se llega trás realizar la acción ya fué
        // visitado, no se realiza la acción y se continua con la siguiente
        // acción de la lista
        if (visited.has(JSON.stringify(a.point))) {
            continue
        }
        // Si el punto al que se llega trás realizar la acción no se ha visitado
        else {
            // Se agrega el punto al que se llega trás realizar la acción a la lista
            // de puntos visistados
            visited.add(JSON.stringify(a.point))

            // Se ejecuta la acción
            a.action()
        }

        // Ahora el nuevo problema es ir desde el nuevo punto actual hasta el objetivo
        // Se realiza llamada recursiva a la función goTo para que resuelva el problema
        let result = goTo(map, current, [xt, yt])

        // Si el resultado es true significa que se logró llegar al objetivo
        // Se retorna true también
        if (result) return true
        // Si el resultado es false significa que no se logró llegar al objetivo después
        // de haber realizado la acción seleccionada, por tanto se retrocede, se realiza la acción
        // contraria a la que habíamos realizado antes, y se contiúa el ciclo con la siguiente
        // acción de la lista
        else {
            a.backAction()
        }

    }

    // Si no se logra el objetivo con ninguna de las acciones de la lista retornamos false
    return false
}


// Función para obtener la lista de acciones válidas
const getActionList = (map, [x, y], [xt, yt]) => {
    // Obtener estado del ambiente
    // El agente solo será capáz de ver los puntos que se encuentran adyacentes a él
    // La función see devuelve un diccionario con las propiedades de cada punto adyacente
    // a la posición del agente [top, left, right, down]
    const ambient = see(map, [x, y])

    // Lista para almacenar las acciones que se podrán realizar en dependencia
    // de lo que se observa en el ambiente
    const actions = []

    // Seleccionar acciones según el estado del ambiente

    // undefined = se sale del laberinto
    // -1 = es un muro

    // Se comprueba que sea válido realizar una acción en esa dirección,
    // Además se agrega la distancia entre el punto al que se llega trás realizar
    // la acción y el punto objetivo.
    // Se agregan también las coordenadas del punto al que se llega tras realizar la acción y la
    // acción de retroceso.

    if (ambient.top != undefined && ambient.top != -1) {
        actions.push({
            dist: dist([x - 1, y], [xt, yt]),
            action: moveTop,
            backAction: moveDown,
            point: [x - 1, y],
        })
    }

    if (ambient.left != undefined && ambient.left != -1) {
        actions.push({
            dist: dist([x, y - 1], [xt, yt]),
            action: moveLeft,
            backAction: moveRight,
            point: [x, y - 1],
        })
    }

    if (ambient.rigth != undefined && ambient.rigth != -1) {
        actions.push({
            dist: dist([x, y + 1], [xt, yt]),
            action: moveRight,
            backAction: moveLeft,
            point: [x, y + 1],
        })
    }

    if (ambient.down != undefined && ambient.down != -1) {
        actions.push({
            dist: dist([x + 1, y], [xt, yt]),
            action: moveDown,
            backAction: moveTop,
            point: [x + 1, y],
        })
    }

    // Se ordena la lista de acciones según la distancia,
    // las que tienen menor distancia van primero.
    actions.sort((a, b) => {
        // a es menor que b según criterio de ordenamiento
        if (a.dist < b.dist) return -1
        // a es mayor que b según criterio de ordenamiento
        if (a.dist > b.dist) return 11

        // a debe ser igual b
        return 0
    })

    return actions
}

// Función para obtener el estado del ambiente
// Devuelve el valor de la tabla que representa el laberinto 
// en cada punto seleccionado, en caso de que el punto se salga de los
// límites toma el valor de undefined.
const see = (map, [x, y]) => {
    return {
        top: map[x - 1] ? map[x - 1][y] : undefined,
        left: map[x] ? map[x][y - 1] : undefined,
        rigth: map[x] ? map[x][y + 1] : undefined,
        down: map[x + 1] ? map[x + 1][y] : undefined,
    }
}

// Función para calcular la distancia de un punto a otro.
const dist = ([x1, x2], [y1, y2]) => {
    const a = x1 - x2
    const b = y1 - y2

    return Math.sqrt(a * a + b * b)
}