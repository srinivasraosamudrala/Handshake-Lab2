import React, { Component } from 'react';
import { Redirect } from 'react-router';
import '../../App.css';
import axios from 'axios';
import { Card, Chip, CardContent, Typography, Avatar, Dialog, DialogContent } from '@material-ui/core';
import { environment } from '../../Utils/constants'
import CakeIcon from '@material-ui/icons/Cake';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import WorkIcon from '@material-ui/icons/Work';


//Define a Login Component
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: localStorage.getItem('studentId'),
            currentstudentId: localStorage.getItem('sstudentId'),
            messagestudent: false,
            mess: "",
            redirectToMessages: false
        }
        this.messageStudent = this.messageStudent.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidMount() {
        this.readstudentdata()
    }

    readstudentdata() {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/profile/' + localStorage.getItem('sstudentId'))
            .then((response) => {
                //update the state with the response data
                if (response.data) {
                    console.log(response.data)
                    const data = response.data
                    this.setState({
                        profiledata: data[0],
                    })

                    console.log(this.state.profiledata)
                }
            });
    }

    messageStudent = () => {
        this.setState(currentState => ({
            messagestudent: !currentState.messagestudent
        }))
    }
    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }
    sendMessage = () => {
        // e.preventDefault();
        let currentdate = new Date()
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
        const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(currentdate)
        let datestr = mo + " " + da + " " + ye + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds()
        let data = null
        console.log(this.state.studentId)
        data = {
            id1: this.state.studentId,
            id2: this.state.currentstudentId,
            update: {
                id1: {
                    sender: this.state.studentId,
                    persona: "students"
                },
                id2: {
                    receiver: this.state.currentstudentId,
                    persona: "students"
                },
                $push: {
                    messages: [{
                        fromId: this.state.studentId,
                        message: this.state.mess,
                        dateTime: datestr
                    }]
                }
            }
        }
        console.log(data)
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/message/sendmessage', data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    this.setState({ redirectToMessages: true })
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
            }
            )
    }

    render() {
        console.log(this.state.profiledata)
        let skillset = null
        let personalinfo = null
        let redirectVar = null

        if(this.state.redirectToMessages){
           redirectVar =  <Redirect to = {`/student/conversations`}/>
        }

        if (this.state.profiledata) {
            if (this.state.profiledata.skills) {
                let skillSet = this.state.profiledata.skills.split(",");
                skillset = (
                    <Card>
                        <CardContent>
                            <h1 style={{ fontFamily: "Arial", fontWeight: "550", fontSize: '18px' }}>Skills</h1>
                            <div style={{ marginBottom: '10px' }}>
                                {skillSet.map((data, index) => {
                                    return (
                                        <Chip
                                            key={index}
                                            label={data}
                                            style={{ marginRight: '8px', marginBottom: '8px', borderRadius: '3px', color: '#575757', fontSize: '13px', lineHeight: '15px', fontWeight: 500 }}
                                        />
                                    )
                                })}
                            </div>

                        </CardContent>
                    </Card>
                )
            }
            personalinfo = (
                <Card>
                    <CardContent>
                        <div class="row">
                            <div class="col-md-9" >
                                <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px' }}>Personal Info</h4>
                            </div>
                        </div>
                        <div class="row">
                            <div style={{ paddingLeft: "16px", fontSize: '13px', fontFamily: "Arial", fontWeight: "400" }} >
                                {(this.state.profiledata.email) ? (<h5><EmailOutlinedIcon color='primary' /> {this.state.profiledata.email}</h5>) : <div></div>}
                                {(this.state.profiledata.mobile) ? (<h5><PhoneOutlinedIcon color='primary' /> {this.state.profiledata.mobile}</h5>) : <div></div>}
                                {(this.state.profiledata.dob) ? (<h5><CakeIcon color='primary' /> {this.state.profiledata.dob}</h5>) : <div></div>}
                                {(this.state.profiledata.city) ? (<h5><LocationCityIcon color='primary' /> {`${this.state.profiledata.city}, ${this.state.profiledata.state}, ${this.state.profiledata.country}`}</h5>) : <div></div>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return (
            <div style={{ width: "95%", backgroundColor: '#F7F7F7', fontFamily: 'Arial' }}>
                {redirectVar}
                {this.state.profiledata ?
                    <div class="container" style={{ backgroundColor: '#F7F7F7' }}>
                        <div class="col-md-1">
                        </div>
                        <div class="col-md-3">
                            <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                                <Card>
                                    <CardContent>
                                        <div class="row">
                                            <div class="col-md-9" style={{ textAlign: '-webkit-right' }}>
                                                <Avatar src={this.state.profiledata.image} style={{ width: '104px', height: '104px', borderRadius: '50%', textAlign: 'center' }}><h1>{this.state.profiledata.first_name[0] + this.state.profiledata.last_name[0]}</h1></Avatar>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <center>
                                                <h1 style={{ fontSize: '30px' }}>{this.state.profiledata.first_name + " " + this.state.profiledata.last_name}</h1>
                                                {(this.state.profiledata.college) ? (<h4 >{this.state.profiledata.college}</h4>) : <div></div>}
                                                {(this.state.profiledata.education[0].degree) ? (<h4 style={{ fontSize: '15px' }}>{this.state.profiledata.education[0].degree + "," + this.state.profiledata.education[0].major}</h4>) : (<div></div>)}
                                                {(this.state.profiledata.education[0].degree && this.state.profiledata.education[0].cgpa) ? (<Typography color="textSecondary">
                                                    <h4 >{this.state.profiledata.education[0].degree + " • GPA:" + this.state.profiledata.education[0].cgpa}</h4>
                                                </Typography>) : <div></div>}
                                                <button class="btn btn-primary" style={{ backgroundColor: '#1569e0', border: '0px', width: '85%' }} onClick={() => this.messageStudent()}>Message</button>
                                                <Dialog
                                                    aria-labelledby="simple-modal-title"
                                                    aria-describedby="simple-modal-description"
                                                    open={this.state.messagestudent}>
                                                    <h4 id="simple-modal-title" style={{ padding: '10px' }}>Message</h4>
                                                    <DialogContent style={{ height: '180px', width: '400px' }}>
                                                        <textarea cols='50' rows='4' style={{ resize: 'none', borderRadius: '5px' }} type="text" name="mess" onChange={this.inputChangeHandler} placeholder="Type your message here.."/>
                                                        <div className='col-md-6'>
                                                        </div>
                                                        <div className='col-md-6' style={{paddingLeft:'25px'}}>
                                                                <button onClick={() => { this.messageStudent() }} class="btn btn-primary" style={{ backgroundColor: '#DCDCDC', border: '0px', borderRadius: '5px', padding:'5px', margin:'5px',width:'55px', color:'black' }}>Cancel</button>
                                                                <button onClick={() => { this.sendMessage() }} class="btn btn-primary" style={{ backgroundColor: '#1569E0', border: '0px', borderRadius: '5px', padding:'5px', margin:'5px',width:'55px' }}>Send</button><br /><br />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </center>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                                {skillset}
                            </div>
                            <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                                {personalinfo}
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="row" style={{ marginBottom: '20px' }}>
                                <Card>
                                    <CardContent>
                                        <div class="row">
                                            <div class="col-md-9" >
                                                <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px' }}>My Journey</h4>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div style={{ paddingLeft: "16px" }} >
                                                <h4 style={{ fontSize: "24px" }}>{this.state.profiledata.career_objective ? this.state.profiledata.career_objective : "Career Objective not updated"}</h4>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div class="row" style={{ marginBottom: '20px' }}>
                                <Card>
                                    <CardContent>
                                        <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px' }}>Education</h4><br />
                                        {this.state.profiledata.education.length ? this.state.profiledata.education.map((edudata, index) => {
                                            if (edudata._id !== this.state.b_id) {
                                                return (
                                                    <div class="row" style={{ paddingLeft: '30px' }}>
                                                        <div class="col-md-10">
                                                            <div key={edudata._id}>
                                                                <p style={{ fontSize: '18px' }}><SchoolRoundedIcon></SchoolRoundedIcon><b> {edudata.college_name + "  "}{(index === 0) ? <button style={{ border: '0px', fontSize: '13px', outline: 'none' }}>Primary Education</button> : ""}</b></p>
                                                                <p style={{ fontSize: '16px' }}> {edudata.degree},{edudata.location}</p>
                                                                <p> {edudata.month_of_starting + "/"}{edudata.year_of_starting} - {edudata.month_of_passing + "/"}{edudata.year_of_passing}</p>
                                                                <p><b>Major in</b> {edudata.major} </p>
                                                                <p><b>Cumulative GPA</b> {edudata.cgpa} </p><br />
                                                            </div></div>
                                                    </div>)
                                            }
                                        }) : <div style={{ paddingLeft: '30px', fontSize: '16px' }}>Education details are not added</div>}
                                    </CardContent>
                                </Card>
                            </div>
                            <div class="row" style={{ marginBottom: '20px' }}>
                                <Card>
                                    <CardContent>
                                        <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px' }}>Experience</h4>
                                        {this.state.profiledata.experience.length ? this.state.profiledata.experience.map((expdata, index) => {
                                            if (expdata._id !== this.state.exp_id) {
                                                return (
                                                    <div class="row" style={{ paddingLeft: '30px' }}>
                                                        <div class="col-md-10">
                                                            <div key={expdata._id}>
                                                                <p style={{ fontSize: '18px' }}><WorkIcon></WorkIcon><b> {expdata.company + "  "}</b></p>
                                                                <p style={{ fontSize: '16px' }}> {expdata.title},{expdata.location}</p>
                                                                <p> {expdata.month_of_starting + "/"}{expdata.year_of_starting} - {expdata.month_of_ending + "/"}{expdata.year_of_ending}</p>
                                                                <p><b>Job Description</b> {expdata.description} </p><br />
                                                            </div></div>
                                                    </div>)
                                            }
                                        }) : <div style={{ paddingLeft: '30px', fontSize: '16px' }}>Experience details are not added</div>}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div> : <div></div>}
            </div>
        )
    }
}

export default Profile;
