import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Locator from './screens/map.js'
import Recommender from './screens/Recommender';


function App() {
  const name='Nityansh'

  const ResLocator = () => {
    return (
    <Locator name={name}/>
    )
  }
  const ResRecommender = () => {
    return (
    <Recommender name={name}/>
    )
  }
  return (
    <div className="App">
      <Router>
        
      <Navbar/>
      <Switch>
      <Route path="/" exact component={ResLocator} />
          <Route path="/recommender" exact component={ResRecommender} />
      </Switch>
      </Router>
    </div>
  );
}

export default App;
