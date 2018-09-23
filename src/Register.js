import React from "react";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.state = {
      username: "",
      password: "",
      email: "",
      registration_code: ""
    };
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value }); //Dynamic keys https://stackoverflow.com/questions/29280445/reactjs-setstate-with-a-dynamic-key-name
  }
  handleRegister(event) {
    /*axios.post('/api/' + event.target.name, {
        "username": this.state.username,
        "password": this.state.password,
      }, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    */
    this.props.history.push("/login");
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
        <br />
        password:
        <input
          type="text"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        <br />
        email:
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <br />
        registration code:
        <input
          type="text"
          name="registration_code"
          value={this.state.registration_code}
          onChange={this.handleChange}
        />
        <br />
        <button name="register" onClick={this.handleRegister}>
          Register
        </button>
      </form>
    );
  }
}
export default Register;
