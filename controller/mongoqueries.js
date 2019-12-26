require('dotenv').config()

var MongoClient = require('mongodb');
var ObjectId = require("mongodb").ObjectId;

const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const project = "stockprice";

var client;


async function findStock(db, searchData) {

    return db.findOne({stock: searchData.stock},{_id: 0, stock: 1, price: 1, likes: 1, ip: 1});
}

async function updateStock(db, updateData, listOfIp) {
    let findIp = listOfIp.find(elem => elem === updateData.ip);

    if(updateData.likeVal === true && findIp === undefined) {
        return db.updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}, $inc: {likes: 1}, 
            $addToSet: {ip: updateData.ip}});
    }
    else {
        return db.updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}});
    }

}

async function updateStockLike (db, data, ipList) {
    
    if(ipList === null || Object.keys(ipList).length === 0) {
        return db.updateOne({stock: data.stock},
            { $inc: {likes: 1}, $addToSet:{ip: data.ip}});
    }
    else {
        return 'No Update';
    }
}

async function insertStock(db, data) {
    if(data.likeVal) {
        return db.insertOne({
            stock: data.stock,
            price: data.price,
            likes: 1,
            ip: data.ip 
        });
    }
    else {
        return db.insertOne({
            stock: data.stock,
            price: data.price,
            likes: 0,
            ip: []
        });
    }
}

async function findAndUpdateStock(db, stockData) {
    try {
        let stockFindResult = await findStock(db, stockData);
        
        if(stockFindResult === null) {
            let insertStockData = await insertStock(db, stockData);
            let findInsertedData = await findStock(db, stockData)
            return findInsertedData;
        }
        else {
            let updateStockData = await updateStock(db, stockData, [stockFindResult.ip]);
            let findUpdatedData = await findStock(db, stockData);
            return findUpdatedData;
        }
    }
    catch(e) {
        console.log("An error has occured: " + e);
        return e;
    }
}

async function findTwoStocksAndCompare(db, twoStocks) {
    try {
        let stock1FindResult = await findStock(db, twoStocks[0]);
        let stock2FindResult = await findStock(db, twoStocks[1]);
        

        if(stock1FindResult === null || stock2FindResult === null) {
            console.log("One or both stocks not found");
            let stock1Data = await ((stock1FindResult === null) 
                ? insertStock(db, twoStocks[0]) 
                : (twoStocks[2].likeVal) ? updateStockLike(db, twoStocks[0], stock1FindResult.ip) : stock1FindResult);
            let stock2Data = await ((stock2FindResult === null) 
                ? insertStock(db, twoStocks[1]) 
                : (twoStocks[2].likeVal) ? updateStockLike(db, twostocks[1],stock2FindResult.ip) : stock2FindResult);
            

            let stock1ReturnData = await findStock(db, twoStocks[0]);
            let stock2ReturnData = await findStock(db, twoStocks[1]);
            
            return ([stock1ReturnData, stock2ReturnData]);
        }
        else if(twoStocks[2].likeVal === true) {
            console.log("Increasing like for both stocks");
            let stockIP1 = stock1FindResult.ip;
            let stockIP2 = stock2FindResult.ip;

            let stock1Update = await updateStockLike(db, twoStocks[0], stockIP1);
            let stock2Update = await updateStockLike(db, twoStocks[1], stockIP2);

            let find1Update = await findStock(db, twoStocks[0]);
            let find2Update = await findStock(db, twoStocks[1]);

            return ([find1Update, find2Update]);
        }
        else {
            return ([stock1FindResult, stock2FindResult]);
        }
    }
    catch (e) {
        console.log("An error has occured: " + e);
        return e;
    }
}



module.exports = {findStock, updateStock, findAndUpdateStock, findTwoStocksAndCompare};