require('dotenv').config()

var MongoClient = require('mongodb');
var ObjectId = require("mongodb").ObjectId;

const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const project = "stockprice";

var client;

/*async function connectDB() {
    if(!client) {
        client = await MongoClient.connect(process.env.CONNECTION_STRING), { useNewUrlParser: true };
    }
    return {
        db: client.db('jwfccmongodb'),
        client: client
    }
}

async function close() {
    if(client) {
        client.close();
    }
    client = undefined;
}*/

async function findStock(db, searchData) {
    //const {db, client} = await connectDB();

    return db.findOne({stock: searchData.stock},{_id: 0, stock: 1, price: 1, likes: 1});
    //return findStockDoc;
}

async function updateStock(db, updateData) {
    //const {db, client} = await connectDB();
    if(updateData.likeVal === true) {
        return db.updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}, $inc: {likes: 1}});
    }
    else {
        return db.updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}});
    }
    
    //return updateResult;
}

async function updateStockLike (db, data) {
    return db.updateOne({stock: data.stock},
        { $inc: {likes: 1}});
}

async function insertStock(db, data) {
    //const {db, client} = await connectDB();
    if(data.likeVal) {
        return db.insertOne({
            stock: data.stock,
            price: data.price,
            likes: 1 
        });
    }
    else {
        return db.insertOne({
            stock: data.stock,
            price: data.price,
            likes: 0
        });
    }
    //return insertStock;
}

async function findAndUpdateStock(db, stockData) {
    try {
        console.log("Whats in stockData before find: " + JSON.stringify(stockData));
        let stockFindResult = await findStock(db, stockData);
        console.log('Query finding stock in db: ' + JSON.stringify(stockFindResult));
        
        if(stockFindResult === null) {
            let insertStockData = await insertStock(db, stockData);
            console.log('Query insert stock: ' + insertStockData);
            let findInsertedData = await findStock(db, stockData)
            return findInsertedData;
        }
        else {
            let updateStockData = await updateStock(db, stockData);
            console.log('Query update Stock: ' + updateStockData);
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
        console.log("Both stocks: " +JSON.stringify(twoStocks));
        let stock1FindResult = await findStock(db, twoStocks[0]);
        let stock2FindResult = await findStock(db, twoStocks[1]);

        if(stock1FindResult === null || stock2FindResult === null) {
            let stock1Data = await ((stock1FindResult === null) 
                ? insertStock(db, twoStocks[0]) 
                : (twoStocks[2].likeVal) ? updateStockLike(db, twoStocks[0]) : stock1FindResult);
            let stock2Data = await ((stock2FindResult === null) 
                ? insertStock(db, twoStocks[1]) 
                : (twoStocks[2].likeVal) ? updateStockLike(db, twostocks[1]) : stock2FindResult);
            

            let stock1ReturnData = await findStock(db, twoStocks[0]);
            let stock2ReturnData = await findStock(db, twoStocks[1]);
            
            return ([stock1ReturnData, stock2ReturnData]);
        }
        else if(twoStocks[2].likeVal === true) {
            let stock1Update = await updateStockLike(db, twoStocks[0]);
            let stock2Update = await updateStockLike(db, twoStocks[1]);

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