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

//const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const CONNECTION_STRING = "mongodb://john:N1teLockon@ds035787.mlab.com:35787/jwfccmongodb";

const API_TOKEN = process.env.STOCK_TOKEN;
//console.log(API_TOKEN);
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';
const project = "stockprice";

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stockSticker = req.query.stock;
      let like = req.query.like;
      let stockData;
      console.log('stock: ' + JSON.stringify(stockSticker) + ' like value: ' + like);

      let stockQuoteUrl = STOCK_URL + stockSticker + '/quote?token=' + API_TOKEN;
      console.log('Url Quote: ' + stockQuoteUrl);

      try {
        MongoClient.connect(CONNECTION_STRING, (err, client) => {
          if(err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection");
          const db = client.collection(project);

          var myStockPromise = () =>{
            return new Promise((resolve, reject) => {
              apiFetch.fetchStockData(stockQuoteUrl).then(data =>{
                console.log("Response data: " + JSON.stringify(data));
        
                let likeValue = like ? true : false;
                let formattedData = {
                  stock: data.symbol,
                  price: data.latestPrice,
                  likeVal: likeValue
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
      /*let fetchStock = apiFetch.fetchStockData(stockQuoteUrl).then(data =>{
        console.log("Response data: " + JSON.stringify(data));

        let likeValue = like ? true : false;
        let formattedData = {
          stock: data.symbol,
          price: data.latestPrice,
          likeVal: likeValue
        }
        return formattedData;
      })
      .then(data => {
        console.log('formattted: ' + JSON.stringify(data));
      })
      .catch(err => {console.log(err)});*/
      
      
      //console.log('API stock result: ' + apiFetch.fetchStockData(stockQuoteUrl));
      //let findStockData = queryDB.findStock(fetchStock.stock);
     // console.log('Stock status: ' + JSON.stringify(findStockData));
     
     
      /*let fetchApiData = fetchStock.then(data => {
        stockData = data;
        console.log('Stock data: ' + JSON.stringify(data));
        return data;
      })
      .then(data => {
        let findResult = queryDB.findStock(data.stock);
        console.log('Result of find: ' + findResult);
      })
      .catch(err => {
        console.log('An error occured: ' + err);
        return err;
      });*/
      /*fetchStockData.then(data=>{
        return(data.json())
      })
      .then(result=>{
        stockData = ({stock: result.symbol, price: result.latestPrice});
        console.log('Data: ' + JSON.stringify(stockData));
      })
      .catch(error=>{
        console.log(error)
      });*/
      //console.log('Data: ' + fetchApiData);

      /*try {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
          if(err) {
            console.log("Database error: " + err);
          }
          console.log("Successful database connection");

          let submitStockPromise = () => {
            return new Promise((resolve, reject) => {
              db.collection(project).findOneAndUpdate(
                {stock: stockData.stock},
                {$set: {price: stockData.price}},
                {upsert: true, returnOriginal: false},
                 (res, err) => {
                if(err) {
                  console.log('here at error');
                  reject(err);
                }
                else {
                  console.log('stock price created');
                  resolve(res);
                }
              });
            });
          };

          let submitStockResult = async () => {
            let result = await submitStockPromise();
            return result;
          };

          submitStockResult().then(submit => {
            db.close();
            res.json(submit);
          });

        });
      }
      catch(e) {
        res.send(e);
      }*/

      
    });
    
};
