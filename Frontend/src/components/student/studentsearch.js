import React,{Component} from 'react';
import StudentNav from './studentNavbar';
import { Card, CardContent, TablePagination, Avatar } from '@material-ui/core/';
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
            showStudent:false,
            rowsPerPage:5,
            page:0
        }
        
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.statusFilter = this.statusFilter.bind(this);
        this.viewstudent = this.viewstudent.bind(this)
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

    viewstudent=(studentId)=>{
        localStorage.setItem('sstudentId',studentId);
        this.setState({
            showStudent:true
        })
    }

    componentDidMount() {
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl+'/student/studentsearch/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data){
                    this.setState({
                        studentsList:response.data
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
                    return (student.first_name.indexOf(this.state.namesearch) > -1 || student.last_name.indexOf(this.state.namesearch) > -1 || ( student.skills.indexOf(this.state.namesearch)>-1 ))
                })
            }

            if (this.state.majorsearch){
                studentList=studentList.filter((student) => {return (student.education[0].major.indexOf(this.state.majorsearch) > -1)
                })
            }
            if(this.state.showStudent === true){
                redirectVar = <Redirect to= '/student/viewStudent'/>
            }
            

            students = (
                <div>
                {redirectVar}
                {studentList.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((student,index) => {
                // {studentList.map((student, index) => {
                return (<Card style={{marginBottom:'20px'}}>
                    <CardContent>
                        <div class="col-md-2" style={{marginTop:'20px'}}><Avatar src={student.image} style={{height:'104px', width:'104px'}} >{student.first_name[0]+student.last_name[0]}</Avatar></div>
                        <div class="col-md-9" style={{marginBottom:'16px',height:'150px'}}>
                        <div style={{fontSize: '16px', fontWeight: '700' }}><Link onClick = {()=>{this.viewstudent(student._id)}}>{student.first_name+" "+student.last_name}</Link></div>
                        {(student.college)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.college}</div>):<div></div>}
                        {(student.education.length)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.education[0].degree}</div>):<div></div>}
                        {(student.education.length)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.education[0].major}</div>):<div></div>}
                        {(student.experience.length)?(<div style={{fontSize: '16px', fontWeight: '500' }}>{student.experience[0].title+" at "+student.experience[0].company}</div>):<div></div>}
                        {(student.skills.length)?(<div style = {{fontSize: '16px', fontWeight: '500'}}>{"Skills:"+ student.skills}</div>):<div></div>}</div>
                    </CardContent>
                </Card>)
                })}
                <div class='row'>
                <div class='col-md-7'></div>
                <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={studentList.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                style={{}}
                                />
                </div> 
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
                <div style={{ padding: '0px 0px 10px' }}>
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