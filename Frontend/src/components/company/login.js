import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {environment} from '../../Utils/constants'

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            companyid: 0,
            email: "",
            password: "",
            authFlag: false,
            authError: false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //username change handler to update state variable with the text entered by the user
    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        //var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            signup: false,
            email: this.state.email,
            password: this.state.password
        }
        console.log(data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(environment.baseUrl+'/company/signup', data)
            .then(response => {
                console.log(response)
                if (!response.data.error) {
                    localStorage.setItem('companyId', response.data._id);
                    this.setState({
                        authFlag: true,
                        authError: false,
                        companyid: response.data._id
                    })
                } else {
                    console.log(response.data.error)
                    this.setState({
                        authFlag: false,
                        authError: true
                    })
                }
            })
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        let invalid = null;
        // if (cookie.load('companycookie')) {
        if (localStorage.getItem('companyId')){
            console.log("route to home")
            redirectVar = <Redirect to='/company/home' />
        }

        if (this.state.authError === true) {
            invalid = <p>Invalid Credentials</p>
        }
        return (
            <div>
                {redirectVar}
                <div class="container">
                    <div class="login-form">
                        <div class="main-div">
                            <div class="panel">
                                <title>Handshake</title>
                                <h1>Sign in</h1>
                                <p>Please enter your email id and password</p>
                            </div>

                            <div class="form-group">
                                <input onChange={this.inputChangeHandler} type="email" class="form-control" name="email" placeholder="Username" />
                            </div>
                            <div class="form-group">
                                <input onChange={this.inputChangeHandler} type="password" class="form-control" name="password" placeholder="Password" />
                            </div>
                            <button onClick={this.submitLogin} class="btn btn-primary">Login</button>
                            <div>{invalid}</div>
                        </div>
                        <div>
                            <Link to="/company/signup">Dont have an account?Signup Here!</Link></div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Login Component
export default Login;