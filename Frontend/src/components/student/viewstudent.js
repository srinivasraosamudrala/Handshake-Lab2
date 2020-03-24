import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie, { save } from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, Chip } from '@material-ui/core/';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { connect } from "react-redux";
import Icon from '@material-ui/core/Icon';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TextField from '@material-ui/core/TextField';
import {environment} from '../../Utils/constants'


//Define a Login Component
class Profile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            studentId: 0,
            email: "",
            password: "",
            lastname: "",
            firstname: "",
            college: "",
            degree: "",
            major: "",
            gpa: "",
            year:0,
            college_preferred: "",
            degree_preferred: "",
            major_preferred: "",
            cgpa_preferred: "",
            year_preferred:0,
            companyname:"",
            title:"",
            startDate:null,
            endDate:null,
            location:"",
            workdesc:"",
            companyname_preferred:"",
            title_preferred:"",
            startDate_preferred:null,
            endDate_preferred:null,
            location_preferred:"",
            workdesc_preferred:"",
            updateprofile1: false,
            profile1_preferred: "",
            profile1_last: "",
            careerobj: "",
            skillSet:[],
            skill:"",
            profilepic:null,
            profilepic1:null,
            updateprofile2: false,
            profile2focus:false,
            editeducation:false,
            editexperience:false
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.profile2SaveButton = this.profile2SaveButton.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.seteditEducation = this.seteditEducation.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
        this.updateEducation = this.updateEducation.bind(this)
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount() {
        this.readstudentdata()
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    readstudentdata(){
        this.setState({ studentId: localStorage.getItem('sstudentId') })
        axios.get(environment.baseUrl+'/student/profile/' + localStorage.getItem('sstudentId'))
            .then((response) => {
                //update the state with the response data
                if(response.data.result){
                console.log(response.data.result)
                const data = response.data.result
                let tempskillSet = data.skillset[0].skillSet
                let tempskillSetarr = [];

                console.log(tempskillSet)
                if(tempskillSet)
                   tempskillSetarr = tempskillSet.split(',')

                    var base64Flag = 'data:image/jpeg;base64,';
                    
                    if (data.info[0].profilepic !== null) {
                        var imgstring = this.arrayBufferToBase64(data.info[0].profilepic.data);
                         data.info[0].profilepic = base64Flag + imgstring
                    }

                this.setState({
                    firstname: data.education[0].firstName,
                    lastname: data.education[0].lastName,
                    college: data.education[0].college,
                    degree: data.education[0].degree,
                    major: data.education[0].major,
                    gpa: data.education[0].cgpa,
                    year:data.education[0].year,
                    college_preferred: data.education[0].college,
                    degree_preferred: data.education[0].degree,
                    major_preferred: data.education[0].major,
                    cgpa_preferred: data.education[0].cgpa,
                    year_preferred:data.education[0].year,
                    careerobj: data.basic[0].career_obj,
                    skillSet:tempskillSetarr,
                    profilepic1:data.info[0].profilepic,
                    companyname:data.work[0].companyName,
                    title:data.work[0].Title,
                    startDate:data.work[0].startDate,
                    endDate:data.work[0].endDate,
                    location:data.work[0].Location,
                    workdesc:data.work[0].workDesc,
                    companyname_preferred:data.work[0].companyName,
                    title_preferred:data.work[0].Title,
                    startDate_preferred:data.work[0].startDate,
                    endDate_preferred:data.work[0].endDate,
                    location_preferred:data.work[0].Location,
                    workdesc_preferred:data.work[0].workDesc,
                })
                console.log(this.state.skillSet)
            }});
    }
    //username change handler to update state variable with the text entered by the user
    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    seteditEducation = (e) => {
        this.setState({
            editeducation : !this.state.editeducation
        })
        
    }

    seteditExperience = (e) => {
        this.setState({
            editexperience : !this.state.editexperience
        })
        
    }

    updateExperience = (e) =>{
        let data = {};
            data = {
                type: 'experience',
                studentId: this.state.studentId,
                companyName:this.state.companyname_preferred,
                title:this.state.title_preferred,
                location:this.state.location_preferred,
                startDate:this.state.startDate_preferred,
                endDate:this.state.endDate_preferred,
                workDesc:this.state.workdesc_preferred
            }
        console.log(data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(environment.baseUrl+'/student/profile', data)
            .then(response => {
                console.log(response.data)
                if (response.data.result) {
                    this.setState({
                        companyname:this.state.companyname_preferred,
                        title:this.state.title_preferred,
                        startDate:this.state.startDate_preferred,
                        endDate:this.state.endDate_preferred,
                        location:this.state.location_preferred,
                        workdesc:this.state.workdesc_preferred
                    })
                    console.log(response.data.result)
                } else {
                    console.log(response.data.error)
                }})
                this.setState({
                    editexperience: !this.state.editexperience
                })
            }

            updateEducation = (e) =>{
                let data = {};
                    data = {
                        type: 'education',
                        studentId: this.state.studentId,
                        college:this.state.college_preferred,
                        location:this.state.location_preferred,
                        degree:this.state.degree_preferred,
                        major:this.state.major_preferred,
                        year:this.state.year_preferred,
                        cgpa:this.state.cgpa_preferred
                    }
                console.log(data)
                //set the with credentials to true
                axios.defaults.withCredentials = true;
        
                //make a post request with the user data
                axios.post(environment.baseUrl+'/student/profile', data)
                    .then(response => {
                        console.log(response.data)
                        if (response.data.result) {
                            this.setState({
                                companyname:this.state.companyname_preferred,
                                college:this.state.college_preferred,
                                location:this.state.location_preferred,
                                degree:this.state.degree_preferred,
                                major:this.state.major_preferred,
                                year:this.state.year_preferred,
                                cgpa:this.state.cgpa_preferred
                            })
                            console.log(response.data.result)
                        } else {
                            console.log(response.data.error)
                        }})
                        this.setState({
                            editeducation: !this.state.editeducation
                        })
                    }

    showProfilepic = async (e) => {
        this.setState({
            profilepic : e.target.files[0]
        })
        e.preventDefault();

        const formData = new FormData();
        formData.append('studentId', localStorage.getItem('sstudentId'))
        formData.append('profilepic', e.target.files[0]);
      
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        let rest = await axios.post(environment.baseUrl+"/student/uploadpic",formData, config)
            .then((response) => {
                this.readstudentdata();
                this.setState({
                    openimage: false,
                    file:null
                })
            }).catch((error) => {
            });
    }


    //submit Login handler to send a request to the node backend
    updateProfile = (e) => {
        //var headers = new Headers();
        //prevent page from refresh
        let data = {};
        if (e === 'name') {
            data = {
                type: 'name',
                studentId: this.state.studentId,
                firstname: this.state.profile1_preferred,
                lastname: this.state.profile1_last
            }
        }
        console.log(data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;

        //make a post request with the user data
        axios.post(environment.baseUrl+'/student/profile', data)
            .then(response => {
                console.log(response.data)
                if (response.data.result) {
                    this.setState({
                        firstname: data.firstname,
                        lastname: data.lastname
                    })
                    console.log(response.data.result)
                } else {
                    console.log(response.data.error)
                }
                if (data.type === "name"){
                this.setState(currentState => ({
                    updateprofile1: !currentState.updateprofile1
                }))}
            })
    }

        //submit Login handler to send a request to the node backend
        updateProfilefun2 = (e) => {
            //var headers = new Headers();
            //prevent page from refresh
            let data = {};
            if(e === 'careerobj'){
                data = {
                    type:'careerobj',
                    studentId:this.state.studentId,
                    careerobj:this.state.newcareerobj
                }
            }
            console.log(data)
            //set the with credentials to true
            axios.defaults.withCredentials = true;
    
            //make a post request with the user data
            axios.post(environment.baseUrl+'/student/profile', data)
                .then(response => {
                    console.log(response.data)
                    if (response.data.result) {
                        this.setState({
                            careerobj: data.careerobj
                        })
                        console.log(response.data.careerobj)
                    } else {
                        console.log(response.data.error)
                    }
                        this.setState({
                            updateprofile2 : false
                        })
                        console.log(this.state.updateprofile2)
                })
        }

    updateInfo = (e) => {
        this.setState(currentState =>({
            updateprofile1: !currentState.updateprofile1
        }))
        console.log(this.state.updateprofile1)
    }

    updateInfo2 = (e) => {
        this.setState(currentState =>({
            updateprofile2: !currentState.updateprofile2
        }))
        console.log(this.state.updateprofile2)
    }

    profile2SaveButton = e =>{
        this.setState(currentState =>({
            profile2focus : !currentState.profile2focus
        }))
        console.log(this.state.profile2focus)
    }

    deleteSkill = e =>{
        let data = {};
        let skillstr = "";
        let tempskillSet = this.state.skillSet;

        tempskillSet.splice(e,1);

        skillstr = tempskillSet.toString();
        
        console.log(skillstr)
                data = {
                    type:'skillSet',
                    studentId:this.state.studentId,
                    skillSet:skillstr
                };
            //set the with credentials to true
                axios.defaults.withCredentials = true;
    
            //make a post request with the user data
                axios.post(environment.baseUrl+'/student/profile', data)
                .then(response => {
                    console.log(response.data)
                    if (response.data.result) {
                        this.setState({
                            skillSet: tempskillSet
                        })
                        console.log(response.data.skillSet)
                    } else {
                        console.log(response.data.error)
                    }
                })
    }

    addSkill = (e)=>{
        let data = {}
        let tempskillSet = this.state.skillSet;
        let skillstr = "";
        if (tempskillSet)
            tempskillSet.push(this.state.skill)
        else
            tempskillSet = [this.state.skill]
            
        skillstr = tempskillSet.toString();

        data = {
            type:'skillSet',
            studentId:this.state.studentId,
            skillSet:skillstr
        };
        console.log(data)
    //set the with credentials to true
        axios.defaults.withCredentials = true;

    //make a post request with the user data
        axios.post(environment.baseUrl+'/student/profile', data)
        .then(response => {
            console.log(response.data)
            if (response.data.result) {
                this.setState({
                    skillSet: tempskillSet
                })
                console.log(this.state.skillSet)
            } else {
                console.log(response.data.error)
            }
        })

    }

    render() {
        //redirect based on successful login
        // console.log("In Profile : Showing Store data")
        // console.log(this.props.user);
        let redirectVar = null;
        let invalid = null;
        let profile1 = null;    
        let profile2 = null;    //Career Objective
        let profile3 = null;    //Skill Set
        let education1 = null;
        let experience1 = null;
        let saveButton = false;
        let career_obj = null;
        if (!cookie.load('studentcookie')) {
            redirectVar = <Redirect to='/student/login' />

        }

        //Profile 1 render update

            profile1 = (
                <CardContent>
                    <div class="row" style={{ textAlign: '-webkit-right' }}>
                        {/* <IconButton onClick={this.updateInfo} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton> */}
                    </div>
                    <div class="row" style={{ textAlign: '-webkit-center' }}>
                        <Avatar src={this.state.profilepic1} style={{ width: '104px', height: '104px', borderRadius: '50%', textAlign: 'center' }}><h1>{this.state.firstname[0] + this.state.lastname[0]}</h1></Avatar>
                        <h1 style={{ fontSize: '30px' }}>{this.state.firstname + " " + this.state.lastname}</h1>
                        <h4 >{this.state.college}</h4>
                        <h4 style={{ fontSize: '15px' }}>{this.state.degree + "," + this.state.major}</h4>
                        <Typography color="textSecondary">
                            <h4 >{this.state.degree + " • GPA:" + this.state.gpa}</h4>
                        </Typography>
                    </div>
                </CardContent>
            )

//profile2 render update

            profile2 = (<CardContent>
                <div class="row" style={{ textAlign: '-webkit-right' }}>
                        {/* <IconButton onClick={this.updateInfo2} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton> */}
                    </div>
                    <div class="row" style={{ marginLeft:'5px' }}>
                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>My Journey</h4>
                {/* <Typography style = {{fontSize : '14px',fontFamily : "Suisse Int'l", color:"#1569E0"}}>What are you passionate about? What are you looking for on Handshake? What are your experiences or skills?</Typography> */}
                {console.log("profile2")}
                {console.log("career Objective")}
                <div>
                    
                        <h4 style = {{fontSize:"24px"}}>{this.state.careerobj}</h4>
                    </div>
                    </div>
            </CardContent>)

            education1 = (<div>
                <div className = 'row'>
                <div className = 'col-md-11'>
                    <h4 style={{fontWeight:'600'}}>Education</h4>
                </div>
                <div className = 'col-md-1'>
                {/* <IconButton onClick={this.seteditEducation} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton> */}
                </div>
                </div>
                    <div style={{paddingLeft:'20px'}}>
                        <h4 style={{fontWeight:'600',marginBottom:'3px'}}>{this.state.college}</h4>
                        <div style={{fontWeight:'500' ,fontSize:'16px'}}>{this.state.degree+", "+this.state.college}</div>
                        <div>{this.state.year?this.state.year+"-Present":"Year:Unknown"}</div>
                        <div style={{fontWeight:'600'}}>Major in</div>
                        <div style={{position:'relative',top:'-20px',left:'58px'}}>{this.state.major}</div>
                        <div style={{fontWeight:'600', position:'relative',top:'-20px',left:'0px' }}>Cumulative GPA:</div>
                        <div style={{position:'relative',top:'-40px',left:'115px'}}>{this.state.gpa?this.state.gpa:"0.0"}</div>
                        {/* <Link style={{textDecoration:'0',color:'#1569e0',position:"relative",left:'270px',marginBottom:'10px',fontWeight:'600'}}>Add School</Link> */}
                    </div>
                </div>)
        
           experience1 = (<div>
               <div className = 'row'>
               <div className = 'col-md-11'>
                   <h4 style={{fontWeight:'600'}}>Experience</h4>
               </div>
               <div className = 'col-md-1'>
               {/* <IconButton onClick={()=>{this.seteditExperience()}} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton> */}
               </div>
               </div>
                   <div style={{paddingLeft:'20px'}}>
                       <h4 style={{fontWeight:'600',marginBottom:'3px'}}>{this.state.title}</h4>
                       <div style={{fontWeight:'500' ,fontSize:'16px'}}>{"At "+this.state.companyname+", " + this.state.location}</div>
                       <div>{"Period: From "+this.state.startDate+" to " +this.state.endDate}</div>
                       <div style={{marginTop:'10px'}}>{this.state.workdesc}</div>
                   </div>
               </div>)

        if (this.state.skillSet){
            let skillSet = this.state.skillSet;
            profile3 = (
                <div style = {{marginBottom:'10px'}}>
                    {skillSet.map((data,index)=>{
                        return(
                            <Chip
                              key = {index}
                              label = {data}
                            //   onDelete = {()=>this.deleteSkill(index)}
                              style = {{marginRight : '8px',marginBottom : '8px', borderRadius : '0px', color:'#575757',fontSize:'13px',lineHeight: '15px',fontWeight: 500}}
                            />
                        )
                    })}
                </div>
            )
        }

        return (
            <div style={{ width: "95%", backgroundColor: '#F7F7F7', fontFamily:'Arial'}}>
                {/*{redirectVar}*/}
                <div class="container" style={{  backgroundColor: '#F7F7F7' }}>
                    {/* <div style = {{backgroundColor:#F7F7F7}}> */}
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-3">
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px'}}>
                            <Card >
                                {profile1}
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <Card>
                                <CardContent>
                                    <h1 style = {{fontFamily : "Arial",fontWeight:"550", fontSize : '18px'}}>Skills</h1>
                                    {profile3 /*skillset*/}
                                    {/* <div class="login-form">
                                        <div class = 'col-md-8'>
                                        <TextField type='text' variant="outlined" class='form control' name='skill' placeholder='Add more skills' size='small' onChange = {this.inputChangeHandler}/>
                                        </div>
                                        <Button onClick = {this.addSkill} style={{backgroundColor:'#0d7f02', color:'white',fontSize: '13px', fontWeight: '500', lineHeight: '20px'}}>Add</Button>
                                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                {profile2}
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <CardContent>
                                    {education1}
                                </CardContent>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <CardContent>
                                    {experience1}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Profile Component
export default Profile;
