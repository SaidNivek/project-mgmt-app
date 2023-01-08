// Mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')

// Bring in the things from graphql that we need to use and destructure them into their parts
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql')

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

// RootQuery is where we define the things that we can do with the GraphQL endpoint and the queries that can be built from the data in the DB (read in the CRUD fashion)
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

// Mutations are how we add things to the database, which we need to define so the GraphQL endpoint knows how to process the mutation (create, in the CRUD fashion)
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // The first mutation field is the addClient mutation, so we can add a client to the DB
        addClient: {
            // The type needs to be one of the defined types that we have created, in this case, ClientType
            type: ClientType,
            args: {
                // In order to prevent the user from entering a null value or an empty value, we need to use the GraphQLNonNull function, which wraps the true object type, adding a rule to that entry
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
            },
            // The resolve function creates a new client using the mongoose model by taking the args from the GraphQL query, which come from a form on the front-end
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                })
                // This will save the client, that was just defined above, to the DB
                return client.save()
            }
        },
        // Delete client will delete it from the DB (Delete in CRUD fashion)
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                // To find and delete all projects relating to the client, we need to do the following steps
                // Do a find of the Project model, passing in the client id
                // The clientId is going to correlate to args.id, which is the Project model, in this case, so anywhere the clientId of the deleted Client matches the clientId of any existing projects
                // Then, we will loop through each of the projects that have a matching clientId, we will remove those projects
                Project.find({ clientId: args.id })
                    .then((projects) => {
                        projects.forEach(project => {
                            project.remove()
                        })
                    })
                // Instead of finding and returning, we are now going to find the client item and remove it from the database
                return Client.findByIdAndRemove(args.id)
            },
        },
        // Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: { 
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'Not Started'},
                            'progress': { value: 'In Progress'},
                            'completed': { value: 'Completed'},
                        }
                    }),
                    default: 'Not Started', 
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project ({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                })

                return project.save()
            }
        },
        // Delete a Project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                // Instead of finding and returning, we are now going to find the client item and remove it from the database
                return Project.findByIdAndRemove(args.id)
            },
        },
        // Update a Project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { 
                    type: new GraphQLEnumType({
                        // This name needs to be unique, so if we kept it PorjectStatus, it would throw an error
                        // So we must change it to something else, in this case it is
                        name: 'ProjectStatusUpdate',
                        values: {
                            'new': { value: 'Not Started'},
                            'progress': { value: 'In Progress'},
                            'completed': { value: 'Completed'},
                        },
                    }),
                },
            },
            resolve(parent, args) {
                // Will find the Project by the given ID, find it, and update it withthe information passed into args
                return Project.findByIdAndUpdate(
                    args.id, {
                        // Use the $set function to change the fields that are in the Project within the database
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    // If we use this update mutation and there is no project, then it will create a new project immediately
                    {new: true}
                )
            }
        },
    }
})

// In order to use the query, we need to export the schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})