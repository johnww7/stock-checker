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

var apiFetch = require('../controller/apifetch');
var queryDB = require('../controller/mongoqueries');

const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


const API_TOKEN = process.env.STOCK_TOKEN;
//console.log(API_TOKEN);
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';
const project = "stockprice";

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stockSticker = req.query.stock;
      let like = req.query.like;
      let ipAddress= req.ip;
      let stockData;
      console.log("my ip: " + req.ip)
      console.log('stock: ' + JSON.stringify(stockSticker) + ' like value: ' + like);
      console.log('stock type: ' + typeof(stockSticker));
      try {
        MongoClient.connect(CONNECTION_STRING, (err, client) => {
          if(err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection");
          const db = client.collection(project);

          var myStockPromise = () =>{
            return new Promise((resolve, reject) => {
              if(stockSticker.length == 2 && typeof(stockSticker) === 'object') {
                let stockQuoteUrl = STOCK_URL + stockSticker[0] + '/quote?token=' + API_TOKEN;
                let stockQuoteUrl2 = STOCK_URL + stockSticker[1] + '/quote?token=' + API_TOKEN;
                console.log('Url Quote: ' + stockQuoteUrl + ' : ' + stockQuoteUrl2);

                apiFetch.fetchTwoStocksData(stockQuoteUrl, stockQuoteUrl2).then(data =>{
                  console.log("Response data: " + JSON.stringify(data));
          
                  let likeValue = like ? true : false;
                  let formattedData1 = {
                    stock: data[0].symbol,
                    price: data[0].latestPrice,
                    likeVal: likeValue,
                    ip: [ipAddress]
                  }
                  let formattedData2 = {
                    stock: data[1].symbol,
                    price: data[1].latestPrice,
                    likeVal: likeValue,
                    ip: [ipAddress]
                  }
                  return [formattedData1, formattedData2, {likeVal: likeValue}];
                })
                .then(stockResult => {
                  console.log('API fetch formated results: ' + JSON.stringify(stockResult));
                  return queryDB.findTwoStocksAndCompare(db, stockResult);
                })
                .then(resultData=> {
                  console.log('formattted: ' + JSON.stringify(resultData));
                  let stock1compare = {
                    stock: resultData[0].stock,
                    price: resultData[0].price,
                    rel_likes: resultData[0].likes - resultData[1].likes
                  }
                  let stock2compare = {
                    stock: resultData[1].stock,
                    price: resultData[1].price,
                    rel_likes: resultData[1].likes - resultData[0].likes  
                  }
                  resolve([stock1compare, stock2compare]);
                })
                .catch(err => {
                  console.log(err)
                  reject(err);
                });
              }
              else {
                let stockQuoteUrl = STOCK_URL + stockSticker + '/quote?token=' + API_TOKEN;
                console.log('Url Quote: ' + stockQuoteUrl);
                apiFetch.fetchStockData(stockQuoteUrl).then(data =>{
                  console.log("Response data: " + JSON.stringify(data));
          
                  let likeValue = like ? true : false;
                  let formattedData = {
                    stock: data.symbol,
                    price: data.latestPrice,
                    likeVal: likeValue,
                    ip: [ipAddress]
                  }
                  return formattedData;
                })
                .then(stockResult => {
                  return queryDB.findAndUpdateStock(db, stockResult);
                })
                .then(resultData=> {
                  console.log('formattted: ' + JSON.stringify(resultData));
                  resolve(resultData);
                })
                .catch(err => {
                  console.log(err)
                  reject(err);
                });
              }
            });
          };

          myStockPromise().then(result => {
            client.close();
            console.log('Result so far: ' + JSON.stringify(result));
            res.json({stockData: result});
          });
        
        });
      }
      catch (e) {
        console.log('End of error: ' + e);
      }

      
    });
    
};
