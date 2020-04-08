import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, Chip } from '@material-ui/core/';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { connect } from "react-redux";
import Icon from '@material-ui/core/Icon';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TextField from '@material-ui/core/TextField';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'
import { saveProfileData } from "../../redux/actions/index";
import Profile1 from "./profileComponents/profile1";
import CareerObj from './profileComponents/careerobj';
import Skillset from './profileComponents/skills';
import PersonalInfo from './profileComponents/personalinfo';
import Education from './profileComponents/education';
import Experience from './profileComponents/experience';

//Define a Login Component
class Profile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            profiledata:"",
            studentId: "",
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
            editexperience:false,
            educationnotempty:false,
            experiencenotempty:false,
            emptyprofilepic:emptyPic
        }
        //Bind the handlers to this class
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        // this.updateProfile = this.updateProfile.bind(this);
        // this.updateInfo = this.updateInfo.bind(this);
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
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.get(environment.baseUrl+'/student/profile/' + localStorage.getItem('studentId'))
            .then((response) => {
                //update the state with the response data
                if(response.data){
                console.log(response.data)
                this.props.saveProfileData(response.data)
                const data = response.data
                let tempskillSet = data[0].skills
                let tempskillSetarr = [];

                console.log(tempskillSet)
                if(tempskillSet)
                   tempskillSetarr = tempskillSet.split(',')

                    var base64Flag = 'data:image/jpeg;base64,';
                    
                    // if (data[0].image !== null) {
                    //     var imgstring = this.arrayBufferToBase64(data.info[0].profilepic.data);
                    //      data[0].image = base64Flag + imgstring
                    // }

                this.setState({
                    profiledata:data[0],
                    // firstname: data.education[0].firstName,
                    // profile1_preferred:data.education[0].firstName,
                    // lastname: data.education[0].lastName,
                    // profile1_last:data.education[0].lastName,
                    // college: data.education[0].college,
                    // degree: data.education[0].degree,
                    // major: data.education[0].major,
                    // gpa: data.education[0].cgpa,
                    // year:data.education[0].year,
                    // college_preferred: data.education[0].college,
                    // degree_preferred: data.education[0].degree,
                    // major_preferred: data.education[0].major,
                    // cgpa_preferred: data.education[0].cgpa,
                    // year_preferred:data.education[0].year,
                    // careerobj: data.basic[0].career_obj,
                    // skillSet:tempskillSetarr,
                    // profilepic1:data.info[0].profilepic,
                    // companyname:data.work[0].companyName,
                    // title:data.work[0].Title,
                    // startDate:data.work[0].startDate,
                    // endDate:data.work[0].endDate,
                    // location:data.work[0].Location,
                    // workdesc:data.work[0].workDesc,
                    // companyname_preferred:data.work[0].companyName,
                    // title_preferred:data.work[0].Title,
                    // startDate_preferred:data.work[0].startDate,
                    // endDate_preferred:data.work[0].endDate,
                    // location_preferred:data.work[0].Location,
                    // workdesc_preferred:data.work[0].workDesc,
                })

                console.log(this.state.profiledata)

                if (data[0].education.college)
                {
                    console.log("education")
                    this.setState({
                        educationnotempty:true
                    })
                }

                if (data[0].experience.companyName)
                {
                    this.setState({
                        experiencenotempty:true
                    })
                }
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
                        workdesc:this.state.workdesc_preferred,
                        editexperience: !this.state.editexperience
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
                                cgpa:this.state.cgpa_preferred,
                                editeducation: !this.state.editeducation
                            })
                            console.log(response.data.result)
                        } else {
                            console.log(response.data.error)
                        }})
                        this.setState({
                            editeducation: !this.state.editeducation
                        })
                    }

    


    //submit Login handler to send a request to the node backend
    // updateProfile = (e) => {
    //     //var headers = new Headers();
    //     //prevent page from refresh
    //     let data = {};
    //     if (e === 'name') {
    //         data = {
    //             type: 'name',
    //             studentId: this.state.studentId,
    //             firstname: this.state.profile1_preferred,
    //             lastname: this.state.profile1_last
    //         }
    //     }
    //     console.log(data)
    //     //set the with credentials to true
    //     axios.defaults.withCredentials = true;

    //     //make a post request with the user data
    //     axios.post(environment.baseUrl+'/student/profile', data)
    //         .then(response => {
    //             console.log(response.data)
    //             if (response.data.result) {
    //                 this.setState({
    //                     firstname: data.firstname,
    //                     lastname: data.lastname
    //                 })
    //                 this.readstudentdata()
    //                 console.log(response.data.result)
    //             } else {
    //                 console.log(response.data.error)
    //             }
    //             if (data.type === "name"){
    //             this.setState(currentState => ({
    //                 updateprofile1: !currentState.updateprofile1
    //             }))}
    //         })
    // }

    //     //submit Login handler to send a request to the node backend
    //     updateProfilefun2 = (e) => {
    //         //var headers = new Headers();
    //         //prevent page from refresh
    //         let data = {};
    //         if(e === 'careerobj'){
    //             data = {
    //                 type:'careerobj',
    //                 studentId:this.state.studentId,
    //                 careerobj:this.state.newcareerobj
    //             }
    //         }
    //         console.log(data)
    //         //set the with credentials to true
    //         axios.defaults.withCredentials = true;
    
    //         //make a post request with the user data
    //         axios.post(environment.baseUrl+'/student/profile', data)
    //             .then(response => {
    //                 console.log(response.data)
    //                 if (response.data.result) {
    //                     this.setState({
    //                         careerobj: data.careerobj
    //                     })
    //                     console.log(response.data.careerobj)
    //                 } else {
    //                     console.log(response.data.error)
    //                 }
    //                     this.setState({
    //                         updateprofile2 : false
    //                     })
    //                     console.log(this.state.updateprofile2)
    //             })
    //     }

    // updateInfo = (e) => {
    //     this.setState(currentState =>({
    //         updateprofile1: !currentState.updateprofile1
    //     }))
    //     console.log(this.state.updateprofile1)
    // }

    // updateInfo2 = (e) => {
    //     this.setState(currentState =>({
    //         updateprofile2: !currentState.updateprofile2
    //     }))
    //     console.log(this.state.updateprofile2)
    // }

    // profile2SaveButton = e =>{
    //     this.setState(currentState =>({
    //         profile2focus : !currentState.profile2focus
    //     }))
    //     console.log(this.state.profile2focus)
    // }

    // deleteSkill = e =>{
    //     let data = {};
    //     let skillstr = "";
    //     let tempskillSet = this.state.skillSet;

    //     tempskillSet.splice(e,1);

    //     skillstr = tempskillSet.toString();
        
    //     console.log(skillstr)
    //             data = {
    //                 type:'skillSet',
    //                 studentId:this.state.studentId,
    //                 skillSet:skillstr
    //             };
    //         //set the with credentials to true
    //             axios.defaults.withCredentials = true;
    
    //         //make a post request with the user data
    //             axios.post(environment.baseUrl+'/student/profile', data)
    //             .then(response => {
    //                 console.log(response.data)
    //                 if (response.data.result) {
    //                     this.setState({
    //                         skillSet: tempskillSet
    //                     })
    //                     console.log(response.data.skillSet)
    //                 } else {
    //                     console.log(response.data.error)
    //                 }
    //             })
    // }

    // addSkill = (e)=>{
    //     let data = {}
    //     let tempskillSet = this.state.skillSet;
    //     let skillstr = "";
    //     if (tempskillSet)
    //         tempskillSet.push(this.state.skill)
    //     else
    //         tempskillSet = [this.state.skill]
            
    //     skillstr = tempskillSet.toString();

    //     data = {
    //         type:'skillSet',
    //         studentId:this.state.studentId,
    //         skillSet:skillstr
    //     };
    //     console.log(data)
    // //set the with credentials to true
    //     axios.defaults.withCredentials = true;

    // //make a post request with the user data
    //     axios.post(environment.baseUrl+'/student/profile', data)
    //     .then(response => {
    //         console.log(response.data)
    //         if (response.data.result) {
    //             this.setState({
    //                 skillSet: tempskillSet
    //             })
    //             console.log(this.state.skillSet)
    //         } else {
    //             console.log(response.data.error)
    //         }
    //     })

    // }

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
        let profile1_props = null;
        // if (!cookie.load('studentcookie')) {
        //     redirectVar = <Redirect to='/student/login' />

        // }

        //Profile 1 render update


