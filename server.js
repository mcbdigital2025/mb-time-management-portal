const https = require("https");
const fs = require("fs");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log("Running on https://localhost:3000");
  });
});