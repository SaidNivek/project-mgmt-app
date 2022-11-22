import Header from './components/Header'
import Clients from './components/Clients';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

// This will create the Apollo client, which will wrap the app so we can access all of the graphql data we need in all of the parts of the app that needs it
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
})

function App() {
  return (
    <>
    <ApolloProvider client={client} >
      <Header />
      <div className="container">
        <Clients />
      </div>
    </ApolloProvider>
    </>
  );
}

export default App;
