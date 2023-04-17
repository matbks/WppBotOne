const phone = require("libphonenumber-js");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const client = new Client({
  args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
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

app.post("/register", (req, res) => {
  var correctNumber = validNumber(req.body.number);
    console.log(correctNumber)
  if (correctNumber) {
  
    client.sendMessage(correctNumber, "Obrigado! Seu ponto foi registrado agora " + today() + " às " + now() + ".");
  } else {
    console.log("Falha no registro");
  }
  res.status(200).send("Message received!");
});

app.listen(3002, () => {
  console.log("Web API listening on port 3002");
});

function today() {

  var date = new Date()
  
  const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      aa: date.getFullYear().toString().slice(-2),
      aaaa: date.getFullYear()
  }
  var format = 'dd/mm/aa';
  
  return format.replace(/mm|dd|aa|aaaa/gi, matched => map[matched])
} 

function now() {
  var date = new Date();
  var options = { timeZone: 'America/Sao_Paulo', hour12: false };
  var time = date.toLocaleString('en-US', options).split(' ')[1];
  return time;
}

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

  if (phoneNumber.length == 17) {
    console.info("Número válido ");
    console.info(phoneNumber);
  } else {
    console.info("Número inválido");
    console.info(phoneNumber);
    phoneNumber = "";
  }

  return phoneNumber;
}
