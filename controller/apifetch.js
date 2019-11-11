var fetch = require('node-fetch');

const API_TOKEN = process.env.STOCK_TOKEN;
//console.log(API_TOKEN);
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';

async function fetchStockData(quoteUrl) {
    
    const result = await fetch(quoteUrl);
    if(!result) {
        throw new Error(result.status);
    }

    //let fetchStockData = JSON.stringify(result);
    let returnData = {
        stock: result.symbol,
        price: result.latestPrice
    };
    return result;
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
}

module.exports = {fetchStockData};