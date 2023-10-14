function ConvertHandler() {
  this.getNum = function (input) {
    const regex = /[a-zA-Z]/;
    const num = input.split(regex);
    let result;

    // The result is not equal to any variable set result to invalid number
    if (num[0] !== "") {
      if (num[0].includes("/")) {
        result =
          num[0].split("/").length !== 2 ? "invalid number" : eval(num[0]);
      } else {
        result = parseFloat(num[0]);
      }
    } else {
      result = 1;
    }
    return result;
  };

  this.getUnit = function (input) {
    const regex = /[a-zA-Z]+$/;
    const unit = input.match(regex);
    //console.log(unit[0]);
    let result;
    if (
      unit &&
      ["gal", "lbs", "mi", "l", "kg", "km"].includes(
        String(unit[0])?.toLowerCase()
      )
    ) {
      result = unit[0];
      if (result === "l") result = "L";
    } else {
      result = "invalid unit";
    }

    return result;
  };

  this.getReturnUnit = function (initUnit) {
    let result;

    switch (initUnit.toLowerCase()) {
      case "gal":
        result = "L";
        break;
      case "lbs":
        result = "kg";
        break;
      case "mi":
        result = "km";
        break;
      case "l":
        result = "gal";
        break;
      case "kg":
        result = "lbs";
        break;
      case "km":
        result = "mi";
        break;
    }
    return result;
  };

  this.spellOutUnit = function (unit) {
    let result;
    switch (unit.toLowerCase()) {
      case "gal":
        result = "gallons";
        break;
      case "lbs":
        result = "pounds";
        break;
      case "mi":
        result = "miles";
        break;
      case "l":
        result = "liters";
        break;
      case "kg":
        result = "kilograms";
        break;
      case "km":
        result = "kilometers";
        break;
      default:
        result = "invalid unit";
    }

    return result;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    switch (initUnit.toLowerCase()) {
      case "gal":
        result = initNum * galToL;
        break;
      case "lbs":
        result = initNum * lbsToKg;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "l":
        result = initNum / galToL;
        break;
      case "kg":
        result = initNum / lbsToKg;
        break;
      case "km":
        result = initNum / miToKm;
        break;
      default:
        result = undefined;
    }

    return parseFloat(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result;

    result = `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;

    return result;
  };
}

module.exports = ConvertHandler;
