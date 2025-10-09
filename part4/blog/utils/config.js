require('dotenv').config()

const PORT = 3003
const mongoUrl = 'mongodb+srv://bari_db:ANNURbari@cluster0.fywulwh.mongodb.net/blogs?retryWrites=true&w=majority&appName=Cluster0'
const testMongoUrl = 'mongodb+srv://bari_db:ANNURbari@cluster0.fywulwh.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0'
const dbUrl = process.env.NODE_ENV === 'test'
    ? testMongoUrl
    : mongoUrl

module.exports = { dbUrl, PORT }