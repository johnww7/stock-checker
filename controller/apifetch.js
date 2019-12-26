var fetch = require('node-fetch');

const API_TOKEN = process.env.STOCK_TOKEN;
const STOCK_URL='https://cloud.iexapis.com/stable/stock/';

async function fetchStockData(quoteUrl) {
    
    const result = await fetch(quoteUrl);
    if(!result) {
        throw new Error(result.status);
    }

    let returnData = await result.json(); 

    return returnData;
}

async function fetchTwoStocksData(quoteUrl1, quoteUrl2) {
  const result1 = await fetch(quoteUrl1);
  const result2 = await fetch(quoteUrl2);
  if(!result1 || !result2) {
    throw new Error('Error during fetch');
  }

  let returnData1 = await result1.json();
  let returnData2 = await result2.json();
  return [returnData1, returnData2];
}

module.exports = {fetchStockData, fetchTwoStocksData};