import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './logic/store';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path='/' component={SignIn} />
        <Route exact path='/connexion' component={SignUp} />
        <Route exact path='/dashboard' component={Dashboard} />
      </Switch>
    </Router>
  </Provider>
);

export default App;
