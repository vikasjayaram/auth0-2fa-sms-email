const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'test'
const usersCollection = 'users';
let db

const init = () =>
  MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
    db = client.db(dbName)
  })

const findOne = (query) => {
    const collection = db.collection(usersCollection);
    return collection.findOne(query);

}

module.exports = { init, findOne }