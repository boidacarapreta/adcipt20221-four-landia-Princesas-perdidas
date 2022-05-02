// Importar a próxima cena
import { cena2 } from "./cena2.js";

// Criar a cena 3
var cena4 = new Phaser.Scene("Cena 4");

cena4.preload = function () {
// Imagem de fundo
    this.load.image("fundo", "assets/preto.jpg");
    this.load.image("madeira", "assets/maa.jpg");
};

cena4.create = function () {
//fundo preto
    this.add.image(400, 300, "fundo");   
    
    this.add.image(100, 300, "maa");
    this.add.image(200, 300, "maa");
    this.add.image(300, 300, "maa");
    this.add.image(400, 500, "maa");
    this.add.image(500, 100, "maa");

};

cena4.update = function () {
};

export { cena4 };
