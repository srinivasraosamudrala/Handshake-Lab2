import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent} from '@material-ui/core/';
import {environment} from '../../Utils/constants'

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirectevent: false,
            view_applicants: false,
            eventlist: [],
            editJob:""
        }

        this.postEvent = this.postEvent.bind(this);
    }


    viewRegistrations = (eventId) => {
      
        this.setState({
            view_applicants: true,
            editJob:eventId
        })
    }

    //get the job data from backend  
    componentDidMount() {
        const data = {
            'companyId': localStorage.getItem('companyId')
        }
        console.log(data)
        axios.get(environment.baseUrl+'/company/list-of-jobs-and-events/' + localStorage.getItem('companyId')+'/events')
            .then((response) => {
                //update the state with the response data
                this.setState({
                    eventlist: response.data
                })
                console.log(this.state.eventlist)
            });
    }

    postEvent = () => {
        this.setState({
            Redirectevent: true
        })
    }

    render() {
        //if not logged in go to login page
        let redirectVar = null;
        let eventarr = this.state.eventlist
        let eventlistvar = [];
        // if (!cookie.load('companycookie')) {
        if (localStorage.getItem('company_id')) {
            console.log("going to login")
            redirectVar = <Redirect to="/company/login" />

        }

        if (this.state.Redirectevent) {
            redirectVar = <Redirect to="/company/postevent" />
        }

        let viewEvent = null;

        if (this.state.view_applicants === true) {
            console.log(this.state.editJob)
            viewEvent = <Redirect to={`/company/events/registrations/${this.state.editJob}`}/>
        }
        console.log(eventarr)
        if (eventarr) {
            eventlistvar = (<div>
                {eventarr.map(event => {
                    return (
                        <div style={{margin:'20px 70px 10px 70px',width:'95%'}}>
                        <Card>
                            <CardContent>
                            <div style={{padding:'10px 0px 10px 50px'}}>
                                <div className="row App-align">
                                    <div className="col-md-9" style={{ fontSize: "23px", color: "#1569E0",marginLeft:"-10px" }}>{event.event_name}</div>
                                    <div className="col-md-3"><button class="btn btn-primary" style={{backgroundColor:'#1569E0', marginLeft:'15px', borderRadius:'15px'}}  onClick={()=>{this.viewRegistrations(event.eventId)}}>View Registrations</button></div>
                                </div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-calendar" style={{ color: "#1569E0" }}></span> Timings: {event.date.substring(0,10)} at {event.time}</div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {event.location}</div>
                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-ok" style={{ color: "#1569E0" }}></span> Eligibility:{event.eligibility}</div>
                                {/* <div style={{ fontSize: "21px" }}> Description : {this.state.currentjob.description}</div> */}
                            </div>
                            </CardContent>
                        </Card></div>
                    
                    // <div>
                    //     <li><h2><Link to = "/company/events/registrations">{event.name}</Link></h2>
                    //     <p>Description - {event.eventDesc}</p>
                    //     <p>Date - {event.date.substring(0,9)}   Time - {event.time}</p>
                    //     <p>Location - {event.location}</p>
                    //     <p>Eligibility - {event.eligibility}</p>
                    //     </li>
                    //     <br/><br/>
                    //     </div>
                )})}</div>)
        }
        return (
            <div>
                {redirectVar}
                {viewEvent}
                <div class="container">
                    <div class = "col-md-10">
                        {eventlistvar}
                    </div>
                    <div class = "col-md-2">
                    <button onClick={this.postEvent} class="btn btn-primary" style={{backgroundColor:'#1569E0',borderRadius:'15px', width:'70%',marginLeft:'60px'}}>Post Event</button></div>
                </div>
            </div>
        )
    }
}

//export Home Component
export default Events;