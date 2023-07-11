const express = require("express");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});

app.get("/", (req, res) => res.json("Oi, eu sou o Goku!"));
