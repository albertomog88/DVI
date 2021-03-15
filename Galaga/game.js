var sprites = {
        ship: {sx:0, sy:0, w:38, h:43, frames:3},
        pinky: {sx:37, sy:0, w: 42, h:45, frames: 1}
};


var startGame = function() {
    Game.setBoard(0,new TitleScreen("Alien Invasion",
                                    "Press fire to start playing",
                                playGame));
}
    
var playGame = function() {
    var board = new GameBoard();
    board.add(new PlayerShip());
    Game.setBoard(0,board);
    
}


var playGame = function() { Game.setBoard(0,new PlayerShip()); }

window.addEventListener("load", function() {
    Game.initialize("game",sprites,startGame);
});
