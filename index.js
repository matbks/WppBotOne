const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const client = new Client({
  authStrategy: new LocalAuth(),
});
 
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});
 
client.on("ready", () => {
  console.log("Client is ready!");     
});
 
client.on("message", (message) => {
  if(message.body = 'Oi'){
    message.reply(`Please stop bothering me`);
  }
});
 
client.initialize();

app.use(bodyParser.json());

app.post('/message', (req, res) => { 
  client.sendMessage(req.body.number, "Obrigado! Seu ponto foi registrado."); 
  res.status(200).send('Message received!');
});

app.listen(3000, () => {
  console.log('Web API listening on port 3000');
});