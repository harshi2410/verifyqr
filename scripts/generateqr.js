const QRCode = require("qrcode");

QRCode.toFile(
  "public/master-qr.png",
  "bdksn439840394r-2473847fwjekf-3948fn",
  {
    width: 800,
    margin: 2,
  },
  (err) => {
    if (err) throw err;
    console.log("Master QR Generated");
  }
);