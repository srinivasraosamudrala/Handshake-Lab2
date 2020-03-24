import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {environment} from '../../Utils/constants';

//Define a Signup Component
class Signup extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name : "",
            email : "",
            password : "",
            location : "",
            authFlag : false,
            authError : false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //input change handler to update state variable with the text entered by the user
    inputChangeHandler = (e) => {
        let value = e.target.value
        this.setState({
            [e.target.name] : value
        })
        console.log(this.state)
    }

    //submit Signup handler to send a request to the node backend
    submitSignup = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            signup : true,
            name : this.state.name,
            email : this.state.email,
            password : this.state.password,
            location : this.state.location
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        console.log(environment.baseUrl+'/company/signup')
        axios.post(environment.baseUrl+'/company/signup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log(response.data)
                if(response.data.result){
                    this.setState({
                        authFlag : true,
                        authError : false
                    })
                }else{
                    this.setState({
                        authFlag : false,
                        authError : true
                    })
                }
                console.log(this.state)
            })
            }

    render(){
        //redirect based on successful Signup
        let redirectVar = null;
        let invalid = null;
        //if(cookie.load('cookie')){
        if(this.state.authFlag === true){
            redirectVar = <Redirect to= {{path :"/company/login", state : {email: this.state.email}}}/>
        }

        if(this.state.authError === true){
            invalid = <p>Email Id is Taken</p>
        }

        return(
            <div>
                {redirectVar}
            <div class="container">
                
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <title>Handshake</title>
                            <h1>Sign Up</h1>
                            <p>Please enter your details</p>
                        </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="name" placeholder="Company Name"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="email" placeholder="Email ID"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="location" placeholder="Location"/>
                            </div>
                            <button onClick = {this.submitSignup} class="btn btn-primary">Signup</button> 
                            <div>{invalid}</div>
                        </div>              
                    </div>
                    </div>
                    </div>
        )
    }
}
//export Signup Component
export default Signup;