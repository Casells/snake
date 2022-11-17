let config = {
    map: {
        row: 20,
        col: 25,
        cell: {
            size: 32
        }
    },
    snake: {
        size: 32,
        head: {
            color: "rgba(128,0,38,0.8)"
        },
        tail: {
            color: "rgba(128,0,87,0.8)"
        }
    },
    berry: {
        size: 16
    }
}
let pause = false;
let berry = {
    position: {
        x: 0,
        y: 0
    },
    check(x, y) {
        if ( berry.position.x ===  x && berry.position.y ===  y) {
            berry.spawn()
            return true;
        }
        return false;
    },
    spawn: () => {
        berry.position.x = getRandomInt(0, config.map.col)
        berry.position.y = getRandomInt(0, config.map.row)
    },
    draw: () => {
        context.beginPath();
        context.fillStyle = "#283636";
        const x = berry.position.x * config.map.cell.size + (config.map.cell.size / 2)
        const y = berry.position.y * config.map.cell.size + (config.map.cell.size / 2)
        context.arc(x, y, config.berry.size, 0, 2 * Math.PI );
        context.fill();
    }
}

let snake = {
    forward: {
        dx:0,
        dy:0
    },
    head: {
        x: 0,
        y: 10
    },
    maxTails: 3,
    tails: [],
    culcPosition: () => {
        snake.head.y += snake.forward.dy;
        snake.head.x += snake.forward.dx;
        if (berry.check(snake.head.x, snake.head.y)) {
            snake.maxTails ++
        }
        snake.collisionBorder()
    },
    draw:() => {
        snake.tails.unshift( { x: snake.head.x, y: snake.head.y } );
        if (snake.tails.length > snake.maxTails ) {
            snake.tails.pop();
        }
        snake.tails.forEach( (el, index) => {
            context.fillStyle = index? config.snake.tail.color : config.snake.head.color;
            if (index === 0) {
                context.beginPath();
                const x = el.x * config.map.cell.size + (config.map.cell.size / 2)
                const y = el.y * config.map.cell.size + (config.map.cell.size / 2)
                context.arc(x, y, config.berry.size, 0, 2 * Math.PI );
                context.fill();
            } else {
                context.fillRect(el.x * config.map.cell.size, el.y * config.map.cell.size, config.map.cell.size, config.map.cell.size );
            }



        })


    },
    collisionBorder:() => {
        if(snake.head.y > config.map.row) {
            snake.head.y = 0
            return
        }
        if(snake.head.x > config.map.col) {
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
    }
}

const canvas = document.getElementById("canvas")
canvas.style.backgroundSize = config.map.cell.size + "px"

canvas.setAttribute("width", config.map.col * config.map.cell.size + "px")
canvas.setAttribute("height", config.map.row * config.map.cell.size + "px")

let context = canvas.getContext("2d");


document.addEventListener("keydown", function (e) {
    if ( e.code === "KeyW" ) {
        snake.forward.dy = -1;
        snake.forward.dx = 0;
        return;
    }
    if ( e.code === "KeyA" ) {
        snake.forward.dy = 0;
        snake.forward.dx = -1;
        return;
    }
    if ( e.code === "KeyS" ) {
        snake.forward.dy = 1;
        snake.forward.dx = 0;
        return;
    }
    if ( e.code === "KeyD" ) {
        snake.forward.dy = 0;
        snake.forward.dx = 1;
        return;
    }
    if( e.code === "Space") {
        pause = !pause
    }
});


const getRandomInt = (min, max) => Math.floor( Math.random() * (max - min) + min )


berry.spawn();
const loop = () => {
    if(pause) return

    context.clearRect(0, 0, canvas.width, canvas.height);
    berry.draw();
    snake.culcPosition();
    snake.draw()
}

setInterval(loop, 120)
