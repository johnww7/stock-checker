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

    return db.collection(project).findOne({stock: searchData.stock});
    //return findStockDoc;
}

async function updateStock(db, updateData) {
    //const {db, client} = await connectDB();
    if(likeVal) {
        return db.collection(project).updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}, $inc: {likes: 1}});
    }
    else {
        return db.collection(project).updateOne({stock: updateData.stock},
            { $set: {price: updateData.price}});
    }
    
    //return updateResult;
}

async function insertStock(db, data) {
    //const {db, client} = await connectDB();
    if(likeVal) {
        return db.collection(project).insertOne({
            stock: data.stock,
            price: data.price,
            likes: 1 
        });
    }
    else {
        return db.collection(project).insertOne({
            stock: data.stock,
            price: data.price,
            likes: 0
        });
    }
    //return insertStock;
}

async function findAndUpdateStock(db, stockData) {
    try {
        console.log("Whats in stockData before find: " + db);
        let stockFindResult = await findStock(db, stockData);
        console.log('Query finding stock in db: ' + JSON.stringify(stockFindResult));
        if(stockFindResult.stock !== null) {
            let updateStockData = await updateStock(db, stockData);
            console.log('Query update Stock: ' + updateStockData);
            return updateStockData;
        }
        else {
            let insertStockData = await insertStock(db, stockData);
            console.log('Query insert stock: ' + insertStockData);
            return stockData;
        }
    }
    catch(e) {
        console.log("An error has occured: " + e);
        return e;
    }
}

module.exports = {findStock, updateStock, findAndUpdateStock};