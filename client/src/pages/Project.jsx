import { Link, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useQuery } from '@apollo/client'
import { GET_PROJECT } from '../queries/projectQueries'

export default function Project() {
  // destructure the id of the project with useParams
  const { id } = useParams()
  // get the status of loading, error, and data from the GET_PROJECT query
  // Need to pass in an object variables with the id in order to get the data from the query
  const {loading, error, data } = useQuery(GET_PROJECT, {variables: { id }})


  if (loading) return <Spinner />
  if (error) return <p>Something went wrong</p>
  
  return (
    <div>Project</div>
  )
}
