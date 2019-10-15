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


//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const CONNECTION_STRING = "mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb";
const API_TOKEN = process.env.STOCK_TOKEN;
console.log(API_TOKEN);
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stockSticker = req.query.stock;
      console.log('stock: ' + stockSticker);

      let stockQuoteUrl = STOCK_URL + stockSticker + '/quote?token=' + API_TOKEN;
      console.log('Url Quote: ' + stockQuoteUrl);

      let fetchStockData = fetch(stockQuoteUrl)
      .then(data=>{
        return(data.json())
      })
      .then(result=>{
        return({stock: result.symbol, price: result.latestPrice});
      })
      .catch(error=>{
        console.log(error)
      });

      //let stockmyStockData = await fetchStockData();
      //res.send(fetchStockData.json());
      console.log(fetchStockData);
    });
    
};
