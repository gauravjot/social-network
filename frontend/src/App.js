import Index from './components/home/Index';
import LogIn from './components/home/LogIn';
import Dashboard from './components/dashboard/Index';
import Friends from './components/dashboard/friends/Friends';
import FindFriends from './components/dashboard/friends/FindFriends';
import Profile from './components/dashboard/profile/Profile'
import PostPage from './components/dashboard/post/PostPage'
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom';

function App() {

  return (
    <Router>
      <Switch>
        <Route path='/findfriends' exact component={FindFriends} />
        <Route path='/friends' exact component={Friends} />
        <Route path='/dashboard' exact component={Dashboard} />
        <Route path='/login' exact component={LogIn} />
        <Route path='/' exact component={Index} />
        <Route path='/u/:slug' render={(props) => <Profile {...props} key={(Math.random() * 10)}/>} />
        <Route path='/post/:post_id' render={(props) => <PostPage {...props} key={(Math.random() * 10)}/>} />
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  );
}

export default App;
