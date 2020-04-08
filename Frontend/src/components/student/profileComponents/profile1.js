import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {environment} from '../../../Utils/constants';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Avatar from '@material-ui/core/Avatar';
import emptyPic from '../../../images/empty-profile-picture.png';

class Profile1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profiledata: null,
            redirect: true,
            rerender: false,
            updateprofile:false,
            image:emptyPic,
            profile1_preferred : "",
            profile1_last : ""
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.showProfilepic = this.showProfilepic.bind(this);
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    componentWillReceiveProps(nextProps) {
            let profile_props = null
            if(nextProps.profile){
                profile_props = {
                    first_name : nextProps.profile.first_name,
                    last_name : nextProps.profile.last_name,
                    college_name:nextProps.profile.education.length>0?nextProps.profile.education[0].college_name:"",
                    degree:nextProps.profile.education.length>0?nextProps.profile.education[0].degree:"",
                    major:nextProps.profile.education.length>0?nextProps.profile.education[0].major:"",
                    cgpa:nextProps.profile.education.length>0?nextProps.profile.education[0].cgpa:""}
            }


            this.setState({
                profiledata:profile_props,
                image:nextProps.profile.image
            })

            
            }

    updateProfile = (e) => {
        const data = {
            studentId: localStorage.getItem('studentId'),
            update:{
                    first_name: this.state.profile1_preferred,
                    last_name: this.state.profile1_last}
            }
            axios.defaults.withCredentials = true;
            axios.post(environment.baseUrl+'/student/profile', data)
                .then(response => {
                    if (response.data) {
                        let profiledata = {
                            first_name  : response.data.first_name,
                            last_name   : response.data.last_name,
                            college_name: response.data.education.length>0?response.data.education[0].college_name:"",
                            degree      : response.data.education.length>0?response.data.education[0].degree:"",
                            major       : response.data.education.length>0?response.data.education[0].major:"",
                            cgpa        : response.data.education.length>0?response.data.education[0].cgpa:""}
                        this.setState({
                            profiledata : profiledata,
                            image : response.data.image
                        })
                    } else {
                        console.log(response.data.error)
                    }
                    this.setState(currentState => ({
                        updateprofile: !currentState.updateprofile
                    }))
                })
            }

    updateInfo = (e) => {
        let profile1_preferred = this.state.profiledata.first_name
        let profile1_last = this.state.profiledata.last_name
        this.setState(currentState =>({
            updateprofile: !currentState.updateprofile,
            profile1_preferred: profile1_preferred,
            profile1_last:profile1_last
            }))
    }

    showProfilepic = async (e) => {
        this.setState({
            image : e.target.files[0]
        })
        e.preventDefault();

        const formData = new FormData();
        formData.append('studentId', localStorage.getItem('studentId'))
        formData.append('image', e.target.files[0]);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        
        await axios.post(environment.baseUrl+"/student/uploadpic",formData, config)
            .then((response) => {
                this.setState({
                    image:response.data.image
                })
            }).catch((error) => {
            });
    }

    render() {
        let profile1 = null
        console.log(this.state.profiledata)
        if (!this.state.updateprofile) {
            if (this.state.profiledata){
            profile1 = (
                <CardContent>
                    <div class= "row">
                    <div class="col-md-9" style={{ textAlign: '-webkit-right' }}>
                        <Avatar src={this.state.image} style={{ width: '104px', height: '104px', borderRadius: '50%', textAlign: 'center' }}><h1>{this.state.profiledata.first_name[0] + this.state.profiledata.last_name[0]}</h1></Avatar>
                    </div>
                    <div class="col-md-2" >
                        <IconButton onClick={this.updateInfo} ><EditOutlinedIcon color='primary' /></IconButton>
                    </div>
                    </div>
                    <div class = "row">
                        <center>
                        <h1 style={{ fontSize: '30px' }}>{this.state.profiledata.first_name + " " + this.state.profiledata.last_name}</h1>
                        {(this.state.profiledata.college_name)?(<h4 >{this.state.profiledata.college_name}</h4>):<div></div>}
                        {(this.state.profiledata.degree)?(<h4 style={{ fontSize: '15px' }}>{this.state.profiledata.degree + "," + this.state.profiledata.major}</h4>):(<div></div>)}
                        {(this.state.profiledata.degree && this.state.profiledata.cgpa)?(<Typography color="textSecondary">
                            <h4 >{this.state.profiledata.degree + " • GPA:" + this.state.profiledata.cgpa}</h4>
                        </Typography>):<div></div>}</center>
                        </div>
                </CardContent>
            )}
        } else {
            profile1 = (
                <CardContent style={{ textAlign: '-webkit-center' }} >
                   <div class="upload-btn-img">
                            <Avatar src={this.state.image} class="img-thumbnail p-0 m-0" style = {{height:'104px',width:'104px'}} alt="Student"></Avatar>
                            <input type="file" name="image" onChange={this.showProfilepic} />
                    </div>
                    <div class="login-form">
                        <div class= "col-md-6">
                        <p style = {{fontSize:'10px',fontWeight: 'bold'}}>Preffered Name</p>
                        <TextField onChange={this.inputChangeHandler} id="preferred" name="profile1_preferred" value={this.state.profile1_preferred} variant="outlined" class='form control' size = 'small' style={{ marginBottom: '5px' }} />
                        <Button onClick={this.updateInfo} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: "#E0E0E0", color: 'black' ,width :"100%"}}>
                            Cancel
                        </Button>
                        </div>
                        <div class= "col-md-6" style={{marginBottom : '10px'}}>
                        <p style = {{fontSize:'10px',fontWeight: 'bold'}}>Last Name</p>
                        <TextField onChange={this.inputChangeHandler} id="first" name="profile1_last" value={this.state.profile1_last} variant="outlined" class='form control' size = 'small' style={{ marginBottom: '5px' }} />
                        <Button onClick={() => this.updateProfile('name')} variant="contained" component="span" style={{ backgroundColor: '#1569E0', color: 'white', width :"100%"}}>
                            Save
                        </Button></div>
                    </div></CardContent>
            )
        }
        return (
            <div>
                <Card >
                    {profile1}
                </Card>
            </div>
        )
    }
}
export default Profile1;
