import { gql } from '@apollo/client'

const ADD_CLIENT = gql`
    mutation addClient($name: String!, $email: String!, $phone: String!) {
        addClient(name: $name, email: $email, phone: $phone)
        {
            id
            name
            email
            phone
        }
    }
`

// Using the apollo/client gql syntax to do the delete mutation, as defined in the schema on the server side
const DELETE_CLIENT = gql`
    mutation deleteClient($id: ID!) {
        deleteClient(id: $id) {
            id
            name
            email
            phone
        }
    }
`


export { ADD_CLIENT, DELETE_CLIENT }