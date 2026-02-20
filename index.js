import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

app.get("/ping", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
