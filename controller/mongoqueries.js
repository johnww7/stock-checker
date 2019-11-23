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



module.exports = {findStock, updateStock, findAndUpdateStock};