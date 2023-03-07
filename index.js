const rebate = document.getElementById('rebate')
const computerWins = document.getElementById('computerWins')
const playerWins = document.getElementById('playerWins')
const btn = document.getElementById('btn')
const btn2 = document.getElementById('btn2')
const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const tenis = document.getElementById('tenis')
btn2.style.display = 'none'
p1.style.display = 'none'
p2.style.display = 'none'
btn.addEventListener('click', function () {
    btn.style.display = 'none'
    tenis.style.display = 'none'
    canvasEl.style.display = 'block'
    setup()
    main()
})
btn2.addEventListener('click', function () {
    btn.style.display = 'none'
    canvasEl.style.display = 'block'   
    btn2.style.display = 'none'
    p1.style.display = 'none'
    p2.style.display = 'none'
    ball._restoreSpeed()
    rightPadle._restoreSpeed()

})


const canvasEl = document.querySelector("canvas"), canvasCtx = canvasEl.getContext("2d")
//pontuação

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function () {
        this.human++
        switch (this.human) {
            case 3:
                ball._stop()
                rightPadle._stop()
                this.human = 0
                this.computer = 0
                playerWins.play()
                canvasEl.style.display = 'none'
                btn2.style.display = 'block'
                p1.style.display = 'block'
                break
        }

    },
    increaseComputer: function () {
        this.computer++
        switch (this.computer) {
            case 3:
                ball._stop()
                rightPadle._stop()
                this.human = 0
                this.computer = 0
                computerWins.play()
                canvasEl.style.display = 'none'
                btn2.style.display = 'block'
                p2.style.display = 'block'
                break
        }

    },
    // escrevendo ultilizando o canvas
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 2 + field.w / 4, 50)
    }
}
//mouse
const mouse = {
    x: 0,
    y: 0
}
//Campo
const field = {
    w: window.innerWidth, // representa a largura total da tela
    h: window.innerHeight, // representa a altura total da tela
    draw: function () {
        //definindo a cordo do campo
        canvasCtx.fillStyle = '#286047'
        //definindo o tamanho do campo
        canvasCtx.fillRect(0, 0, this.w, this.h)
    }
}
//Linha central
const line = {
    w: 15,
    h: field.h,
    draw: function () {
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }

}
//Raquete esquerda
const leftPadle = {
    x: 10,
    y: field.h / 2,
    w: line.w,
    h: 200,
    _move: function () {

        this.y = mouse.y
    },
    draw: function () {
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}
//Raquete direita
const rightPadle = {
    x: field.w - line.w - 10,
    y: field.h / 2,
    w: line.w,
    speed: 1,
    h: 200,
    _restoreSpeed: function () {
        this.speed = 1
    },
    _stop: function () {
        this.speed = 0
    },
    _speedUp: function () {
        this.speed++
    },
    _move: function () {
        if (this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed
        } else {
            this.y -= this.speed
        }

    },

    draw: function () {
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
}
//Bola
const ball = {
    x: field.w / 2,
    y: field.h / 2,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _restoreSpeed: function () {
        this.speed = 5
        this.directionX = 1
        this.directionY = 1
    },_stop: function () {
        this.speed = 0
        this.directionX = 0
        this.directionY = 0
    },
    _callPosition: function () {
        // verifica se o jogador 1 (humano)  fez um ponto
        if (this.x > field.w - this.r - rightPadle.w - 10) {
            // calcula  posição da raquete no eixo y
            if (this.y + this.r > rightPadle.y && this.y - this.r < rightPadle.y + rightPadle.h) {
                // rebater a bola
                this._reverseX()
                this._speedUp()
                rebate.play()
            } else {
                // fazer o ponto
                score.increaseHuman()

                this._pointUp()
            }


        }
        // verifica se o jogador 2 (computador)  fez um ponto
        if (this.x < this.r + leftPadle.w + 10) {
            // calcula  posição da raquete no eixo y
            if (this.y + this.r > leftPadle.y &&
                this.y - this.r < leftPadle.y + leftPadle.h) {
                // rebater a bola
                this._reverseX()
                rebate.play()
            } else {
                // fazer o ponto
                score.increaseComputer()

                this._pointUp()
            }


        }
        //calcula a posição vertical  da bola (eixo y)
        if (
            (this.y - this.r < 0 && this.directionY < 0) || (this.y > field.h - this.r && this.directionY > 0)) {
            this._reverseY()
        }

    },

    _reverseY: function () {
        this.directionY *= -1
    },
    _reverseX: function () {
        this.directionX *= -1


    },
    _speedUp: function () {
        this.speed += 1.5
    },
    _pointUp: function () {
        this.x = field.w / 2
        this.y = field.h / 2
        rightPadle._speedUp()
    },
    _move: function () {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },
    draw: function () {
        canvasCtx.fillStyle = '#ffffff'
        canvasCtx.beginPath()
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasCtx.fill()
        this._callPosition()
        this._move()

    }
}

//função de configurações
function setup() {
    canvasEl.width = canvasCtx.width = window.innerWidth
    canvasEl.height = canvasCtx.height = window.innerHeight


}

if (score.human > 14) {
    score.human = 0
    score.computer = 0
}
//Função que desenha os elementos no campo
function draw() {
    //desenhando os elementos

    field.draw()
    line.draw()
    leftPadle.draw()
    rightPadle.draw()
    ball.draw()
    score.draw()


}




// animação suave
window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}


canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX
    mouse.y = e.pageY
})