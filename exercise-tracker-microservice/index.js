const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const validUrl = require("valid-url");
var bodyParser = require("body-parser");
var objectid = require("objectid");

/* ********** DATABASE ********** */
const connectDB = () => {
  const db = new sqlite3.Database(
    "./db/tracker.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the database.");
    }
  );

  return db;
};

const initializeDB = () => {
  const db = connectDB();
  db.run(
    "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, userId TEXT, username TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS exercises(exec_id INTEGER PRIMARY KEY, userId TEXT, description TEXT, duration INTEGER, date TEXT)"
  );
  db.close();

  console.log("Initialize database.");
};

/**
 * Get list of users
 * @returns
 */
const getUsers = (isInternal) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();
    return db.all("SELECT userId, username FROM users", [], (err, rows) => {
      if (err) {
        console.log("DB Error: Query failed: ", err.message);
        return reject(err.message);
      }
      console.log("Users has found into the users table.");
      db.close();

      if (isInternal === true) {
        return resolve(rows);
      }

      return resolve(
        rows.map((row) => ({
          _id: row.userId,
          username: row.username,
        }))
      );
    });
  });
};

/**
 * Insert new User
 * @param {*} user
 * @returns
 */
const insertNewUser = (username) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();
    const userId = objectid().toString();
    return db.run(
      "INSERT INTO users(userId, username) VALUES(?, ?)",
      [userId, username],
      (err) => {
        if (err) {
          console.log("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        console.log("A row has been inserted into the users table.");
        db.close();

        return resolve({
          username: username,
          _id: userId,
        });
      }
    );
  });
};

/**
 * Insert new exercise
 * @param {*} userId
 * @param {*} exerciseData
 * @returns
 */
const insertNewExercise = (userId, exerciseData) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();

    let date = new Date();
    if (exerciseData.date?.length > 0) {
      date = new Date(exerciseData.date);
    }

    return db.run(
      "INSERT INTO exercises(userId, description, duration, date) VALUES(?, ?, ?, ?)",
      [userId, exerciseData.description, exerciseData.duration, date],
      (err) => {
        if (err) {
          console.log("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        console.log("A row has been inserted into the exercises table.");
        db.close();

        (async () => {
          const users = await getUsers(true);
          const userData = users.find((user) => user.userId === userId);

          return resolve({
            username: userData.username,
            description: exerciseData.description,
            duration: Number(exerciseData.duration),
            date: date.toDateString(),
            _id: userId,
          });
        })();
      }
    );
  });
};

/**
 * Get list of logs
 * @param {*} userId
 * @returns
 */
const getLogs = (userId) => {
  return new Promise((resolve, reject) => {
    const db = connectDB();
    return db.all(
      "SELECT description, duration, date FROM exercises WHERE userId = ?",
      [userId],
      (err, rows) => {
        if (err) {
          console.log("DB Error: Query failed: ", err.message);
          return reject(err.message);
        }
        console.log("Exercises has found into the exercises table.");
        db.close();

        (async () => {
          const users = await getUsers(true);
          const userData = users.find((user) => user.userId === userId);

          return resolve({
            username: userData.username,
            count: rows.length,
            _id: userId,
            log: rows.map((row) => ({
              description: row.description,
              duration: Number(row.duration),
              date: new Date(Number(row.date)).toDateString(),
            })),
          });
        })();
      }
    );
  });
};

/* SET THE API  ENDPOINTS */
const port = process.env.PORT || 3000;
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
app.use(express.json());

// Endpoints
app.post("/api/users", async function (req, res) {
  console.log(req.body);

  const result = await insertNewUser(req.body.username);
  if (result?.username) {
    res.json(result);
  } else {
    res.json({
      error: "Username is required",
    });
  }
});

app.get("/api/users", async function (req, res) {
  try {
    const users = await getUsers();
    console.log(users);

    if (users && users.length > 0) {
      return res.json(users);
    } else {
      return res.json("No found users");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

app.post("/api/users/:id?/exercises", async function (req, res) {
  console.log(req.params.id, req.body);

  const result = await insertNewExercise(req.params.id, req.body);
  if (result?.username) {
    res.json(result);
  } else {
    res.json({
      error: "Can't save exercise",
    });
  }
});

app.get("/api/users/:id?/logs", async function (req, res) {
  try {
    const resultLog = await getLogs(req.params.id);
    console.log(resultLog);

    if (resultLog && resultLog?.username) {
      return res.json(resultLog);
    } else {
      return res.json("No found logs");
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
