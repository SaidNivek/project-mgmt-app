import Header from './components/Header'
import Clients from './components/Clients';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import AddClientModal from './components/AddClientModal';

// This code below will prevent the merge error from displaying in the console and handles the existing and incoming query merges when the mutations call for an update(cache) function
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming
          }
        },
        projects: {
          merge(existing, incoming) {
            return incoming
          }
        },
      }
    }
  }
})

// This will create the Apollo client, which will wrap the app so we can access all of the graphql data we need in all of the parts of the app that needs it
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache,
})

function App() {
  return (
    <>
    <ApolloProvider client={client} >
      <Header />
      <div className="container">
        <AddClientModal />
        <Clients />
      </div>
    </ApolloProvider>
    </>
  );
}

export default App;
