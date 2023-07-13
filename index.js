const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});

app.get("/", (req, res) => res.json("Oi, eu sou o Goku!"));

app.post("/upload-file", (req, res) => {
  res.send(req.body.arquivo);
});
