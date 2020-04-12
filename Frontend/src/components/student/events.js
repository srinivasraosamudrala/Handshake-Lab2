import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import StudentNav from './studentNavbar';
import { Card, CardContent, TablePagination, Avatar} from '@material-ui/core/';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'
import CategoryIcon from '@material-ui/icons/Category';

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
            showalert:false,
            rowsPerPage:5,
            page:0
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
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl+'/student/registerEvent' ,data)
        .then((response) => {
            console.log(response.data)
            appiledJob = this.state.appiledJob
            this.getEventData()
            this.setState({
                appliedjob: appiledJob.push(eventId)
            })
            console.log(this.state.appliedjob)
        })}
    }

    componentDidMount() {
        this.getEventData()
    }

    getEventData(){
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl+'/student/events/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    this.setState({
                        eventlist: response.data
                    });
            }
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
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
        let registerbutton = null;
        let registrations = null;
        console.log(this.state.studentedu)

        if (this.state.eventlist) {
            if (namesearch.length>0)
            {
                eventlist = eventlist.filter((event) => {
                    return (event.event_name.indexOf(namesearch) > -1 || event.Company[0].name.indexOf(namesearch) > -1)
                })
            }
        if (this.state.showalert === true){
            erroralert=alert("You are not eligible to attend this event")
        }
            if (eventlist.length > 0) {
                events = (
                    <div>
                        <div style={{height:'450px', overflow:'auto'}}>
                        {eventlist.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((event,index) => {
                            return (<div >
                                <Link onClick={() => this.showEvent(index)} style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
                                <div class="col-md-2" style={{marginTop:'10px'}}><Avatar src={event.Company[0].image?event.Company[0].image:this.state.emptyprofilepic} style={{height:'50px', width:'50px',borderRadius:'0px',position:'relative',left:'-20px'}} >DP</Avatar></div>
                                    <div class="col-md-10" style={{marginBottom:'16px'}}>
                                    <p style={{ fontSize: '16px', fontWeight: '700' }}>{event.event_name}</p>
                                    <p style={{ fontSize: '16px', fontWeight: '400' }}>{event.Company[0].name} - {event.location}</p>
                                    <p style={{ fontSize: '14px', fontWeight: '400' }}>{event.eligibility}</p></div>
                                    <hr style = {{width:'100%'}}></hr></Link>
                            </div>
                            )
                        })}
                        </div>
                        <TablePagination
                                rowsPerPageOptions={[1,2,5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={eventlist.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                    </div>
                )
                eventdetailed = eventlist[this.state.eventindex]
                console.log(eventdetailed.registrations.length)
                if(eventdetailed.registrations.length){
                    registrations = eventdetailed.registrations.find(app=>app.student_id===this.state.studentId)}
                    console.log(registrations)
                    if(registrations){
                        registerbutton = <div style={{fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,.8)',position:'relative', top:'-12px',border:'0px'}}>Registered</div>
                    }else{
                        registerbutton = <div><button class="btn btn-primary" style={{ backgroundColor: '#0d7f02', position:'relative', top:'-15px',border:'0px'}} onClick={()=>this.registerEvent(eventdetailed._id,eventdetailed.company_id,eventdetailed.eligibility)}>Register</button></div>
                    }
                detailedevent = (
                    <div>
                        {erroralert}
                        <div style={{float:'left'}}><img src={eventdetailed.Company[0].image?eventdetailed.Company[0].image:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',left:'-10px'}} alt='Profile'/></div>
                        <div><p style={{ fontSize: '24px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{eventdetailed.event_name}</p>
                        <p style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.8)' }}>{eventdetailed.Company[0].name}</p>
                        <div class="row" style={{position:'relative', left:'85px'}}>
                                <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-map-marker" style={{ color: "#1569E0" }}></span> {eventdetailed.location}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    <div style={{ fontSize: "13px" }}><span style={{ color: "#1569E0" }}><CategoryIcon/></span> {eventdetailed.eligibility}</div>
                                </div> <div class="col-md-3" style={{ padding: "0px" }}>
                                    {/* <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-usd" style={{ color: "#1569E0" }}></span> {jobdetailed.salary + " per hour"}</div> */}
                        </div></div>
                        </div>
                        <div style={{ border: 'Solid 1px', borderRadius: '5px', padding: '30px', marginBottom: '24px',marginTop:'16px' }}>
                            <div class = 'col-md-9'> 
                            <p style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(0,0,0,.8)', position:'relative', top:'-12px',left:'-15px'}}>Event is on {eventdetailed.date} at {eventdetailed.time}</p></div>
                            <div class = 'col-md-3'>
                                {registerbutton}
                            {/* <button class="btn btn-primary" style={{ backgroundColor: '#0d7f02', position:'relative', top:'-15px',border:'0px'}} onClick={()=>this.registerEvent(eventdetailed._id,eventdetailed.company_id,eventdetailed.eligibility)}>Register</button> */}
                            </div>
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
                        <Card style={{width : '101%'}}><CardContent>{events}</CardContent></Card>

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