var MongoClient = require('mongodb');
var ObjectId = require("mongodb").ObjectId;

const CONNECTION_STRING = process.env.CONNECTION_STRING; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const project = "stockprice";

var client;

async function connectDB() {
    if(!client) {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
    }
    return {
        db: client.db(),
        client: client
    }
}

async function close() {
    if(client) {
        client.close();
    }
    client = undefined;
}

async function findStock(searchData) {
    const {db, client} = await connectDB();

    let findStockDoc = await db.collection(project).find(searchData);
    return findStockDoc;
}

async function updateStock(updateData) {
    
}