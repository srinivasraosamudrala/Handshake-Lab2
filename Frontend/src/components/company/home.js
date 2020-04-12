import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Card, CardContent, TablePagination} from '@material-ui/core/';
import {environment} from '../../Utils/constants'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: localStorage.getItem('companyId'),
            Redirectjob: false,
            joblist: [],
            view_applicants:false,
            editJob:"",
            rowsPerPage:5,
            page:0
        }

        this.postJob = this.postJob.bind(this);
        this.viewApplicants = this.viewApplicants.bind(this);
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page:newPage
        })
      };
    
    handleChangeRowsPerPage = (event) => {
        let rowsPerPage = parseInt(event.target.value, 10)
        this.setState({
            page:0,
            rowsPerPage:rowsPerPage
        })
      };

    viewApplicants = (e) => {
      
        this.setState({
            view_applicants: true,
            editJob:e.target.value
        })
    }


    //get the job data from backend  
    componentDidMount() {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
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
            joblistvar = (<div>
                {jobarr.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(job => {
                // jobarr.map(job => {
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
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-th-list" style={{ color: "#1569E0" }}></span> {job.category}</div>
                            </div>
                            </CardContent>
                        </Card></div>)})}
                        <div class='row'>
                <div class='col-md-7'></div>
                <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={jobarr.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                style={{}}
                                />
                </div>
                    </div>)
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