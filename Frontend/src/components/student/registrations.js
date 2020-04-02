import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, IconButton, InputBase, Avatar } from '@material-ui/core/';
import axios from 'axios';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'


//create the Student Home Component
class Registrations extends Component {
    constructor(props){
        super(props);
        this.state = {
            studentId: "",
            registrations: null,
            jobindex: 0,
            jobfilter: [],
            status:"",
            emptyprofilepic:emptyPic
        }
        // this.handleLogout = this.handleLogout.bind(this);
        // this.changeActivenav = this.changeActivenav.bind(this);
        this.statusFilter = this.statusFilter.bind(this)
    }

    statusFilter(e){
        console.log(e)
        this.setState({
            status:e.target.value
        })
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.get(environment.baseUrl+'/student/eventregistrations/' + localStorage.getItem('studentId'))
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
                    registrations: response.data
                });
            }
            })
    }

    render(){
        let eventregistrations = null;
        let registrations = this.state.registrations
        if (registrations){
            if (this.state.status){
                registrations=registrations.filter((app) => {
                    return this.state.status.indexOf(app.status) > -1
                })
            }
            eventregistrations = (
                <div>
                {registrations.map((app, index) => {
                    
                return (<Card style={{marginBottom:'20px', width:'80%', marginLeft:'150px'}}>
                    <CardContent>
                        <div class="col-md-1" style={{marginTop:'20px'}}>
                            <img src={app.profilepic?app.profilepic:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',top:'-12px',left:'-10px'}} alt='Profile'/></div>
                        <div class="col-md-9" style={{marginBottom:'16px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700' }}>{app.event_name}</div>
                        <div style={{fontSize: '16px', fontWeight: '500' }}>{app.Company[0].name}</div>
                        <div style={{fontSize: '16px', fontWeight: '500'}}>{"Location:" + app.location}</div>
                        <div>Event is on {app.date} at {app.time}</div></div>
                    </CardContent>
                </Card>)
                })}
                </div>
        )}


       return(<div>
        <StudentNav comp="eventregistrations"/>
        <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
        {/* <div class="col-md-3">
            <Card>
                <CardContent>
                    <div>
                    <div style={{fontWeight:'550',fontSize:'16px',marginBottom:'20px'}}>Filters</div>
                    <div style={{fontWeight:'550',fontSize:'13px',padding:'16px'}}>Status</div>
                    <select id="status" name="status" style = {{width:"80%",fontSize:'13px',marginLeft:'16px'}} onChange={this.statusFilter} >
                        <option value="" disabled selected>+ Add Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Declined">Declined</option>
                    </select></div>
                </CardContent>
            </Card>
        </div> */}
        <div>
            {eventregistrations}
        </div>
        </div>
        </div>
       )
}
}

export default Registrations;