import { Link, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { useQuery } from '@apollo/client'
import { GET_PROJECT } from '../queries/projectQueries'
import ClientInfo from '../components/ClientInfo'
import DeleteProjectButton from '../components/DeleteProjectButton'
import EditProjectForm from '../components/EditProjectForm'

export default function Project() {
  // destructure the id of the project with useParams
  const { id } = useParams()
  // get the status of loading, error, and data from the GET_PROJECT query
  // Need to pass in an object variables with the id in order to get the data from the query
  const {loading, error, data } = useQuery(GET_PROJECT, {variables: { id }})


  if (loading) return <Spinner />
  if (error) return <p>Something went wrong</p>

  return (
    <>
      {!loading && !error && (
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">Back</Link>

          <h1>{ data.project.name }</h1>
          <p>{ data.project.description }</p>
          <h5 className="mt-3">Project Status</h5>
          <p className="lead">{ data.project.status }</p>

          <ClientInfo client={ data.project.client } />
          
          {/* Bring in the prop of the entire project, because w emight need to edit any part of the project. */}
          <EditProjectForm project={data.project} />

          <DeleteProjectButton projectId={data.project.id} />
        </div>
      )}
    </>
  )
}
