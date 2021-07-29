function checkMouseCollision(x, y, w, h, posX, posY) {
    return (x < posX && (x + w) > posX && y < posY && (y + h) > posY);
}

class Menu {
    constructor() {
        this.actions = [
            {title: "Взять карту из колоды", y: 0},
            {title: "Разыграть карту", y: 0},
            {title: "Атака", y: 0},
            {title: "Заклинание", y: 0},
            {title: "Приказ", y: 0},
            {title: "Убрать тело", y: 0},
            {title: "Передвинуть карту", y: 0},
            {title: "Рокировка", y: 0},
            {title: "Пас", y: 0}
        ];
        this.index = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; i++) {
            this.actions[i].y = this.index[i] * 40;
        }

        this.x = CANVAS_WIDTH - 340;
        this.width = 340;
        this.height = 40;
    }

    drawMenu() {
        ctx.font = "32px Verdana";
        ctx.textAlign = "right";
        for (let i = 0; i < 9; i++) {
            if (checkMouseCollision(this.x, this.actions[i].y - 40, this.width, this.height, mouse.x, mouse.y)) {
                ctx.fillStyle = "#f59a9a";

            } else {
                ctx.fillStyle = "rgba(255,255,255,0.4)";
            }
            ctx.fillText(this.actions[i].title, CANVAS_WIDTH - 5, this.actions[i].y, this.width);
        }
    }
}

class MouseControls {
    constructor(container = document.body) {
        this.container = container;

        this.x = 0;
        this.y = 0;

        this.isPressed = false;
        this.isDawn = false;
        this.isUp = false;

        container.addEventListener('mouseup', event => this.changeState(event));
        container.addEventListener('mousedown', event => this.changeState(event));
        container.addEventListener('mousemove', event => this.changeState(event));
        container.addEventListener('mousewheel', event => this.changeState(event));
        container.addEventListener('mouseleave', event => this.changeState(event));
        container.addEventListener('contextmenu', event => this.changeState(event));
    }

    changeState(event) {
        // console.log(event.type);

        this.x = event.offsetX;
        this.y = event.offsetY;

        if (event.type === 'mousedown') {
            this.isPressed = true;
            this.isDawn = true;
            this.isUp = false;
        } else if (event.type === 'mouseup' || event.type === 'mouseleave') {
            this.isPressed = false;
            this.isDawn = false;
            this.isUp = true;
        } else if (event.type === 'contextmenu' || event.type === 'mousewheel') {
            event.preventDefault();
        }
    }

    update() {
        this.isDawn = false;
        this.isUp = false;
    }
}


class Container {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.object = null;

        this.isControl = false;
        this.isPressed = false;
        this.isSelected = false;

        this.firstColor = '#00ff00';
        this.secondColor = '#0000ff';
        this.thirdColor = '#ff0000';
    }

    drawContent() {
        this.Hover();
        if (this.object)
            ctx.drawImage(this.object.img, this.x, this.y, this.width, this.height);
    }

    // пока получилась смешанная функция, позже нужно доработать
    Hover() {
        ctx.lineWidth = 3;
        if (checkMouseCollision(this.x, this.y, this.width, this.height, mouse.x, mouse.y)) {
            this.isControl = true;
            if (mouse.isDawn) {
                console.log('container pressed');
                this.isPressed = true;

            } else if (this.isPressed && mouse.isUp) {
                this.isPressed = false;
                this.isSelected = !this.isSelected;
                // selectedCards.push(board.player_left.field.grid[i][j]);
                // console.log(selectedCards);
            }

        } else {
            // console.log('out container');
            this.isControl = false;
        }

        if (this.isSelected)
            ctx.strokeStyle = this.thirdColor;

        else
            ctx.strokeStyle = this.firstColor;

        if (this.isControl)
            ctx.strokeStyle = this.secondColor;

        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawZoom() {

    }
}


class Field {
    constructor(position) {
        this.grid = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        for (let i = 0; i < 3 * (X_SIZE); i += X_SIZE) {
            for (let j = 0; j < 3 * (Y_SIZE); j += Y_SIZE)
                this.grid[i / (X_SIZE)][j / (Y_SIZE)] = new Container(eval("BEGIN_" + position + "_GRID_X") + i, BEGIN_GRID_Y + j, CARD_WIDTH, CARD_HEIGHT)
        }

    }

    drawGrid() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.grid[i][j].drawContent();
            }
        }
    }
}


class Hand {
    constructor() {
        this.hand = []
    }

    add_card(card) {
        this.hand.push(card)
    }

    delete_card(index) {
        if (index >= this.hand.length) {
            this.hand.splice(index, 1);
        }
    }
}


class Deck {
    constructor(cards) {
        this.cards = cards;
    }

    shuffleDeck() {
        cards.sort(() => Math.random() - 0.5);
    }

    drawCard() {
        let topCard = this.cards[0];
        this.cards.splice(0, 1);
        return topCard;
    }
}


class Player {
    constructor(name, position) {
        this.position = position;
        this.name = name;
        this.hand = new Hand();
        this.field = new Field(position);
        this.deck = new Deck();
        this.discard = [];
    }
}


class Board {
    constructor(name1, name2) {
        this.player_left = new Player(name1, "LEFT");
        this.player_right = new Player(name2, "RIGHT");
    }

    drawBoard() {
        this.player_left.field.drawGrid();
        this.player_right.field.drawGrid();
    }
}