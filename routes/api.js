/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

require('dotenv').config()
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require("mongodb").ObjectId;
var fetch = require('node-fetch');


const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//const CONNECTION_STRING = "mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb";
const API_TOKEN = process.env.STOCK_TOKEN;
//console.log(API_TOKEN);
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stockSticker = req.query;
      let stockData;
      console.log('stock: ' + JSON.stringify(stockSticker) + 'type: ' + typeof(stockSticker));

      let stockQuoteUrl = STOCK_URL + stockSticker + '/quote?token=' + API_TOKEN;
      console.log('Url Quote: ' + stockQuoteUrl);

      let fetchStockData = fetch(stockQuoteUrl);
      fetchStockData.then(data=>{
        return(data.json())
      })
      .then(result=>{
        stockData = ({stock: result.symbol, price: result.latestPrice});
        console.log('Data: ' + JSON.stringify(stockData));
      })
      .catch(error=>{
        console.log(error)
      });


      //let stockmyStockData = await fetchStockData();
      //res.send(fetchStockData.json());
      console.log('Data: ' + JSON.stringify(stockData));
    });
    
};
