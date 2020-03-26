import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {environment} from '../../Utils/constants'

//Define a Signup Component
class addEvent extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name        : "",
            date        : "",
            time        : "",
            eventDesc   : "",
            location    : "",
            eligibility : "",
            createEvent : false,
            toJobs : false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.postEvent = this.postEvent.bind(this);
        this.tojobs = this.tojobs.bind(this);
    }

    tojobs = (e) =>{
        this.setState({
            toJobs:true
        })
    }

    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            createEvent : false
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
    postEvent = (e) => {
        //var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            company_id   : localStorage.getItem('companyId'),
            event_name   : this.state.name,
            event_description : this.state.description,
            time        : this.state.time,
            date        : this.state.date,
            location    : this.state.location,
            eligibility : this.state.eligibility
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(environment.baseUrl+'/company/postevent',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log(response.data)
                if(response.data.result){
                    this.setState({
                        createEvent : true
                    })
                }else{
                    this.setState({
                        createEvent : false
                    })
                }
            })
            }

    render(){
        //redirect based on successful Signup
        let redirectVar = null;
        let invalid = null;
        //if(cookie.load('cookie')){
        if(this.state.createEvent === true){
            redirectVar = <Redirect to= "/company/events"/>
        }
        if(this.state.toJobs === true){
            redirectVar = <Redirect to= "/company/events"/>
        }

        // if(this.state.authError === true){
        //     invalid = <p>Email Id is Taken</p>
        // }

        return(
            <div>
                {redirectVar}
            <div class="container">
            <div class="col-md-9"></div>
                <div class="col-md-3"><button onClick={this.tojobs} class="btn btn-primary" style={{backgroundColor:'#808080',borderRadius:'15px',border:'0px'}}><span class="glyphicon glyphicon-chevron-left" style={{ color: "white" }}></span>Back to jobs</button></div>
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h1>Post Event</h1>
                            <p>Please enter the Event details</p>
                        </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="name" placeholder="Event Name"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="date" class="form-control" name="date" placeholder="Date"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="time" class="form-control" name="time" placeholder="Time"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="description" placeholder="Event Description"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="location" placeholder="Location"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="eligibility" placeholder="Eligibility"/>
                            </div>
                            <button onClick = {this.postEvent} class="btn btn-primary">Add Event</button> 
                            <div>{invalid}</div>
                        </div>              
                    </div>
                    </div>
                    </div>
        )
    }
}
//export Signup Component
export default addEvent;