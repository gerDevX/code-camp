const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Endpoints
app.post("/api/fileanalyse", upload.single("upfile"), (req, res, next) => {
  return res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

// listen for requests :)
var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
