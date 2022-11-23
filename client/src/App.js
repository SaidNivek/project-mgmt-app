import Header from './components/Header'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Project from './pages/Project';

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
      <Router>
        <Header />
        <div className="container">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='projects/:id' element={<Project />}/>
            <Route path='*'  element={<NotFound />}/>
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
    </>
  );
}

export default App;
