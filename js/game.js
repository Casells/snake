const config = {
    map: {
        row: 20,
        col: 25,
        cell: {
            size: 32
        }
    },
    snake: {
        startTails: 3,
        size: 32,
        head: {
            color: "rgba(128,0,38,0.8)"
        },
        tail: {
            color: "rgba(128,0,87,0.8)"
        }
    },
    berry: {
        maxBerry: 3,
        size: 16
    }
}

let pause = false;
let start = false;

let berry = {
    positions: [],
    check(x, y) {
        berry.positions.forEach((position, index) => {
            if (position.x ===  x && position.y ===  y) {
                scope.increment();
                snake.maxTails ++
                berry.positions.splice(index, 1)
            }
        })
    },
    spawn: () => {
        if (berry.positions.length <= config.berry.maxBerry) {

            berry.positions.push({
                x: getRandomInt(0, config.map.col),
                y: getRandomInt(0, config.map.row),
                color: randomColor()
            })
        }

    },
    draw: () => {
        berry.positions.forEach((position) => {
            context.beginPath();
            context.fillStyle = position.color;
            const x = position.x * config.map.cell.size + (config.map.cell.size / 2)
            const y = position.y * config.map.cell.size + (config.map.cell.size / 2)
            context.arc(x, y, config.berry.size, 0, 2 * Math.PI );
            context.fill();
        })
    }
}

let snake = {
    forward: {
        dx:1,
        dy:0
    },
    head: {
        x: 0,
        y: 10
    },
    maxTails: config.snake.startTails,
    tails: [],
    culcPosition: () => {
        snake.head.y += snake.forward.dy;
        snake.head.x += snake.forward.dx;
        berry.check(snake.head.x, snake.head.y)
        snake.collisionBorder()
    },
    draw:() => {
        snake.tails.unshift( { x: snake.head.x, y: snake.head.y } );
        if (snake.tails.length > snake.maxTails ) {
            snake.tails.pop();
        }
        snake.tails.forEach( (el, index) => {
            if(allowSidor) {
                context.fillStyle = randomColor();
            }
            else {
                context.fillStyle = index? config.snake.tail.color : config.snake.head.color;
            }
            if (index === 0) {
                context.beginPath();
                const x = el.x * config.map.cell.size + (config.map.cell.size / 2)
                const y = el.y * config.map.cell.size + (config.map.cell.size / 2)
                context.arc(x, y, config.berry.size, 0, 2 * Math.PI );
                context.fill();
            } else {
                context.fillRect(el.x * config.map.cell.size, el.y * config.map.cell.size, config.map.cell.size, config.map.cell.size );
            }
            snake.collisionTails(index)
        })
    },
    collisionTails: (index) => {
        snake.tails.forEach( (el, j) => {
            if((index !== j) && (el.x === snake.tails[index].x) &&  (el.y === snake.tails[index].y)) {
                restartGame()
            }
        })
    },
    collisionBorder:() => {
        if(snake.head.y > config.map.row -1) {
            snake.head.y = 0
            return
        }
        if(snake.head.x > config.map.col - 1) {
            snake.head.x = 0
            return
        }
        if(snake.head.y < 0) {
            snake.head.y = config.map.row - 1
            return
        }
        if(snake.head.x < 0) {
            snake.head.x = config.map.col -1
        }
    },
    reset: () => {
        snake.head.x = 0;
        snake.head.y = 0;
        snake.maxTails = config.snake.startTails;
        snake.tails = [];
    }
}

let scopeBlock = document.getElementById("scope-number")

const scope = {
    scope: 0,
    increment: () => {
        scope.scope++
        scopeBlock.innerHTML = scope.scope;
    },
    reset: () => {
        scope.scope = 0;
        scopeBlock.innerHTML = scope.scope;
    }

}

const canvas = document.getElementById("canvas")
canvas.style.backgroundSize = config.map.cell.size + "px"

canvas.setAttribute("width", config.map.col * config.map.cell.size + "px")
canvas.setAttribute("height", config.map.row * config.map.cell.size + "px")

let context = canvas.getContext("2d");
document.addEventListener("keydown", function (e) {
    if ( e.code === "KeyW" ) {
        snake.forward.dy = snake.forward.dy === 1?  snake.forward.dy:  -1;
        snake.forward.dx = 0;
        return;
    }
    if ( e.code === "KeyA" ) {
        snake.forward.dy = 0;
        snake.forward.dx = snake.forward.dx === 1?  snake.forward.dx:  -1;
        return;
    }
    if ( e.code === "KeyS" ) {
        snake.forward.dy = snake.forward.dy === -1?  snake.forward.dy:  1;
        snake.forward.dx = 0;
        return;
    }
    if ( e.code === "KeyD" ) {
        snake.forward.dy = 0;
        snake.forward.dx = snake.forward.dx === -1?  snake.forward.dx:  1;
        return;
    }
    if( e.code === "Space") {
        pause = !pause
    }
});
let allowSidor = false
const getRandomInt = (min, max) => Math.floor( Math.random() * (max - min) + min )
const loop = () => {
    if(pause || (!start)) return
    if(scope.scope === 20) {
        startSidor()
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    berry.draw();
    snake.culcPosition();
    snake.draw()
}

setInterval(loop, 60)
setInterval(berry.spawn, 5000)


//Menu
let menu = document.getElementById("menu")
let startButton = document.getElementById("start-game")

startButton.addEventListener("click", () => {
    start = true
    berry.spawn();
    menuHide()
})

const menuHide = () => {
    menu.style.display = "none"
}
const menuShow = () => {
    menu.style.display = "block"
}

const restartGame = () => {
    menuShow()
    start = false
    scope.reset();
    snake.reset();
}

const randomColor = () => "#"+ Math.floor(Math.random()*16777215).toString(16);

const startSidor = () => {
    //canvas.style.backgroundImage = "url('../assets/boomb.png')"
    canvas.classList.add("reference")
    allowSidor = true;
    setTimeout(() => {
        canvas.classList.remove("reference")
        //canvas.style.backgroundImage = "url('../assets/Lacey Square SVG.png')"
        allowSidor = false;
    }, 8000)
}