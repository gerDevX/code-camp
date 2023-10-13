const express = require("express");
const requestIp = require("request-ip");

const app = express();

// inside middleware handler
const ipMiddleware = function (req, res, next) {
  const clientIp = requestIp.getClientIp(req);
  next();
};

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

//As Connect Middleware
app.use(requestIp.mw());

// Endpoints
app.get("/api/whoami", function (req, res) {
  const ipadress = req.clientIp;
  const language = req.acceptsLanguages();
  const software = req.get("User-Agent");

  res.json({
    ipadress: ipadress,
    language: language[0],
    software: software,
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
