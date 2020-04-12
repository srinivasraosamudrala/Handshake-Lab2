import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
// import BusinessIcon from '@material-ui/icons/Business';
import WorkIcon from '@material-ui/icons/Work';
import {environment} from '../../../Utils/constants';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';


class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emptyexperience : true,
            exp_id: "",
            company: "",
            location: "",
            title: "",
            description: "",
            year_of_starting: "",
            month_of_starting: "",
            year_of_ending: "",
            month_of_ending: "",
            experience: [],
            addexp   : false,
            redirect : true,
            rerender : false,
            addexp:false,
            existingEdit:false,
        }
        this.updateInfo = this.updateInfo.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.addExperience = this.addExperience.bind(this);
        
    }
    
   
    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    updateInfo = (e) => {
        let exparr = this.state.experience
        let id     = ""
        id = e.target.value

        if (exparr.length && id.length){
            exparr.map((experience, index) => {
                if (id === experience._id){
                    this.setState(currentState =>({
                        updateprofile    : !currentState.updateprofile,
                        company     : experience.company,
                        location         : experience.location,
                        title           : experience.title,
                        description            : experience.description,
                        year_of_starting : experience.year_of_starting,
                        month_of_starting: experience.month_of_starting,
                        year_of_ending  : experience.year_of_ending,
                        month_of_ending : experience.month_of_ending
                        }))
                }
            })
        }else{
            this.setState(currentState =>({
                updateprofile : ! currentState.updateprofile,
                addexp        : ! currentState.addexp
            }))
        }
    }

    editProfile = (e) => {
        const value = e
        console.log(value)
        let expData=this.state.experience;
        console.log(this.state.experience)
        expData.map((data, index) => {
            if (data._id===value){
            this.setState({
            company: data.company,
            location: data.location,
            title: data.title,
            description: data.description,
            year_of_starting: data.year_of_starting,
            month_of_starting: data.month_of_starting,
            year_of_ending: data.year_of_ending,
            month_of_ending: data.month_of_ending
            })
        }
        })
        this.setState({
            redirect: true,
            exp_id:value,
            existingEdit:true
          
        })
    }
    cancel = (e) => {
        // e.preventDefault();
        this.setState({
            addexp:false,
            exp_id:""
        })
    }
    addexperience = (e) =>{
        this.setState({
            addexp:true,
            company: "",
            location: "",
            title: "",
            description: "",
            year_of_starting: "",
            month_of_starting: "",
            year_of_ending: "",
            month_of_ending: ""
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.profile!== undefined){
        this.setState({ experience:nextProps.profile});  
            if (this.state.experience.length) {
                this.setState({emptyexperience:false})
            }
        }
        }

    updateProfile = (e) => {
        // e.preventDefault();
        let stud_id = localStorage.getItem('studentId');
        // this.setState({
        //      redirect: false,
        //     rerender: false,
        //     addexp:false,
        //     existingEdit:false
        
        // })
        let data = null
        if (!this.state.exp_id){
            data={
                studentId: stud_id,
                experienceId:"",
                update :  { $push:{experience:[{
                    company: this.state.company,
                    location: this.state.location,
                    title: this.state.title,
                    description: this.state.description,
                    year_of_starting: this.state.year_of_starting,
                    month_of_starting: this.state.month_of_starting,
                    year_of_ending: this.state.year_of_ending,
                    month_of_ending: this.state.month_of_ending
                
                }]}}
            }
        }else
        {
        data = {
            studentId    : stud_id,
            experienceId : this.state.exp_id,
            update : {'experience.$.company': this.state.company,
            'experience.$.location': this.state.location,
            'experience.$.title': this.state.title,
            'experience.$.description': this.state.description,
            'experience.$.year_of_starting': this.state.year_of_starting,
            'experience.$.month_of_starting': this.state.month_of_starting,
            'experience.$.year_of_ending': this.state.year_of_ending,
            'experience.$.month_of_ending': this.state.month_of_ending
        }}
        }
       
        console.log(data)
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl+'/student/profile', data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    this.setState({
                        experience:response.data.experience
                    });
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
                this.cancel()
            }
            )
    }

    addExperience = (e) => {
       
        this.setState({
            addexp: true,
            exp_id:""
        })
    }
    render() {
        let experienceinput = null;
        let experience = null;
        let addexperience = null;
        let exparr = this.state.experience;
        console.log(exparr)
        let compare = (a,b) =>{
            let comparison = 0
            if (a.year_of_starting < b.year_of_starting) {
                comparison = 1;
              } else if (a.year_of_starting > b.year_of_starting) {
                comparison = -1;
              }
              return comparison;
        }
        if (exparr.length)
            exparr.sort(compare);
        
        experienceinput = (
                <CardContent>
                    <div style={{ width: '90%', paddingLeft:'20px' }} class="form-group">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Job Title</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="title" value={this.state.title} placeholder="Job Title" /><br/>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Employer</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="company" value={this.state.company} placeholder="Employer" /><br/>
                        <div class="row">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px", marginLeft:"14px"}}>Time Period</p> 
                        <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Start Year</p>  
                        <input onChange={this.inputChangeHandler} type="year" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year"  />                       
                        </div> <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" />  <br/>
                        </div>
                         <div class="col-md-3">
                         <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>End Year</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_ending" value={this.state.year_of_ending} placeholder="End Year" />
                        </div> <div class="col-md-3"> 
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_ending" value={this.state.month_of_ending} placeholder="End Month" min="1" max="12" />
                        </div> </div>   
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Location</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Enter the city in which you worked..." /><br/>
                        {/* <div class="row">    
                        <div class="col-md-6">  
                        </div> <div class="col-md-6"> */}
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Job Description</p>
                        <textarea onChange={this.inputChangeHandler} type="text" class="form-control" name="description" value={this.state.description} rows = '4' placeholder="Describe your job here" /><br/>
                        {/* </div></div>  */}
                    </div>
                    <div style = {{marginTop:"16px"}}>
                        <div class= "col-md-8"></div>
                        {(this.state.emptyexperience===false || this.state.addexp)?<div class= "col-md-2" style={{paddingLeft:'30px'}}>
                        <Button onClick={this.cancel} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: "#E0E0E0", color: 'black' ,width :"70%"}}>Cancel</Button>
                        </div>:<div class= "col-md-2"></div>}
                        <div class= "col-md-2" style={{marginBottom:"16px"}}>
                        <Button onClick={() => this.updateProfile()} variant="contained" component="span" style={{ backgroundColor: '#1569E0', color: 'white', width :"70%"}}>Save</Button>
                        </div>
                        </div>                
                </CardContent>)
        console.log(exparr.length)
        if (exparr.length === 0){
            console.log("empty experience")
            experience = experienceinput
        }else{
            experience = <div>
                {exparr.map((expdata,index) => {
                    if (expdata._id !== this.state.exp_id){
                    return(
                    <div class="row">
                    {/* {(index>0)?<hr/>:<div></div>} */}
                    <div class="col-md-10">
                    <div key={expdata._id}>
                    <p style={{fontSize:'18px'}}><WorkIcon></WorkIcon><b> {expdata.company+"  "}</b></p>
                    <p style={{fontSize:'16px'}}> {expdata.title},{expdata.location}</p>
                    <p> {expdata.month_of_starting+"/"}{expdata.year_of_starting} - {expdata.month_of_ending+"/"}{expdata.year_of_ending}</p>
                    <p><b>Job Description</b> {expdata.description} </p><br/>
                    </div></div>
                    <div class="col-md-2">
                    <IconButton onClick={()=>this.editProfile(expdata._id)} value={expdata._id} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
                    </div>                                     
                    </div>)}
                else{
                    return (<div>
                            <hr/>
                    <div style={{ width: '90%', paddingLeft:'20px' }} class="form-group">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Job Title</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="title" value={this.state.title} placeholder="Job title" /><br/>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Employer</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="company" value={this.state.company} placeholder="Employer Name" /><br/>
                        <div class="row">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px", marginLeft:"14px"}}>Time Period</p> 
                        <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Start Year</p>  
                        <input onChange={this.inputChangeHandler} type="year" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year"  />                       
                        </div> <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" />  <br/>
                        </div>
                         <div class="col-md-3">
                         <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>End Year</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_ending" value={this.state.year_of_ending} placeholder="End Year" />
                        </div> <div class="col-md-3"> 
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_ending" value={this.state.month_of_ending} placeholder="End Month" min="1" max="12" />
                        </div> </div>   
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Location</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Job Description</p>
                        
                        <textarea onChange={this.inputChangeHandler} type="text" class="form-control" name="description" value={this.state.description} rows = '4' placeholder="Describe your job here" /><br/>
                    </div>
                    <div style = {{marginTop:"16px"}}>
                        <div class= "col-md-8"></div>
                        <div class= "col-md-2" style={{paddingLeft:'30px'}}>
                        <Button onClick={this.cancel} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: "#E0E0E0", color: 'black' ,width :"70%"}}>Cancel</Button>
                        </div>
                        <div class= "col-md-2" style={{marginBottom:"16px"}}>
                        <Button onClick={() => this.updateProfile()} variant="contained" component="span" style={{ backgroundColor: '#1569E0', color: 'white', width :"70%"}}>Save</Button>
                        </div>
                        </div>  
                            <hr/>
                        </div>)
                }})
                }
            </div>
        }
        if (exparr.length){
            if(!this.state.addexp)
                addexperience = (<div>
                    <hr style={{position:'relative', left:'-20px', width : '110%'}}/>
                    <center>
                        <button style={{border:'0px',color:'#1569e0', backgroundColor:'white', fontSize:'13px',fontWeight:'bold', fontFamily:'Arial', outline: 'none'}} onClick = {this.addexperience}>Add Experience</button>
                    </center>
                </div>)
            else
                addexperience = (<div><h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px', marginBottom:'0px'}}>Add New Experience</h4>
                    {experienceinput}</div>)
        }
        return(
            <div>
            <CardContent>
                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>Experience</h4>
                {experience}
                {addexperience}
            </CardContent>
            </div>
        )
    }
}
export default Experience;
