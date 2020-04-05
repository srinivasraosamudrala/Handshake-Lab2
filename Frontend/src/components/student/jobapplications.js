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
class JobApplications extends Component {
    constructor(props){
        super(props);
        this.state = {
            studentId: "",
            applications: null,
            jobindex: 0,
            jobfilter: [],
            status:"",
            emptyprofilepic:emptyPic
        }
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
        axios.get(environment.baseUrl+'/student/jobapplications/' + localStorage.getItem('studentId'))
            .then((response) => {
                if (response.data.length>0) {
                //     var base64Flag = 'data:image/jpeg;base64,';
                //     response.data.result.map((student) => {
                //         console.log("profile")
                //         if (student.profilepic!== null) {
                //             var imgstring = this.arrayBufferToBase64(student.profilepic.data);
                //              student.profilepic = base64Flag + imgstring
                //         }
                //     } )
                this.setState({
                    applications: response.data,
                });
                console.log(response.data)
            }
            })
    }

    render(){
        let jobapplications = null;
        let applications = this.state.applications
        if (applications){
            if (this.state.status){
                applications=applications.filter((app) => {
                    return this.state.status.indexOf(app.applications[0].status) > -1
                })
            }
            jobapplications = (
                <div>
                {applications.map((app, index) => {
                    
                return (<Card style={{marginBottom:'20px'}}>
                    <CardContent>
                        <div class="col-md-1">
                        <img src={app.profilepic?app.profilepic:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',top:'8px',left:'-15px'}} alt='Profile'/>
                        </div>
                        <div class="col-md-9" style={{marginBottom:'16px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700' }}>{app.title}</div>
                        <div style={{fontSize: '16px', fontWeight: '500' }}>{app.Company[0].name}</div>
                        <div style={{fontSize: '16px', fontWeight: '500'}}>{"status:" + app.applications[0].status}</div>
                        <div>Applied on {app.applications[0].applied_date} - Applications close on {app.deadline.slice(0,10)}</div></div>
                    </CardContent>
                </Card>)
                })}
                </div>
        )}


       return(<div>
        <StudentNav comp="jobapplications"/>
        <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
        <div class="col-md-3">
            <Card>
                <CardContent>
                    <div>
                    <div style={{fontWeight:'550',fontSize:'16px',marginBottom:'20px'}}>Filters</div>
                    <div style={{fontWeight:'550',fontSize:'13px',padding:'16px'}}>Status</div>
                    <select id="status" name="status" style = {{width:"80%",fontSize:'13px',marginLeft:'16px'}} onChange={this.statusFilter} >
                        <option value="" disabled selected>+ Add Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Declined">Declined</option>
                    </select></div>
                </CardContent>
            </Card>
        </div>
        <div class="col-md-9">
            {jobapplications}
        </div>
        </div>
        </div>
       )
}
}

export default JobApplications;