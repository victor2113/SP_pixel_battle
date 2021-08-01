//TODO LIST
// 1) Прикрутить разделение сторон.
// 2) Фикс лидеров в центре поля.

function checkGameOver() {
    return (!board.player_left.field.grid[1][1].object || !board.player_right.field.grid[1][1].object);
}

function resetBuffer() {
    mouse.buffer1.isSelected = false;
    mouse.buffer2.isSelected = false;
    mouse.buffer1 = null;
    mouse.buffer2 = null;
}

function replaceContent() {
    let temp = mouse.buffer1.object;
    mouse.buffer1.object = mouse.buffer2.object;
    mouse.buffer2.object = temp;
    resetBuffer();
}

function listenAction(i) {

    let currentPlayer;
    let opposite;
    if (board.priority) {
        currentPlayer = board.player_left;
        opposite = board.player_right

    } else {
        currentPlayer = board.player_right;
        opposite = board.player_left;
    }

    switch (i) {
        case 0: {
            if (currentPlayer.hand.hand.length < 5 && currentPlayer.deck.cards.length > 0) {
                currentPlayer.hand.add_card(currentPlayer.deck.cards.splice(0, 1));
                currentPlayer.actions -= 1;
            } else {
                alert("Вы не можете взять карту!");
            }
            break;
        }
        case 1: {
            alert("Разыграйте героя.");
            if (currentPlayer.field.countCards < 9 && currentPlayer.hand.hand.length > 0) {
                mouse.activeAction = 1;

                if ((mouse.buffer1 && mouse.buffer2) &&
                    (mouse.buffer1.location === "hand" && mouse.buffer2.location === "grid") && (!mouse.buffer2.object)) {
                    replaceContent();
                    currentPlayer.field.countCards += 1;
                }
                //mouse.activeAction = -1;
                currentPlayer.actions -= 1;
            }
            else {
                alert("Вы не можете разыграть героя!");
            }
            break;
        }
        case 2: {
            alert("Выберите героя, которым будете атаковать.");
            //     mouse.activeAction = 2;
                if ((mouse.buffer1 && mouse.buffer2) &&
                    (mouse.buffer1.location === "grid" && mouse.buffer2.location === "grid") &&
                    (mouse.buffer1.object && mouse.buffer2.object)) {
                    mouse.buffer2.object.hp -= mouse.buffer1.object.damage;
                    if (mouse.buffer2.object.hp <= 0) {
                        opposite.field.countCards -= 1;
                        mouse.buffer2.object = null;
                    }
                }

                resetBuffer();

                if (checkGameOver()) {
                    alert("Game over!");
                    alert("Restart game?");
                    location.reload();
                }
                mouse.activeAction = -1;
                currentPlayer.actions -= 1;
            break;
        }
        case 3: {
            alert("Переместите героя.");
            if (currentPlayer.field.countCards < 9) {
                //mouse.activeAction = 3;

                if ((mouse.buffer1 && mouse.buffer2) &&
                    (mouse.buffer1.location === "grid" && mouse.buffer2.location === "grid")) {
                    currentPlayer.actions -= 1;
                    replaceContent();
                }

                //mouse.activeAction = -1;
            }
            else {
                alert("Нет доступных героев для перемещения!");
            }
            break;
        }
        case 4: {
            currentPlayer.actions -= 2;
            break;
        }
    }
    if (currentPlayer.actions < 1){
        board.priority = !board.priority;
        currentPlayer.actions = 2;
    }
}


board = new Board("Red", "Blue");
menu = new Menu();

board.player_left.deck.shuffleDeck();
board.player_right.deck.shuffleDeck();

board.player_left.hand.add_card(board.player_left.deck.cards.splice(0, 5));
board.player_right.hand.add_card(board.player_right.deck.cards.splice(0, 5));

//лидеры ставятся на свои места
board.player_left.field.grid[1][1].object = new Knight();
board.player_right.field.grid[1][1].object = new Healer();

//tests
// board.player_right.field.grid[2][1].object = new Shooter();
// board.player_left.field.grid[0][0].object = new Homunculus();

animate();

