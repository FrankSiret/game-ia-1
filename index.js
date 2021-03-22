console.log("start")
const btn_start = document.getElementById("btn_start")
const solver = document.getElementById("solver")
const timer = document.getElementById("timer")

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
 * SU CODIGO VA EN LA LINEA 175, PUEDEN USAR TANTAS FUNCIONES COMO QUIERAN
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

    const info = document.getElementById("info")
    while (info.firstChild) {
        info.removeChild(info.firstChild)
    }

    const li =
        `<li class="info-item">
        <span class="info-title">Maze:</span>
        <span class="info-value">${n} x ${m}</span>
    </li>
    <li class="info-item">
        <span class="info-title">Entrance:</span>
        <span class="info-value">(${entrance[0]}, ${entrance[1]})</span>
    </li>
    <li class="info-item">
        <span class="info-title">Exit:</span>
        <span class="info-value">(${exit[0]}, ${exit[1]})</span>
    </li>
    <li class="info-item">
        <span class="info-title">Key:</span>
        <span class="info-value">(${key[0]}, ${key[1]})</span>
    </li>
    `

    info.insertAdjacentHTML('beforeend', li)

}

function getCell(pos) {
    return document.querySelector(`#maze_solver > div:nth-child(${pos[0] + 1}) > div:nth-child(${pos[1] + 1})`)
}

function moveTop(ind = 0, inc = -1) {

    return new Promise((res, rel) => {

        setTimeout(() => {
            const to = [...current]
            to[ind] += inc;
            const cell = getCell(current)
            const cell_to = getCell(to)

            // console.log(cell)
            // console.log(cell_to)

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

            res()
        }, +timer.value);

    })
}

function moveDown() {
    return moveTop(0, 1)
}

function moveLeft() {
    return moveTop(1, -1)
}

function moveRight() {
    return moveTop(1, 1)
}

async function start() {
    btn_start.innerText = "Wait"
    btn_start.classList.remove("start")
    btn_start.classList.add("stop")
    inSolve = true;

    configureSolver(n, m)
    current = [...entrance]
    getCell(current).classList.add("current")

    await YOUR_CODE_HERE()

    stop()
}

function stop() {
    btn_start.innerText = "Start"
    btn_start.classList.remove("stop")
    btn_start.classList.add("start")
    inSolve = false;
}

btn_start.addEventListener('click', () => {
    // if (inSolve) stop()
    if (!inSolve) start();
})

document.getElementById("reset").addEventListener('click', () => {
    ready();
}, false)

document.addEventListener("DOMContentLoaded", function (event) {
    ready();
});


async function YOUR_CODE_HERE() {

    /* SU CODIGO COMIENZA AQUI */

    // es programar un algoritmo de los q estan en la conferencia, les recomiendo buesqueda en profundidad
    // como ejemplo estos son los movimientos permitidos para moverse por el laverinto

    // cada movimiento que ejecuten deven poner la palabra clave await, esto para que se vea un delay entre movimientos y quede mas pro !

    const [ki, kj] = [...key]
    const [ei, ej] = [...exit]
    const [ci, cj] = [...current]
    var bkey = false

    const pi = [-1, 0, 1, 0]
    const pj = [0, 1, 0, -1]

    var mark = new Array(n).fill().map(() => new Array(m).fill(false));
    var sol = []

    const dfs = async (i, j, mi, mj) => {
        mark[i][j] = true;
        sol.push([i, j])
        // console.log("np", i, j)
        if (bkey || (i === mi && j === mj)) {
            bkey = true
            return;
        }
        for (let k = 0; k < 4; k++) {
            if (bkey) return;
            const ni = i + pi[k]
            const nj = j + pj[k]
            if (ni < 0 || nj < 0 || ni >= n || nj >= m) continue;
            if (table[ni][nj] !== -1 && !mark[ni][nj]) {
                switch (k) {
                    case 0:
                        await moveTop()
                        break;
                    case 1:
                        await moveRight()
                        break;
                    case 2:
                        await moveDown()
                        break;
                    case 3:
                        await moveLeft()
                        break;
                }
                await dfs(ni, nj, mi, mj)
            }
        }

        sol.pop()
        if (bkey) return;
        const last = sol[sol.length - 1]
        const [i1, i2] = [...last]
        if (i === i1)
            await moveTop(1, i2 - j)
        else if (j === i2)
            await moveTop(0, i1 - i)

    }

    await dfs(ci, cj, ki, kj)

    const [ci1, cj1] = [...current]
    bkey = false;
    mark = new Array(n).fill().map(() => new Array(m).fill(false));
    await dfs(ci1, cj1, ei, ej)

    /* HASTA AQUI */

}