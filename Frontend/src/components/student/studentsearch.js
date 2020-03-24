import React,{Component} from 'react';
import StudentNav from './studentNavbar';
import { Card, CardContent, Button, IconButton, InputBase, Avatar } from '@material-ui/core/';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import viewStudent from './viewstudent.js';
import {environment} from '../../Utils/constants'

//create the Student Home Component
class StudentSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            studentId: "",
            studentsList: null,
            namesearch: "",
            majorsearch:"",
            studentprofilepic:[],
            showStudent:false
        }
        
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.statusFilter = this.statusFilter.bind(this);
        this.viewstudent = this.viewstudent.bind(this)
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
        console.log(this.state.namesearch)
    }

    statusFilter(e){
        console.log(e)
        this.setState({
            status:e.target.value
        })
    }

    viewstudent=()=>{
        this.setState({
            showStudent:true
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
        axios.get(environment.baseUrl+'/student/studentsearch/' + localStorage.getItem('studentId'))
            .then((response) => {
                // console.log(response.data)
                this.setState({
                    studentsList : response.data.result
                })
                if (response.data.result){
                var base64Flag = 'data:image/jpeg;base64,';
                response.data.result.map((student,index) => {
                    console.log("profile")
                    if (student.profilepic!== null) {
                        var imgstring = this.arrayBufferToBase64(student.profilepic.data);
                         student.profilepic = base64Flag + imgstring
                         console.log(student.profilepic)
                    }
                    console.log(student.profilepic)
                } )
                this.setState({
                    studentList:response.data.result
                })}
                console.log(this.state.studentsList)
            })
    }

    render(){
        let students = null;
        let studentList = this.state.studentsList;
        let redirectVar  = null;
        
        
        if (studentList){
            console.log(studentList)
            if (this.state.namesearch){
                console.log(this.state.namesearch)
                studentList=studentList.filter((student) => {
                    return (student.firstName.indexOf(this.state.namesearch) > -1 || student.lastName.indexOf(this.state.namesearch) > -1 || ( student.skillset && student.skillset.indexOf(this.state.namesearch)>-1 ))
                })
            }

            if (this.state.majorsearch){
                studentList=studentList.filter((student) => {
                    if (student.major !== null)
                    return (student.major.indexOf(this.state.majorsearch) > -1 || student.major.indexOf(this.state.majorsearch) > -1)
                })
            }
            if(this.state.showStudent === true){
                redirectVar = <Redirect to= '/student/viewStudent'/>
            }
            

            students = (
                <div>
                {redirectVar}
                {studentList.map((student, index) => {
                return (<Card style={{marginBottom:'20px'}}>
                    <CardContent>
                        <div class="col-md-1" style={{marginTop:'20px'}}><Avatar src={student.profilepic} style={{height:'70', width:'70'}} >{student.firstName[0]+student.lastName[0]}</Avatar></div>
                        <div class="col-md-9" style={{marginBottom:'16px',height:'150px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700' }}><Link onClick = {()=>{localStorage.setItem('sstudentId',student.studentId);this.viewstudent()}}>{student.firstName+" "+student.lastName}</Link></div>
                        {(student.college)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.college}</div>):<div></div>}
                        {(student.college)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.degree}</div>):<div></div>}
                        {(student.college)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.major}</div>):<div></div>}
                        {(student.college)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.jobtitle+" at "+student.companyName}</div>):<div></div>}
                        {(student.college)?(<div style = {{fontSize: '16px', fontWeight: '500'}}>{"Skills:"+ student.skillset}</div>):<div></div>}</div>
                    </CardContent>
                </Card>)
                })} 
                </div>
        )}


       return(<div>
        <StudentNav comp="studentsearch" />
                <div style={{ paddingLeft: '5%', paddingRight: '5%', fontFamily: 'Arial' }}>
                <div class="col-md-3">
                    <Card>
                        <CardContent>
                            <div style = {{marginBottom:'15px'}}>
                            <div style={{fontWeight:'550',fontSize:'16px',marginBottom:'20px'}}>Filters</div>
                            <div style={{fontWeight:'550',fontSize:'13px',padding:'16px'}}>Name</div>
                            <div style={{ width: "100%",padding:'16px'}}><input type="text" name="namesearch" id="namesearch" placeholder="Enter a name or a skill" onChange={this.inputChangeHandler}/></div>
                            </div>
                            <div>
                            <div style={{fontWeight:'550',fontSize:'13px',padding:'16px'}}>Major</div>
                            <div style={{ width: "100%",padding:'16px'}}><input type="text" name="majorsearch" id="majorsearch" placeholder="Enter a major..." onChange={this.inputChangeHandler}/></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div style={{ padding: '24px 0px 16px' }}>
                    <div class="col-md-9" style={{ padding: '0px' }}>
                        {students}
                    </div>
                </div>
        </div>
        </div>
       )
}
}

export default StudentSearch;