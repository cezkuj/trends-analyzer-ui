import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Auth from "./Authenticator";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.authenticate() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Routes extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Menu />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/dashboard" component={App} />
        </div>
      </Router>
    );
  }
}
class Menu extends React.Component {
  render() {
    if (Auth.authenticate()) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    );
  }
}
export default Routes;