//profile2 render update
       

        if (this.state.editeducation === true || !this.state.educationnotempty)
         {
             console.log("in")
            education1 = (<div>
                                <h4 style={{fontWeight:'600'}}>Education</h4>
                                <div style={{paddingLeft:'20px'}}>
                                    <div style={{fontWeight:'600',marginBottom:'3px'}}>School Name</div>
                                    <input onChange={this.inputChangeHandler} name="college_preferred" variant="outlined" class='form control' value={this.state.college_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                    <div style={{fontWeight:'600',marginBottom:'3px'}}>Education Level</div>
                                    <input onChange={this.inputChangeHandler} name="degree_preferred" variant="outlined" class='form control' value={this.state.degree_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                    <div style={{fontWeight:'600',marginBottom:'3px'}}>Year</div>
                                    <input onChange={this.inputChangeHandler} name="year_preferred" variant="outlined" class='form control' value={this.state.year_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                    <div style={{fontWeight:'600',marginBottom:'3px'}}>Major</div>
                                    <input onChange={this.inputChangeHandler} name="major_preferred" variant="outlined" class='form control' value={this.state.major_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                    <div style={{fontWeight:'600',marginBottom:'3px'}}>CGPA</div>
                                    <input onChange={this.inputChangeHandler} name="cgpa_preferred" variant="outlined" class='form control' value={this.state.cgpa_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} /><br/>
                                    <div className="row">
                                        <div className="col-md-6"></div>
                                        <div className="col-md-6">
                                        <Button variant='outlined' style={{marginRight:'10px'}} onClick={()=>{this.updateEducation()}}>Save</Button>
                                        <Button variant='outlined' onClick={()=>{this.seteditEducation()}}>Cancel</Button></div>
                                    </div>
                                    
                                </div>
                            </div>)
        }
            else if(this.state.educationnotempty){
            education1 = (<div>
                <div className = 'row'>
                <div className = 'col-md-11'>
                    <h4 style={{fontWeight:'600'}}>Education</h4>
                </div>
                <div className = 'col-md-1'>
                <IconButton onClick={this.seteditEducation} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
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
                        <Link style={{textDecoration:'0',color:'#1569e0',position:"relative",left:'270px',marginBottom:'10px',fontWeight:'600'}}>Add School</Link>
                    </div>
                </div>)
        }

        if (this.state.editexperience || !this.state.experiencenotempty)
        {
           experience1 = (<div>
                               <h4 style={{fontWeight:'600'}}>Experience</h4>
                               <div style={{paddingLeft:'20px'}}>
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>Company Name</div>
                                   <input onChange={this.inputChangeHandler} name="companyname_preferred" variant="outlined" class='form control' value={(this.state.companyname_preferred !== null)?(this.state.companyname_preferred):""} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>Title</div>
                                   <input onChange={this.inputChangeHandler} name="title_preferred" variant="outlined" class='form control' value={(this.state.title_preferred !== null)?(this.state.title_preferred):""} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>Location</div>
                                   <input onChange={this.inputChangeHandler} name="location_preferred" variant="outlined" class='form control' value={(this.state.location_preferred !== null)?(this.state.location_preferred):""} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>Start Date</div>
                                   <input onChange={this.inputChangeHandler} type='date' name="startDate_preferred" variant="outlined" class='form control' value={this.state.startDate_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} />
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>End Date</div>
                                   <input onChange={this.inputChangeHandler} type='date' name="endDate_preferred" variant="outlined" class='form control' value={this.state.endDate_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} /><br/>
                                   <div style={{fontWeight:'600',marginBottom:'3px'}}>Work Description</div>
                                   <input onChange={this.inputChangeHandler} name="workdesc_preferred" variant="outlined" class='form control' value={this.state.workdesc_preferred} style={{ marginBottom: '5px', width:'60%',height:'30px',borderRadius:'3px',border:'solid 1px',borderColor:'#ADADAD'}} /><br/>
                                    <div className="row">
                                       <div className="col-md-6"></div>
                                       <div className="col-md-6">
                                       <Button variant='outlined' style={{marginRight:'10px'}} onClick={()=>{this.updateExperience()}}>Save</Button>
                                       <Button variant='outlined' onClick={()=>{this.seteditExperience()}}>Cancel</Button></div>
                                   </div>
                                   
                               </div>
                           </div>)
       }
           else{
           experience1 = (<div>
               <div className = 'row'>
               <div className = 'col-md-11'>
                   <h4 style={{fontWeight:'600'}}>Experience</h4>
               </div>
               <div className = 'col-md-1'>
               <IconButton onClick={()=>{this.seteditExperience()}} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
               </div>
               </div>
                   <div style={{paddingLeft:'20px'}}>
                       <h4 style={{fontWeight:'600',marginBottom:'3px'}}>{this.state.title}</h4>
                       <div style={{fontWeight:'500' ,fontSize:'16px'}}>{"At "+this.state.companyname+", " + this.state.location}</div>
                       {this.state.startDate?(<div>{"Period: From "+this.state.startDate.slice(0,10)+" to " +this.state.endDate.slice(0,10)}</div>):<div></div>}
                       <div style={{marginTop:'10px'}}>{this.state.workdesc}</div>
                   </div>
               </div>)
       }
        if (this.state.authError === true) {
            invalid = <p>Invalid Credentials</p>
        }
        return (
            <div style={{ width: "95%", backgroundColor: '#F7F7F7', fontFamily:'Arial'}}>
                <div class="container" style={{  backgroundColor: '#F7F7F7' }}>
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-3">
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px'}}>
                            <Profile1 profile = {this.state.profiledata}/>
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <Skillset profile = {this.state.profiledata.skills} />
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <PersonalInfo profile = {this.state.profiledata}/>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <CareerObj profile = {this.state.profiledata.career_objective}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                {console.log(this.state.profiledata)}
                                {console.log(this.state.profiledata.education)}
                                <Education profile = {this.state.profiledata.education}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <Experience profile = {this.state.profiledata.experience}/>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Profile Component
//export default Profile;
// const mapStateToProps = state => {
//     return {
//         user: state.user,
//     };
// };


// export default connect(mapStateToProps, null)(Profile);
const mapStateToProps = state => {
    return {
        profile: state.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        saveProfileData: payload => dispatch(saveProfileData(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);