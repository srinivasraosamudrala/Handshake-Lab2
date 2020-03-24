import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {environment} from '../../Utils/constants';

//Define a Signup Component
class addJob extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            title     : "",
            postingDate    : "",
            deadline : "",
            location : "",
            salary : 0,
            desc : "",
            category : "",
            createJob : false,
            toJobs : false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.postJob = this.postJob.bind(this);
        this.tojobs = this.tojobs.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            createJob : false
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

    postJob = (e) => {
        //var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            company_id      : localStorage.getItem('companyId'),
            title           : this.state.title,
            posting_date    : new Date().toISOString().slice(0,10),
            deadline        : this.state.deadline,
            location        : this.state.location,
            salary          : this.state.salary,
            job_description : this.state.desc,
            category        : this.state.category
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        console.log(data)
        axios.post(environment.baseUrl+'/company/postjob',data)
            .then(response => {
                if(response.data.result){
                    this.setState({
                        createJob : true
                    })
                }else{
                    this.setState({
                        createJob : false
                    })
                }
            })
            }
    tojobs = (e) =>{
        this.setState({
            toJobs:true
        })
    }

    render(){
        //redirect based on successful Signup
        let redirectVar = null;
        let invalid = null;
        //if(cookie.load('cookie')){
        if(this.state.createJob === true){
            redirectVar = <Redirect to= "/company/home"/>
        }

        if(this.state.toJobs === true){
            redirectVar = <Redirect to= "/company/home"/>
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
                            <h1>Post Job</h1>
                            <p>Please enter the Job details</p>
                        </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="title" placeholder="Job Title"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="date" class="form-control" name="deadline" placeholder="Deadline"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="location" placeholder="Location"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="salary" placeholder="Salary"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.inputChangeHandler} type="text" class="form-control" name="desc" placeholder="Description"/>
                            </div>
                            <div class="form-group">
                                <select name="category" onChange = {this.inputChangeHandler} class="form-control">
                                    <option value="cate">Pick a Category</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="On Campus">On Campus</option>
                                </select>
                            </div>
                            <button onClick = {this.postJob} class="btn btn-primary">Add Job</button> 
                            <div>{invalid}</div>
                        </div>              
                    </div>
                    </div>
                    </div>
        )
    }
}
//export Signup Component
export default addJob;