import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = { username: "", password: "" };
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value }); //Dynamic keys https://stackoverflow.com/questions/29280445/reactjs-setstate-with-a-dynamic-key-name
  }
  handleLogin(event) {
    axios.post(
      "/api/login",
      {
        username: this.state.username,
        password: this.state.password
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    window.location.reload();
    this.props.history.push("/dashboard");
  }
  render() {
    return (
      <form>
        username:
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handleChange}
        />
        password:
        <input
          type="text"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <button name="login" type="button" onClick={this.handleLogin}>
          Login
        </button>
        <Link to="/register">Register</Link>
      </form>
    );
  }
}
export default Login;
