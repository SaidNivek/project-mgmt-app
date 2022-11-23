import { gql } from '@apollo/client'

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

export { DELETE_CLIENT }