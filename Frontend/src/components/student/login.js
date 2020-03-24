import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom'
import {signin} from '../../actions/action';
import {store} from '../../index'
import {connect} from "react-redux";
import {environment} from '../../Utils/constants'
import { loginUser } from "../../redux/actions/index"

//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            authFlag : false,
            authError : false
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            signup : false,
            email : this.state.username,
            password : this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(environment.baseUrl+'/student/signup',data)
            .then(response => {
                if(response.data[0]){
                    this.setState({
                        authFlag : true,
                        authError : false
                    })
                    localStorage.setItem('studentId', response.data[0].studentId);
                    localStorage.setItem('studentfirstname', response.data[0].firstName);
                    localStorage.setItem('studentlastname', response.data[0].lastName);
                    localStorage.setItem('studentemail', response.data[0].email);
                    localStorage.setItem('studentcollege', response.data[0].college);
                    this.props.loginUser(response.data[0])
                }else{
                    console.log(response.data.error)
                    this.setState({
                        authFlag : false,
                        authError : true
                    })
                }
            })
            }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        let invalid = null;
        if(cookie.load('studentcookie')){
            console.log("redirect")
            redirectVar = <Redirect to= "/student/jobs/search"/>
        }

        if(this.state.authError === true){
            invalid = <p>Invalid Credentials</p>
        }

        return(
            <div>
                {redirectVar}
            <div class="container">
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <title>Handshake</title>
                            <h1>Sign in</h1>
                            <p>Please enter your email and password</p>
                        </div>
                        
                            <div class="form-group">
                                <input onChange = {this.usernameChangeHandler} type="email" class="form-control" name="username" placeholder="Username"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick = {this.submitLogin} class="btn btn-primary">Login</button> 
                            <div>{invalid}</div>                
                    </div>
                    <div style={{paddingBottom:'15px'}}>
                    <Link to="/company/login">Not a student?Click here for company login!</Link><br/>
                    <Link to="/student/signup">Dont have an account?Signup Here!</Link></div>
                </div>
            </div>
         </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        invalidCredentials: state.invalidCredentials
    };
};

function mapDispatchToProps(dispatch) {
    return {
        loginUser: payload => dispatch(loginUser(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);