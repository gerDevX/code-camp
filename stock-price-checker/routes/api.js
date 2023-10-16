'use strict';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const Stock = require('./../models').Stock;

module.exports = function (app) {
  app.route('/api/stock-prices').get(function (req, res) {
    let responseObject = {};
    responseObject['stockData'] = {};

    // Variable to determine number of stocks
    let twoStocks = false;

    /* Output Response */
    const outputResponse = () => {
      return res.json(responseObject);
    };

    /* Find/Update Stock Document */
    const findOrUpdateStock = (stockName, documentUpdate, nextStep) => {
      (async () => {
        try {
          const stockDocument = await Stock.findOneAndUpdate(
            { name: String(stockName).toLowerCase() },
            documentUpdate,
            { new: true, upsert: true },
          );

          if (stockDocument) {
            if (twoStocks === false) {
              return nextStep(stockDocument, processOneStock);
            } else {
              return nextStep(stockDocument, processTwoStocks);
            }
          }

          res.json({ msg: 'Cant Find/Update Stock Document' });
        } catch (error) {
          console.log(error);
          res.json({ error: error });
        }
      })();
    };

    /* Like Stock */
    const likeStock = (stockName, nextStep) => {
      (async () => {
        try {
          const stockDocument = await Stock.findOne({
            name: String(stockName).toLowerCase(),
          });

          if (
            stockDocument &&
            stockDocument['ips'] &&
            stockDocument['ips'].includes(req.ip)
          ) {
            return res.send('Error: Only 1 Like per IP Allowed');
          } else {
            const documentUpdate = {
              $inc: { likes: 1 },
              $push: { ips: req.ip },
            };
            nextStep(stockName, documentUpdate, getPrice);
          }
        } catch (error) {
          console.log(error);
          res.json({ error: error });
        }
      })();
    };

    /* Get Price */
    const getPrice = (stockDocument, nextStep) => {
      const xhr = new XMLHttpRequest();
      const requestUrl =
        'https://stock-price-checker.freecodecamp.rocks/api/stock-prices?stock=' +
        stockDocument['name'];
      xhr.open('GET', requestUrl, true);
      xhr.onload = () => {
        const apiResponse = JSON.parse(xhr.responseText);
        //console.log(apiResponse['stockData']);

        stockDocument['price'] = apiResponse['stockData'].price;
        nextStep(stockDocument, outputResponse);
      };
      xhr.send();
    };

    /* Build Response for 1 Stock */
    const processOneStock = (stockDocument, nextStep) => {
      responseObject['stockData']['stock'] = stockDocument['name'];
      responseObject['stockData']['price'] = stockDocument['price'];
      responseObject['stockData']['likes'] = stockDocument['likes'];
      nextStep();
    };

    let stocks = [];

    /* Build Response for 2 Stocks */
    const processTwoStocks = (stockDocument, nextStep) => {
      let newStock = {};
      newStock['stock'] = stockDocument['name'];
      newStock['price'] = stockDocument['price'];
      newStock['likes'] = stockDocument['likes'];
      stocks.push(newStock);
      if (stocks.length === 2) {
        stocks[0]['rel_likes'] = stocks[0]['likes'] - stocks[1]['likes'];
        stocks[1]['rel_likes'] = stocks[1]['likes'] - stocks[0]['likes'];
        responseObject['stockData'] = stocks;
        nextStep();
      } else {
        return;
      }
    };

    /* Process Input*/
    if (typeof req.query.stock === 'string') {
      /* One Stock */
      const stockName = req.query.stock;
      const documentUpdate = {};
      if (req.query.like && req.query.like === 'true') {
        likeStock(stockName, findOrUpdateStock);
      } else {
        findOrUpdateStock(stockName, documentUpdate, getPrice);
      }
    } else if (Array.isArray(req.query.stock)) {
      twoStocks = true;
      /* Stock 1 */
      let stockName = req.query.stock[0];
      if (req.query.like && req.query.like === 'true') {
        likeStock(stockName, findOrUpdateStock);
      } else {
        findOrUpdateStock(stockName, {}, getPrice);
      }

      /* Stock 2 */
      stockName = req.query.stock[1];
      if (req.query.like && req.query.like === 'true') {
        likeStock(stockName, findOrUpdateStock);
      } else {
        findOrUpdateStock(stockName, {}, getPrice);
      }
    }
  });
};
