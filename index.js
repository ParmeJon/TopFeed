const express = require("express");
const app = express();
const oauthRouter = require('./routes/oauth')
const http = require("http");

app.use(express.json());
app.use(oauthRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send("Hello World!!"); // test message
});

app.get("/auth", (req, res) => {
  
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});