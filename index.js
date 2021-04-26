const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

const {MONGODB} = require('./config')
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

//type definitions
//! means required

const PORT = process.env.PORT || 5000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose
.connect(MONGODB,{useUnifiedTopology: true , useNewUrlParser: true})
.catch(error => console.log(error))
.then(() => {
    console.log('Mongo connected')
    return server.listen({port: PORT})
})
.then(res => {
    console.log(`Server is running at ${res.url}`)
})
.catch(err => {
    console.error(err)
})