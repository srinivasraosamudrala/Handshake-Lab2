import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, IconButton, InputBase, TextField } from '@material-ui/core/';
import Jobdetails from './jobdetails'
import {environment} from '../../Utils/constants'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: this.props.Id,
            Redirectjob: false,
            joblist: [],
            view_applicants:false,
            editJob:""
        }

        this.postJob = this.postJob.bind(this);
        this.viewApplicants = this.viewApplicants.bind(this);
    }

    viewApplicants = (e) => {
      
        this.setState({
            view_applicants: true,
            editJob:e.target.value
        })
    }


    //get the job data from backend  
    componentDidMount() {
        console.log("get req")
        const data = {
            'companyId': localStorage.getItem('companyId')
        }
        console.log(data)
        axios.get(environment.baseUrl+'/company/list-of-jobs-and-events/' + localStorage.getItem('companyId')+'/jobs')
            .then((response) => {
                //update the state with the response data
                this.setState({
                    joblist: response.data.result
                })
                console.log(this.state.joblist)
                // this.setState({
                //     books : this.state.books.concat(response.data) 
                // });
            });
    }

    postJob = () => {
        this.setState({
            Redirectjob: true
        })
    }

    render() {
        //if not logged in go to login page
        let redirectVar = null;
        let jobarr = this.state.joblist
        console.log("Start",jobarr)
        let joblistvar = [];
        // if (!cookie.load('companycookie')) {
            console.log("going to login")
            redirectVar = <Redirect to="/login" />

        // }
        if (this.state.view_applicants === true) {
            redirectVar = <Redirect to={`/company/applicants/${this.state.editJob}`}/>
        }

        if (this.state.Redirectjob) {
            redirectVar = <Redirect to="/company/postjob" />
        }
        if (jobarr.length > 0) {
            joblistvar = (
                jobarr.map(job => {
                    return (<div style={{margin:'20px 70px 10px 120px',width:'80%'}}>
                        <Card>
                            <CardContent>
                            <div style={{padding:'20px'}}>
                                <div className="row App-align">
                                    <div className="col-md-9" style={{ fontSize: "25px", color: "#1569E0",marginLeft:"-15px" }}><Link to = "/company/job/details">{job.title}</Link></div>
                                    <div className="col-md-3"><button class="btn btn-primary" style={{backgroundColor:'#1569E0'}} onClick={this.viewApplicants}>View Applicants</button></div>
                                </div>
                                <div style={{ fontSize: "15px" }}><span class="glyphicon glyphicon-briefcase" style={{ color: "#1569E0" }}></span> {job.salary+" per hour"}</div>
                                <div style={{ fontSize: "15px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {job.location}</div>
                                <div style={{ fontSize: "15px" }}><span class="glyphicon glyphicon-calendar" style={{ color: "#1569E0" }}></span> Ends on {job.deadline.substring(0,9)}</div>
                                {/* <div style={{ fontSize: "21px" }}> Description : {this.state.currentjob.description}</div> */}
                            </div>
                                {/* <div>
                                    <div class = "col-md-9"><h2><Link to = "/company/job/details">{job.title}</Link></h2></div>
                                    <div class = "col-md-3"><button onClick={this.viewApplicants} class="btn btn-primary" value={job.jobId}>View Applicants</button></div>
                                </div>
                                <p>Posting Date - {job.postingDate.substring(0,9)}   Deadline - {job.deadline.substring(0,9)}</p>
                                <p>Location - {job.location}</p>
                                <p>Salary - {job.salary}</p>
                                <p>Category - {job.category}</p> */}
                            </CardContent>
                        </Card></div>)
                }))
        }
        return (
            <div>
                {redirectVar}
                <div class="container">
                    <div class = "col-md-10"></div>
                    <div class = "col-md-2">
                    <button onClick={this.postJob} class="btn btn-primary" style={{backgroundColor:'#1569E0'}}>Post Job</button></div>
                </div>
                {/* <div class="wrapper"> */}
                    {/* <ul class="grid cards"> */}
                        {joblistvar}
                    {/* </ul> */}
                {/* </div> */}
            </div>
        )
    }
}

//export Home Component
export default Home;