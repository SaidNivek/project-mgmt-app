// Bring in the sampleData and destructure it for us to work with before the DB is set up in MongoDB
const { projects, clients } = require('../sampleData.js')

// Mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')

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
                name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        // The client is now a child of project, so we can query for information from the client in GtaphQL
        client: {
            type: ClientType,
            resolve(parent, args) {
                // This will use the parent's (project) data, which has clientID and will return the data for the matched client, so you can return name/email/phone with this linked section here
                // It uses the mongoose method to do this (findById)
                return Client.findById(parent.clientId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // This fields for the RootQuery is an object that returns queries
    fields: {
        // This defines the all clients query, which will return all of the data for all of the clients
        clients: {
            // The type we are looking for is a GraphQL List of Client Types, so we have to specify that as the type
            type: new GraphQLList(ClientType),
            // Args are not needed, since we aren't passing in any ID or other arguments, since we are grabbing all of the clients
            resolve(parent, args) {
                // The mongoose schema of CLient that we built has a method of find, which we can use to bring in all of the Clients, if we don't specify anything here
                return Client.find()
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
                // The mongoose schema of Client has a method findById, which will use the argument passed in to find the Client within the database that matches the argument passed in
                return Client.findById(args.id)
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
               return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: {type: GraphQLID}},
            resolve(parents, args) {
                return Project.findById(args.id)
            }
        }
    }
})

// In order to use the query, we need to export the schema
module.exports = new GraphQLSchema({
    query: RootQuery
})