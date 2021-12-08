  var buffer = fs.readFileSync(__dirname + '/qr1.png');

  Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
    }
    let qrcode = new qrCode();
    qrcode.callback = function(err, value) {
        if (err) {
            console.error(err);
        }
        console.log(value.result);
    };
    // Decoding the QR code
    qrcode.decode(image.bitmap);
});


// bot.on('voice', (msg)=>{
//         bot.getFile(msg.voice.file_id, () => {
//             bot.getFile(voiceId).then((resp) => {
//                 {
//                     file_id = 'file_id',
//                         file_size = 6666,
//                     file_path = 'file_path'
//                 }
//                 bot.getFileLink(voiceId).then((resp) => {
//                     'https://api.telegram.org/file/bot<BOT_TOKEN>/<file_path>'
//                 });
//             });
//         });