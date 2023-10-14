"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function (req, res) {
    var input = req.query.input;
    var initNum = convertHandler.getNum(input);
    var initUnit = convertHandler.getUnit(input);

    // console.log("initNum ==>", initNum);
    // console.log("initUnit ==>", initUnit);

    var invalidNumber = !initNum || initNum === "invalid number";
    var invalidUnit = !initUnit || initUnit === "invalid unit";

    if (invalidNumber && invalidUnit) {
      return res.json({ error: "invalid number and unit" });
    }
    if (invalidNumber) {
      return res.json({ error: "invalid number" });
    }
    if (invalidUnit) {
      return res.json({ error: "invalid unit" });
    }

    var returnNum = convertHandler.convert(initNum, initUnit);
    var returnUnit = convertHandler.getReturnUnit(initUnit);
    var toString = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    //res.json
    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string: toString,
    });
  });
};
