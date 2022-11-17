// Bring in the sampleData and destructure it for us to work with before the DB is set up in MongoDB
const { projects, clients } = require('../sampleData.js')

// Bring in the things from graphql that we need to use and destructure them into their parts
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql')

// Client Type - GraphQL Object Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    // 'fields' for the ClientType is an anonymous function that returns an object
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

// Project Type - GraphQL Object Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    // 'fields' for the ProjectType is an anonymous function that returns an object
    fields: () => ({
        id: { type: GraphQLID },
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // This fields for the RootQuery is an object that returns queries
    fields: {
        // This defines the all clients query, which will return all of the data for all of the clients
        clients: {
            // The type we are looking for is a GraphQL List of CLient Types, so we have to specify that as the type
            type: new GraphQLList(ClientType),
            // Args are not needed, since we aren't passing in any ID or other arguments, since we are grabbing all of the clients
            resolve(parent, args) {
                return clients
            }
        },
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
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects
            }
        },
        project: {
            type: ProjectType,
            args: { id: {type: GraphQLID}},
            resolve(parents, args) {
                return projects.find(project => project.id === args.id)
            }
        }
    }
})

// In order to use the query, we need to export the schema
module.exports = new GraphQLSchema({
    query: RootQuery
})