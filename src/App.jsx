import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from './logic/store';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Dashboard from '../components/Dashboard';

const App = () => {
  console.log('ok');
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/' component={SignIn} />
          <Route exact path='/signUp' component={SignUp} />
          <Route exact path='/maps' component={Dashboard} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
