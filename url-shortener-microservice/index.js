const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const validUrl = require("valid-url");
var bodyParser = require("body-parser");
const shortId = require("shortid");

/* ********** DATABASE ********** */
const connectDB = () => {
  const db = new sqlite3.Database(
    "./db/shortner.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the shortner database.");
    }
  );

  return db;
};

const initializeDB = () => {
  const db = connectDB();
  db.run(
    "CREATE TABLE IF NOT EXISTS shortnerData(contact_id INTEGER PRIMARY KEY, originalUrl TEXT, shortUrl TEXT)"
  );
  db.close();

  console.log("Initialize shortner database.");
};

/**
 * Get the URL by the shortner code
 * @param {*} shortCode
 * @returns
 */
const selectShortnerDataByCode = (shortCode) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();
    return db.get(
      "SELECT originalUrl FROM shortnerData WHERE shortUrl = ?",
      [shortCode],
      (err, row) => {
        if (err) {
          console.log("DB Error: Query failed: ", err.message);
          return reject(err.message);
        }
        console.log("A row has found into the shortner table.");
        db.close();

        return resolve(row);
      }
    );
  });
};

/**
 * Insert URL to get the shortner code
 * @param {*} originalUrl
 * @param {*} shortUrl
 * @returns
 */
const insertShortnerData = (originalUrl, shortUrl) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();
    return db.run(
      "INSERT INTO shortnerData(originalUrl, shortUrl) VALUES(?, ?)",
      [originalUrl, shortUrl],
      (err) => {
        if (err) {
          console.log("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        console.log("A row has been inserted into the shortner table.");
        db.close();

        return resolve("done");
      }
    );
  });
};

/* SET THE API  ENDPOINTS */
const port = process.env.PORT || 3000;
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.json());

// Endpoints
app.post("/api/shorturl", async function (req, res) {
  const url = req.body.url;
  const shortURL = shortId.generate();

  console.log(JSON.stringify(req.body));

  if (!validUrl.isWebUri(url)) {
    res.status(401).json({
      error: "invalid url",
    });
  } else {
    await insertShortnerData(url, shortURL);
    res.json({
      original_url: url,
      short_url: shortURL,
    });
  }
});

app.get("/api/shorturl/:short_url?", async function (req, res) {
  try {
    const resultURL = await selectShortnerDataByCode(req.params.short_url);
    if (resultURL) {
      return res.redirect(resultURL.originalUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

// listen for requests :)
const listener = app.listen(port, function () {
  initializeDB();
  console.log("Your app is listening on port " + listener.address().port);
});
