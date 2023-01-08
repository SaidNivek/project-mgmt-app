import { FaTrash } from 'react-icons/fa'
// Need this, like the useState hook from react in order to properly use the mutation
import { useMutation } from '@apollo/client'
// Import the mutation from the mutations folder
import { DELETE_CLIENT } from '../mutations/clientMutations'
import { GET_CLIENTS } from '../queries/clientQueries'
import { GET_PROJECTS } from '../queries/projectQueries'

export default function ClientRow({ client }) {
  // This defines the deleteClient function as the imported DELETE_CLIENT function, passing in the vriables needed from the client, defined in the export function
  const [ deleteClient ] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    // This is needed to update the UI so the deleted item is properly deleted, otherwise it requires a refresh of the page
    // Refetch can make the app slow down because it may require multiple refetchs at once, depending on the app functionality
    refetchQueries: [{query: GET_CLIENTS}, {query: GET_PROJECTS}]
    // This will reqrite the cache in memory to remove the client data that matches the client.id that was in the deleteClient mutation
    // update(cache, { data: { deleteClient } }) {
    //   const { clients } = cache.readQuery({ query: GET_CLIENTS })
    //   cache.writeQuery({
    //     query: GET_CLIENTS,
    //     data: { clients: clients.filter(client => client.id !== deleteClient.id) },
    //   })
    // }
  })

  return (
    <tr>
        <td>{client.name}</td>
        <td>{client.email}</td>
        <td>{client.phone}</td>
        <td>
            <button className="btn btn-danger btn-sm" onClick={deleteClient}><FaTrash /></button>
        </td>
    </tr>
  )
}
