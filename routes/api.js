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
const project = "stockprice"

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
      console.log('Data: ' + JSON.stringify(stockData));

      try {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if(err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection");

          var submitStockPromise = () => {
            return new Promise((resolve, reject) => {
              db.collection(project).findAndModify({
                query: {stock: stockData.stock},
                update: { $set: {price: stockData.price, stock: stockData}},
                upsert: true
              }, (err, res) => {
                if(err) {
                  reject(err);
                }
                else {
                  console.log('stock price created');
                  resolve(res);
                }
              });

            });
          };

        });
      }
      catch(e) {

      }

      
    });
    
};
