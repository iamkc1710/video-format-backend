const http = require('http');
const bodyparser = require('body-parser')
const express = require('express');
const indexRouter = require("./routes/index");
const {generateToken, authenticateToken} = require("./services/authentication");
const path = require('path')

const app = express();

const cors = require('cors');
const sqlite3 = require('sqlite3');

const corsOptions = {
    origin:'http://localhost:3000', // Frontend app server
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
// app.use(bodyparser.json())
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'text/plain');
});

const port = 8080;

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}/`);
});
