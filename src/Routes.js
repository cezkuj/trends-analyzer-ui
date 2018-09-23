import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import axios from "axios";

import App from "./App";
import Login from "./Login";
import Register from "./Register";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? (
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
  constructor(props) {
    super(props);
    this.state = { authenticated: false };
  }
  componentDidMount() {
    axios.get("/api/authenticate").then(res => {
      if (res.data.status === "EVERYTHING_OK") {
        this.setState({ authenticated: true });
      } else {
        this.setState({ authenticated: false });
      }
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Menu authenticated={this.state.authenticated} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute
            path="/dashboard"
            authenticated={this.state.authenticated}
            component={App}
          />
        </div>
      </Router>
    );
  }
}
class Menu extends React.Component {
  render() {
    if (this.props.authenticated) {
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
