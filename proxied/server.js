const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const jwt = require('jsonwebtoken');

const config = {
    name: 'sample-express-app', port: 4000,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  console.log("The auth header is: ");
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1]
  console.log("The token is: ");
  console.log(token);

  if (token == null) return res.sendStatus(401)

  console.log("Verifying token: ");
  console.log(process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    next()
  })
}

app.get('/auth/proxied',
  authenticateToken,
  (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message: "This is data proxied from the proxied service" }));
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
