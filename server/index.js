// Bringing in express for our server
const express = require('express')
// Needed for the .env files to be used properly
require('dotenv').config()
// Bring in graphqlHTTP from the express-graphql package
const { graphqlHTTP } = require('express-graphql')
// Bring in the schema
const schema = require('./schema/schema')
// Defining the port to listen on, using .env or port 4000 if something is off
const port = process.env.PORT || 4000
// Creating the app for things to actually start listening and happening with our code
const app = express()

// Define app.use so it knows the endpoint for our server
app.use('/graphql', graphqlHTTP({
    schema: schema,
    // Checks to see if we are in development and, if we are, sets graphiql to true, so we can use it
    graphiql: process.env.NODE_ENV === 'development'
}))

// Checking to see if the server is up and running properly
app.listen(port, console.log(`Server running on port ${port}.`))