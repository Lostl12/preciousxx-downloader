import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/ping", (req, res) => {
  res.send("Server is alive");
});

app.listen(PORT, () => console.log("Server running on " + PORT));
