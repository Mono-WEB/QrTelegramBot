require("dotenv").config();
const fs = require("fs");
const https = require("https");
const qr = require("qr-image");

// Reading QR Module
var qrCode = require("qrcode-reader");
var Jimp = require("jimp");

process.env.NTBA_FIX_319 = 1; //Fixing 319 bug
process.env.NTBA_FIX_350 = 1; //Fixing 350 bug File upload

const TelegramBot = require("node-telegram-bot-api");
// const { decode } = require("punycode");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const start = () => {
  bot.onText(/^./, (msg) => {
    if (msg.text == "/start") {
      bot.sendMessage(
        msg.chat.id,
        "Вітаю! Напиши текст і відправ мені, а я згенерую QR-code, або відправ мені QR-code, я розшифрую його"
      );
    } else if (msg.text) {
      // Generate QR-code
      let streamR = qr.image(msg.text, { type: "png", size: 30 });
      let streamW = fs.createWriteStream("qr.png");

      streamR.pipe(streamW);
      bot.sendMessage(msg.chat.id, "Готово...... 	✅");
      setTimeout(() => {
        bot.sendPhoto(msg.chat.id, "qr.png");
      }, 500);
    } else {
      console.log("1");
    }
  });

  // Reading QR and send message
  bot.on("document", function (msg) {
    let dataRes = "";
    const fileId = msg.document.file_id;
    const filePath = `https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${fileId}`;
    https.get(filePath, (res) => {
      res.on("data", (res) => {
        dataRes = JSON.parse(res).result.file_path;
        const getFile = `https://api.telegram.org/file/bot${process.env.TOKEN}/${dataRes}`;
        const fileDownload = fs.createWriteStream("downloadFile.jpg");

        https.get(getFile, (res) => {
          res.pipe(fileDownload);
        });

        setTimeout(() => {
          function generateQr() {
            let buffer = fs.readFileSync(__dirname + "/downloadFile.jpg");
            Jimp.read(buffer, function (err, image) {
              if (err) {
                bot.sendMessage(
                  msg.chat.id,
                  "Надішлість файл в форматі jpeg/jpg/png"
                );
              }
              let qrR = new qrCode();
              qrR.callback = function (err, value) {
                if (value) {
                  bot.sendMessage(msg.chat.id, value.result);
                } else {
                  bot.sendMessage(msg.chat.id, "Ви надіслали не QR код");
                }
              };
              if (image != undefined) {
                qrR.decode(image.bitmap);
              }
            });
          }

          generateQr();
        }, 1000);
      });
    });
  });
};

start();
