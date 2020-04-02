import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent} from '@material-ui/core/';
import Jobdetails from './jobdetails'
import {environment} from '../../Utils/constants'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: localStorage.getItem('companyId'),
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
        axios.get(environment.baseUrl+'/company/list-of-jobs-and-events/' + localStorage.getItem('companyId')+'/jobs')
            .then((response) => {
                //update the state with the response data
                console.log(response.data)
                this.setState({
                    joblist: response.data.result
                })
                console.log(this.state.joblist)
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
        let redirectjobVar = null;
        let jobarr = this.state.joblist
        console.log("Start",jobarr)
        let joblistvar = [];
        // if (!cookie.load('companycookie')) {
        if (!localStorage.getItem('companyId')){
            console.log("going to login")
            redirectVar = <Redirect to="/login" />
        }
        // }
        if (this.state.view_applicants === true) {
            console.log(this.state.editJob)
            redirectVar = <Redirect to={`/company/applicants/${this.state.editJob}`}/>
        }

        if (this.state.Redirectjob) {
            redirectjobVar = <Redirect to="/company/postjob" />
        }
        if (jobarr.length > 0) {
            joblistvar = (
                jobarr.map(job => {
                    return (<div style={{margin:'20px 70px 10px 70px',width:'95%'}}>
                        <Card>
                            <CardContent>
                            <div style={{padding:'10px 0px 10px 50px'}}>
                                <div className="row App-align">
                                    <div className="col-md-9" style={{ fontSize: "23px", color: "#1569E0",marginLeft:"-10px" }}>{job.title}</div>
                                    <div className="col-md-3"><button class="btn btn-primary" style={{backgroundColor:'#1569E0', marginLeft:'15px', borderRadius:'15px'}} value={job._id} onClick={this.viewApplicants}>View Applicants</button></div>
                                </div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-usd" style={{ color: "#1569E0" }}></span> {job.salary+" per hour"}</div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {job.location}</div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-calendar" style={{ color: "#1569E0" }}></span> Ends on {job.deadline.substring(0,10)}</div>
                                {/* <div style={{ fontSize: "21px" }}> Description : {this.state.currentjob.description}</div> */}
                            </div>
                            </CardContent>
                        </Card></div>)
                }))
        }
        return (
            <div>
                {redirectVar}
                <div class="container">
                    <div class = "col-md-10">
                        {joblistvar}
                        {redirectjobVar}
                    </div>
                    <div class = "col-md-2">
                    <button onClick={this.postJob} class="btn btn-primary" style={{backgroundColor:'#1569E0',borderRadius:'15px', width:'70%',marginLeft:'60px'}}>Post Job</button></div>
                </div>
            </div>
        )
    }
}

export default Home;