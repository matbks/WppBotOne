const phone = require("libphonenumber-js");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const bodyParser = require("body-parser");
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
  //   if(message.body = 'Oi'){
  //     message.reply(`Please stop bothering me`);
  //   }
});

client.initialize();

app.use(bodyParser.json());

app.post("/message", (req, res) => {
  var correctNumber = validNumber(req.body.number);
    console.log(correctNumber)
  if (correctNumber) {
    client.sendMessage(correctNumber, "Obrigado! Seu ponto foi registrado.");
  } else {
    console.log("Falha no registro");
  }
  res.status(200).send("Message received!");
});

app.listen(3000, () => {
  console.log("Web API listening on port 3000");
});

function validNumber(phoneNumber) {
  console.log("Validando", phoneNumber);
  phoneNumber =
    phone
      .parsePhoneNumber(phoneNumber, "BR")
      ?.format("E.164")
      ?.replace("+", "")
      ?.replace("-", "") || "";

  phoneNumber = phoneNumber.includes("55") ? phoneNumber : `55${phoneNumber}`;

  console.info("sera se tem 9", phoneNumber);
  console.info(phoneNumber[4]);
  if (phoneNumber.length < 13) {
    console.info("não tem nove adicional", phoneNumber);
    
  } else{
    phoneNumber = phoneNumber.slice(0, 4) + phoneNumber.slice(5);
  }

  phoneNumber = phoneNumber.includes("@c.us")
    ? phoneNumber
    : `${phoneNumber}@c.us`;

  if (phoneNumber.length == 18) {
    console.info("Número válido ");
    console.info(phoneNumber);
  } else {
    console.info("Número inválido");
    console.info(phoneNumber);
    phoneNumber = "";
  }

  return phoneNumber;
}
