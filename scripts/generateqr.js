const QRCode = require("qrcode");

QRCode.toFile(
  "public/master-qr.png",
  "https://flearaasqr.netlify.app/login",
  {
    width: 800,
    margin: 2,
  },
  (err) => {
    if (err) throw err;
    console.log("Master QR Generated");
  }
);