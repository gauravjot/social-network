import Index from './components/home/Index'
import LogIn from './components/home/LogIn'
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route path='/login' exact component={LogIn} />
          <Route path='/' exact component={Index} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
