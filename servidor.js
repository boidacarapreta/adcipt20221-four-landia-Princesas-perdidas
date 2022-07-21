const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origins: [
      "https://princesasperdidas.ifsc.cloud",
      "https://*.gitpod.io"
    ],
  },
});
const PORT = process.env.PORT || 3000;
/*var jogadores = {
  primeiro: undefined,
  segundo: undefined,
};*/

//Perguntar pro professor se é aq q eu vou conseguir colocar a ordem do q aparece.
//Por exemplo, para aparecer a cena de explicação do jogo.

// Disparar evento quando jogador entrar na partida
io.on("connection", (socket) => {
  // Aguardar pelo jogador enviar o nome da sala
  socket.on("entrar-na-sala", (sala) => {
    socket.join(sala);
    var jogadores = {};
    if (io.sockets.adapter.rooms.get(sala).size === 1) {
      // 1 jogador
      jogadores = {
        primeiro: socket.id,
        segundo: undefined,
      };
    } else if (io.sockets.adapter.rooms.get(sala).size === 2) {
      // 2 jogadores
      let [primeiro] = io.sockets.adapter.rooms.get(sala);
      jogadores = {
        primeiro: primeiro,
        segundo: socket.id,
      };
    }
    console.log("Sala %s: %s", sala, jogadores);
    // Envia a todos a lista atual de jogadores (mesmo incompleta)
    io.to(sala).emit("jogadores", jogadores);
  });
  
  // Sinalização de áudio: oferta
  socket.on("offer", (socketId, description) => {
    socket.to(socketId).emit("offer", socket.id, description);
  });

  // Sinalização de áudio: atendimento da oferta
  socket.on("answer", (socketId, description) => {
    socket.to(socketId).emit("answer", description);
  });

  // Sinalização de áudio: envio dos candidatos de caminho
  socket.on("candidate", (socketId, signal) => {
    socket.to(socketId).emit("candidate", signal);
  });


  socket.on("estadoDoJogador", (estado) => {
    socket.broadcast.emit("desenharOutroJogador", estado);
  });
  
  // Disparar evento quando jogador sair da partida
  socket.on("disconnect", () => {
    if (jogadores.primeiro === socket.id) {
      jogadores.primeiro = undefined;
    }
    if (jogadores.segundo === socket.id) {
      jogadores.segundo = undefined;
    }
    io.emit("jogadores", jogadores);
    console.log("-Lista de jogadores: %s", jogadores);
  });
});

// Abrir porta para HTTPS/WSS
app.use(express.static("./"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
