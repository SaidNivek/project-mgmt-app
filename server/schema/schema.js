// Bring in the sampleData and destructure it for us to work with before the DB is set up in MongoDB
const { projects, clients } = require('../sampleData.js')

// Bring in the things from graphql that we need to use and destructure them into their parts
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema } = require('graphql')

// Client Type - GraphQL Object Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    // This fields for the ClientType is an anonymous function that returns an object
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // This fields for the RootQuery is an object that returns queries
    fields: {
        // This defines the client query
        client: {
            // It takes in a type, the client type, which we created above
            type: ClientType,
            // To get a specific client, we need to pass in args to specify which one
            // id is the GraphQLID that we set up in the ClientType, above
            args: { id: {type: GraphQLID}},
            // Our return goes into this resolver, which is a function that takes in a parent and args
            resolve(parent, args) {
                // Uses .find on the clients array, then matches the array from args, which is passed in, to the id of the client that exists within the array
                return clients.find(client => client.id === args.id)
            }
        }
    }
})

// In order to use the query, we need to export the schema
module.exports = new GraphQLSchema({
    query: RootQuery
})