import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, IconButton, InputBase, Dialog } from '@material-ui/core/';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import JobList from './joblist';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'

//create the Student Home Component
class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: 0,
            eventlist: null,
            eventindex: 0,
            jobfilter: [],
            namesearch:"",
            locsearch:"",
            appiledJob:[],
            emptyprofilepic:emptyPic,
            studentedu:"",
            showalert:false
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.showEvent = this.showEvent.bind(this);
        this.registerEvent = this.registerEvent.bind(this)

    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
        console.log(e.target.value)
    }

    showEvent = (e) => {
        console.log(e)
        this.setState({
            eventindex: e
        })

    }


    registerEvent = (eventId,companyId,eligibility) => {
        let appiledJob = []
        let data = {
            'eventId':eventId,
            'companyId':companyId,
            'studentId':localStorage.getItem('studentId')
        }
        if ((eligibility !== this.state.studentedu) && (eligibility !== 'All Majors')){
            this.setState({
                showalert:true})
        }else{
        console.log(data)
        axios.post(environment.baseUrl+'/student/registerEvent' ,data)
        .then((response) => {
            console.log(response.data)
            appiledJob = this.state.appiledJob
            this.setState({
                appliedjob: appiledJob.push(eventId)
            })
            console.log(this.state.appliedjob)
        })}
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.get(environment.baseUrl+'/student/events/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    // var base64Flag = 'data:image/jpeg;base64,';
                    // response.data.result.map((event,index) => {
                    //     console.log("profile")
                    //     if (event.profilepic!== null) {
                    //         var imgstring = this.arrayBufferToBase64(event.profilepic.data);
                    //          event.profilepic = base64Flag + imgstring
                    //     }
                    // } )
                this.setState({
                    eventlist: response.data
                });
            }
            axios.post(environment.baseUrl+'/student/education',{'studentId':localStorage.getItem('studentId')})
                .then((response)=>{
                    console.log(response)
                    this.setState({
                        studentedu:response.data.education[0].major
                    })
                })
            })
    }

    render() {
        let events = null;
        let detailedevent = null;
        let eventdetailed = null;
        let erroralert = null;
        let namesearch = this.state.namesearch;
        let eventlist = this.state.eventlist;
        console.log(this.state.studentedu)

        if (this.state.eventlist) {
            if (namesearch.length>0)
            {
                eventlist = eventlist.filter((event) => {
                    return (event.eventname.indexOf(namesearch) > -1)
                })
            }
        if (this.state.showalert === true){
            erroralert=alert("You are not eligible to attend this event")
        }
            if (eventlist.length > 0) {
                events = (
                    <div>
                        {eventlist.map((event, index) => {
                            return (<div >
                                <Link onClick={() => this.showEvent(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                    <p style={{ fontSize: '16px', fontWeight: '700' }}>{event.event_name}</p>
                                    <p style={{ fontSize: '16px', fontWeight: '400' }}>{event.Company[0].name} - {event.location}</p>
                                    <p style={{ fontSize: '14px', fontWeight: '400' }}>{event.eligibility}</p>
                                    <hr style = {{width:'200%', position:"relative", left:"-50px"}}></hr></Link>
                            </div>
                            )
                        })}
                    </div>
                )
                eventdetailed = eventlist[this.state.eventindex]
                detailedevent = (
                    <div>
                        {erroralert}
                        <div style={{float:'left'}}><img src={eventdetailed.profilepic?eventdetailed.profilepic:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',left:'-10px'}} alt='Profile'/></div>
                        <div><p style={{ fontSize: '24px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{eventdetailed.event_name}</p>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{eventdetailed.Company[0].name}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>{eventdetailed.eligibility}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>{eventdetailed.location}</p>
                        <p style={{ fontSize: '14px', fontWeight: '400', color: 'rgba(0,0,0,.56)' }}>Posted </p></div>
                        <div style={{ border: 'Solid 1px', borderRadius: '5px', padding: '30px', marginBottom: '24px' }}>
                            <div class = 'col-md-9'> 
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,.8)', position:'relative', top:'-12px',left:'-15px'}}>Event is on {eventdetailed.date} at {eventdetailed.time}</p></div>
                            <div class = 'col-md-3'>
                            <button class="btn btn-primary" style={{ backgroundColor: '#0d7f02', position:'relative', top:'-15px',border:'0px'}} onClick={()=>this.registerEvent(eventdetailed._id,eventdetailed.company_id,eventdetailed.eligibility)}>Register</button></div>
                        </div>
                        <h2 style={{ fontSize: '27px', fontWeight: 'bold', textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.8)' }}>{eventdetailed.event_name}</h2>
                        <p style={{ lineHeight: '20px', fontSize: '16px' }}>{eventdetailed.event_description}</p>
                    </div>
                )
            }
        }
        return (
            <div>
                <StudentNav comp="events" />
                <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
                <Card style={{marginRight : '16px'}}>
                    <CardContent>
                        <div style={{marginBottom:'13px'}}>
                        <div style={{ width: "50%",float:"left"}}><input type="text" name="namesearch" id="namesearch" style={{ width: "80%", }} placeholder="Event name,Company name" onChange={this.inputChangeHandler}/></div></div>
                    </CardContent>
                </Card>
                <div style={{ paddingTop: '20px' }}>
                    <div class="col-md-4" style={{ paddingRight: '16x' }}>
                        <Card><CardContent>{events}</CardContent></Card>

                    </div>
                    <div class="col-md-8" style={{ paddingRight: '10px' }}>
                        <Card style={{ padding: '40px 40px' }}><CardContent>{detailedevent}</CardContent></Card>
                    </div></div>
                </div>
                
            </div>
        )
    }


}

export default Events;