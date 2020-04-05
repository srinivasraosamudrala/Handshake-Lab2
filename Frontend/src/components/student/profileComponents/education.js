import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import SchoolRoundedIcon from '@material-ui/icons/SchoolRounded';
import GradeOutlinedIcon from '@material-ui/icons/GradeOutlined';
import {environment} from '../../../Utils/constants';
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';


class Education extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emptyeducation : true,
            b_id: "",
            college_name: "",
            location: "",
            degree: "",
            major: "",
            cgpa: "",
            year_of_starting: "",
            month_of_starting: "",
            year_of_passing: "",
            month_of_passing: "",
            education: [],
            addsch   : false,
            redirect : true,
            rerender : false,
            addEdu:false,
            existingEdit:false,
        }
        this.updateInfo = this.updateInfo.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.cancel = this.cancel.bind(this);
        this.addEducation = this.addEducation.bind(this);
        
    }
    
   
    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    updateInfo = (e) => {
        let eduarr = this.state.education
        let id     = ""
        id = e.target.value

        if (eduarr.length && id.length){
            eduarr.map((education, index) => {
                if (id === education._id){
                    this.setState(currentState =>({
                        updateprofile    : !currentState.updateprofile,
                        college_name     : education.college_name,
                        location         : education.location,
                        degree           : education.degree,
                        major            : education.major,
                        cgpa             : education.cgpa,
                        year_of_starting : education.year_of_starting,
                        month_of_starting: education.month_of_starting,
                        year_of_passing  : education.year_of_passing,
                        month_of_passing : education.month_of_passing
                        }))
                }
            })
        }else{
            this.setState(currentState =>({
                updateprofile : ! currentState.updateprofile,
                addsch        : ! currentState.addsch
            }))
        }
    }

    editProfile = (e) => {
        const value = e
        console.log(value)
        let eduData=this.state.education;
        console.log(this.state.education)
        eduData.map((data, index) => {
            if (data._id===value){
            this.setState({
            college_name: data.college_name,
            location: data.location,
            degree: data.degree,
            major: data.major,
            cgpa: data.cgpa,
            year_of_starting: data.year_of_starting,
            month_of_starting: data.month_of_starting,
            year_of_passing: data.year_of_passing,
            month_of_passing: data.month_of_passing
            })
        }
        })
        this.setState({
            redirect: true,
            b_id:value,
            existingEdit:true
          
        })
    }
    cancel = (e) => {
        // e.preventDefault();
        this.setState({
            addsch:false,
            b_id:""
        })
    }
    addschool = (e) =>{
        this.setState({
            addsch:true,
            college_name: "",
            location: "",
            degree: "",
            major: "",
            cgpa: "",
            year_of_starting: "",
            month_of_starting: "",
            year_of_passing: "",
            month_of_passing: ""
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.profile!== undefined){
        this.setState({ education:nextProps.profile});  
            if (this.state.education.length) {
                this.setState({emptyeducation:false})
            }
        }
        }

    updateProfile = (e) => {
        // e.preventDefault();
        let stud_id = localStorage.getItem('studentId');
        // this.setState({
        //      redirect: false,
        //     rerender: false,
        //     addEdu:false,
        //     existingEdit:false
        
        // })
        let data = null
        console.log(this.state.month_of_starting)
        if (!this.state.b_id){
            data={
                studentId: stud_id,
                educationId:"",
                update :  { $push:{education:[{
                    college_name: this.state.college_name,
                    location: this.state.location,
                    degree: this.state.degree,
                    major: this.state.major,
                    cgpa: this.state.cgpa,
                    year_of_starting: this.state.year_of_starting,
                    month_of_starting: this.state.month_of_starting,
                    year_of_passing: this.state.year_of_passing,
                    month_of_passing: this.state.month_of_passing
                
                }]}}
            }
        }else
        {
        data = {
            studentId  : stud_id,
            educationId:this.state.b_id,
            update : {'education.$.college_name': this.state.college_name,
            'education.$.location': this.state.location,
            'education.$.degree': this.state.degree,
            'education.$.major': this.state.major,
            'education.$.cgpa': this.state.cgpa,
            'education.$.year_of_starting': this.state.year_of_starting,
            'education.$.month_of_starting': this.state.month_of_starting,
            'education.$.year_of_passing': this.state.year_of_passing,
            'education.$.month_of_passing': this.state.month_of_passing
        }}
        }
       
        console.log(data)
        axios.post(environment.baseUrl+'/student/profile', data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    this.setState({
                        education:response.data.education
                    });
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
                this.cancel()
            }
            )
    }

    addEducation = (e) => {
       
        this.setState({
            addEdu: true,
            b_id:""
        })
    }
    render() {
        let educationinput = null;
        let education = null;
        let addschool = null;
        let eduarr = this.state.education;
        console.log(eduarr)
        let compare = (a,b) =>{
            let comparison = 0
            if (a.year_of_starting < b.year_of_starting) {
                comparison = 1;
              } else if (a.year_of_starting > b.year_of_starting) {
                comparison = -1;
              }
              return comparison;
        }
        if (eduarr.length)
            eduarr.sort(compare);
        
        educationinput = (
                <CardContent>
                    <div style={{ width: '90%', paddingLeft:'20px' }} class="form-group">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>School Name</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="college_name" value={this.state.college_name} placeholder="School/College Name" /><br/>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Location</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
                        <div class="row">    
                        <div class="col-md-6">  
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Degree</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" />
                        </div> <div class="col-md-6">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Major</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" /><br/>
                        </div></div>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Cumulative GPA</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="cgpa" value={this.state.cgpa} style={{width : '47%'}} placeholder="CGPA" /><br/>   
                        <div class="row">    
                        <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Start Year</p>  
                        <input onChange={this.inputChangeHandler} type="year" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year"  />                       
                        </div> <div class="col-md-3">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" />  <br/>
                        </div>
                         <div class="col-md-3">
                         <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>End Year</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_passing" value={this.state.year_of_passing} placeholder="End Year" />
                        </div> <div class="col-md-3"> 
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_passing" value={this.state.month_of_passing} placeholder="End Month" min="1" max="12" />
                        </div> </div>    
                    </div>
                    <div style = {{marginTop:"16px"}}>
                        <div class= "col-md-8"></div>
                        {(this.state.emptyeducation===false || this.state.addsch)?<div class= "col-md-2" style={{paddingLeft:'30px'}}>
                        <Button onClick={this.cancel} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: "#E0E0E0", color: 'black' ,width :"70%"}}>Cancel</Button>
                        </div>:<div class= "col-md-2"></div>}
                        <div class= "col-md-2" style={{marginBottom:"16px"}}>
                        <Button onClick={() => this.updateProfile()} variant="contained" component="span" style={{ backgroundColor: '#1569E0', color: 'white', width :"70%"}}>Save</Button>
                        </div>
                        </div>                
                </CardContent>)
        console.log(eduarr.length)
        if (eduarr.length === 0){
            console.log("empty education")
            education = educationinput
        }else{
            education = <div>
                {eduarr.map((edudata,index) => {
                    if (edudata._id !== this.state.b_id){
                    return(
                    <div class="row">
                    {/* {(index>0)?<hr/>:<div></div>} */}
                    <div class="col-md-10">
                    <div key={edudata._id}>
                    <p style={{fontSize:'18px'}}><SchoolRoundedIcon></SchoolRoundedIcon><b> {edudata.college_name+"  "}{(index===0)?<button style = {{border:'0px',fontSize:'13px',outline:'none'}}>Primary Education</button>:""}</b></p>
                    <p style={{fontSize:'16px'}}> {edudata.degree},{edudata.location}</p>
                    <p> {edudata.month_of_starting+"/"}{edudata.year_of_starting} - {edudata.month_of_passing+"/"}{edudata.year_of_passing}</p>
                    <p><b>Major in</b> {edudata.major} </p>
                    <p><b>Cumulative GPA</b> {edudata.cgpa} </p>
                    </div></div>
                    <div class="col-md-2">
                    <IconButton onClick={()=>this.editProfile(edudata._id)} value={edudata._id} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
                    {/* <button onClick={this.editProfile} class="btn btn-primary" value={edudata._id} style={{backgroundColor:"#F7F7F7",color:"black"}}>edit</button>                              */}
                    </div>                                     
                    </div>)}
                else{
                    return (<div>
                            <hr/>
                    <div style={{ width: '70%', paddingLeft:'20px' }} class="form-group">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>School</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="college_name" value={this.state.college_name} placeholder="School/College Name" /><br/>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Location</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
                        <div class="row">    
                        <div class="col-md-6">  
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Degree</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" />
                        </div> <div class="col-md-6">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Major</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" /><br/>
                        </div></div>
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>CGPA</p>
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="cgpa" value={this.state.cgpa} style={{width : '47%'}} placeholder="CGPA" /><br/>   
                        <div class="row">    
                        <div class="col-md-6">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Start Year</p>  
                        <input onChange={this.inputChangeHandler} type="year" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year"  />                       
                        </div> <div class="col-md-6">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" />  <br/>
                        </div>                     
                        </div>
                        <div class="row"> 
                         <div class="col-md-6">
                         <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>End Year</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_passing" value={this.state.year_of_passing} placeholder="End Year" />
                        </div> <div class="col-md-6">
                        <p style = {{fontSize:'14px',fontWeight: 'bold', marginBottom:"0px"}}>Month</p>  
                        <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_passing" value={this.state.month_of_passing} placeholder="End Month" min="1" max="12" />
                        </div> </div>    
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
        if (eduarr.length){
            if(!this.state.addsch)
                addschool = (<div>
                    <hr style={{position:'relative', left:'-20px', width : '110%'}}/>
                    <center>
                        <button style={{border:'0px',color:'#1569e0', backgroundColor:'white', fontSize:'13px',fontWeight:'bold', fontFamily:'Arial', outline: 'none'}} onClick = {this.addschool}>Add School</button>
                    </center>
                </div>)
            else
                addschool = educationinput
        }
        return(
            <div>
            <CardContent>
                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>Education</h4>
                {education}
                {addschool}
            </CardContent>
            </div>
        )



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         let renderRedirect = null;
//         let addEduData=null;
//         console.log(this.state.education)
        
//         let eduData=this.state.education
//         if(this.state.addEdu===true){
//              addEduData = (
//         <div>
//             <Card>
//                 <CardContent>
//                 {/* <Typography color="black" gutterBottom><b><p style={{ fontSize: '24px' }}>Education Details</p></b></Typography> */}
//                     <div style={{ width: '70%' }} class="form-group">
//                         <input onChange={this.inputChangeHandler} type="text" class="form-control" name="college_name" value={this.state.college_name} placeholder="School/College Name" /><br/>
//                         <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
//                         <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" /><br/>
//                         <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" /><br/>
//                         <input onChange={this.inputChangeHandler} type="text" class="form-control" name="cgpa" value={this.state.cgpa} placeholder="CGPA" /><br/>   
//                         <div class="row">    
//                         <div class="col-md-3">           
//                         <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year"  />                       
//                         </div> <div class="col-md-3">
//                         <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" />                       
//                         </div> <div class="col-md-3">
//                         <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_passing" value={this.state.year_of_passing} placeholder="End Year" />
//                         </div> <div class="col-md-3">
//                         <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_passing" value={this.state.month_of_passing} placeholder="End Month" min="1" max="12" />
//                        </div> </div>    
//                     </div>
//                     <button onClick={this.saveProfile} class="btn btn-primary">save</button>&nbsp;
//                     <button onClick={this.cancel} class="btn btn-primary" style={{backgroundColor:"#F7F7F7",color:"black"}}>Cancel</button>
//                 </CardContent></Card><br /><br />
//         </div>
//     );
// }
// else
// {
//     addEduData=
//                 <div class="row">
//                 <div class="col-md-10">
//                     <Button color="primary" onClick={this.addEducation} style={{fontSize:"15px",left:"300px"}}>
//                         Add School
//                     </Button>
//                 </div>
//                 </div>
// }
// if (this.state.redirect === true && this.state.existingEdit===false){
//             renderRedirect = (
//                 <div>
//                     <Card>
//                         <CardContent>
//                         <Typography color="black" gutterBottom><b><p style={{ fontSize: '24px' }}>Education Details</p></b></Typography>
//                             <div style={{ width: '70%' }} class="form-group">
//                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="college_name" value={this.state.college_name} placeholder="School/College Name" /><br/>
//                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
//                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" /><br/>
//                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" /><br/>
//                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="cgpa" value={this.state.cgpa} placeholder="CGPA" /><br/>
//                                 <div class="row">    
//                         <div class="col-md-3">  
//                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year" /><br/>
//                                 </div>  <div class="col-md-3">
//                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" /><br/>
//                                 </div>  <div class="col-md-3">
//                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_passing" value={this.state.year_of_passing} placeholder="End Year" /><br/>
//                                 </div>  <div class="col-md-3">
//                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_passing" value={this.state.month_of_passing} placeholder="End Month" min="1" max="12" /><br/>
//                             </div></div>
//                             </div>
//                             <button onClick={this.saveProfile} class="btn btn-primary">save</button>&nbsp;
//                             <button onClick={this.cancel} class="btn btn-primary" style={{backgroundColor:"#F7F7F7",color:"black"}}>Cancel</button>
//                         </CardContent></Card><br /><br />
//                 </div>
//             );
//         }else if (this.state.redirect === false || this.state.rerender === true || this.state.existingEdit===true) {
   
//             renderRedirect = 
//                             <div> 
//                                     <Card>
//                                         <CardContent>
                                       
//                                             <Typography color="black" gutterBottom>
//                                                 <b><p style={{ fontSize: '24px' }}>Education Details</p></b>
//                                             </Typography>
                                        
//                                         {eduData.map((data, index) => {
//                                             console.log("inside")
//                                             console.log(data._id)
//                                             console.log(this.state.b_id)
//                                             if (data._id !== this.state.b_id)
//                                             {
//                                             return(
                                                
//                                                 <div class="row">
//                                                 <div class="col-md-10">
//                                                 <div key={data._id}>
//                                             <p><SchoolRoundedIcon></SchoolRoundedIcon><b> {data.college_name}</b></p>
//                                             <p><GradeOutlinedIcon></GradeOutlinedIcon> {data.degree}</p>
//                                             <p> {data.year_of_starting}/{data.month_of_starting}-{data.year_of_passing}/{data.month_of_passing}</p>
//                                             <p><b>Major in</b> {data.major} </p>
//                                             <p><b>Cummulative GPA</b> {data.cgpa} </p> 
//                                             <hr/>
//                                                  </div></div>
//                                         <div class="col-md-2">
//                                         <button onClick={this.editProfile} class="btn btn-primary" value={data._id} style={{backgroundColor:"#F7F7F7",color:"black"}}>edit</button>
                                   
//                                         </div>
                                        
//                                             </div>)   }
//                                         else
//                                         {
                                        
//                                             return(
//                                                 <div>
//                                                     <Card>
//                                                         <CardContent>
//                                                         {/* <Typography color="black" gutterBottom><b><p style={{ fontSize: '24px' }}>Education Details</p></b></Typography> */}
//                                                             <div style={{ width: '70%' }} class="form-group">
//                                                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="college_name" value={this.state.college_name} placeholder="School/College Name" /><br/>
//                                                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="location" value={this.state.location} placeholder="Location" /><br/>
//                                                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" /><br/>
//                                                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" /><br/>
//                                                                 <input onChange={this.inputChangeHandler} type="text" class="form-control" name="cgpa" value={this.state.cgpa} placeholder="CGPA" /><br/>
//                                                                 <div class="row">
//                                                                 <div class="col-md-3">
//                                                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_starting" value={this.state.year_of_starting} placeholder="Start Year" /><br/>
//                                                                </div>  <div class="col-md-3">
//                                                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_starting" value={this.state.month_of_starting} placeholder="Start Month" min="1" max="12" /><br/>
//                                                                 </div>  <div class="col-md-3">
//                                                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year_of_passing" value={this.state.year_of_passing} placeholder="End Year" /><br/>
//                                                                 </div>  <div class="col-md-3">
//                                                                 <input onChange={this.inputChangeHandler} type="number" class="form-control" name="month_of_passing" value={this.state.month_of_passing} placeholder="End Month" min="1" max="12" /><br/>
//                                                             </div></div>
//                                                             </div>
//                                                             <button onClick={this.saveProfile} class="btn btn-primary">save</button>&nbsp;
//                                                             <button onClick={this.cancel} class="btn btn-primary" style={{backgroundColor:"#F7F7F7",color:"black"}}>Cancel</button>
//                                                         </CardContent></Card><br /><br />
//                                                 </div>
//                                             )
//                                         }                                       
//                                           }
        //                                  )} 
                                        
        //                                {addEduData}
                                       
                                        
        //                                 </CardContent>
        //                             </Card>
        //                             <br /><br />
                            
        //                 </div>
           
        // }
        // return (
        //     <div>
        //         {renderRedirect}
        //     </div>
        // )
    }
}
export default Education;
