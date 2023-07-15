import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Oi Beto");
});

app.listen(port, () => {
  console.log(`Deploy application running on port ${port}`);
});
