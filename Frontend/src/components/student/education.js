import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import {Card, CardActions,CardContent,Button,Typography }from '@material-ui/core';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import {environment} from '../../Utils/constants'

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
class Education extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //education
            clg: "",
            loc: "",
            degree: "",
            major: "",
            year: "",
            cgpa: "",
            dataRetrieved: false,
            redirect: false,
            profileData: [],
            rerender: false,
        }
        this.editProfile = this.editProfile.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    inputChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    editProfile = (e) => {
        var headers = new Headers();
        e.preventDefault();
        this.setState({
            redirect: true
        })
    }
    cancel = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        //   window.history.back();
        this.setState({
            redirect: false
        })
    }
    saveProfile = (e) => {
        var headers = new Headers();
        e.preventDefault();
        let stud_id = sessionStorage.getItem('id');
        this.setState({
            redirect: false,
            rerender: false
        })
        const edit_data = {
            id: stud_id,
            clg: this.state.clg,
            loc: this.state.loc,
            degree: this.state.degree,
            major: this.state.major,
            year: this.state.year,
            cgpa: this.state.cgpa,
            type: "education"
        }
        const data = {
            id: stud_id,
            type: "education"
        }
        axios.post(environment.baseUrl+'/student/student_profile', edit_data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data.rows)
                if (response.data.rows) {
                    this.setState({
                        rerender: true
                    });
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
            }
            )
            .then(response => {
                axios.post(environment.baseUrl+'/student/get_student_education', data)
                    .then(response => {
                        console.log("in frontend after response");
                        console.log(response.data.rows)
                        if (response.data.rows.length) {
                            this.setState({
                                dataRetrieved: true,
                                profileData: response.data.rows,
                                rerender: true
                            });
                        } else if (response.data.error) {
                            console.log("response" + response.data.error)
                        }
                    })
            })
    }
    componentDidMount() {
        let stud_id = sessionStorage.getItem('id');
        console.log("inside did mount")
        console.log(stud_id)
        const data = {
            id: stud_id,
            type: "education"
        }
        console.log(data)
        axios.post(environment.baseUrl+'/student/get_student_education', data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data.rows)
                if (response.data.rows.length) {
                    this.setState({
                        dataRetrieved: true,
                        profileData: response.data.rows,
                        clg: response.data.rows[0].clg,
                        loc: response.data.rows[0].loc,
                        degree: response.data.rows[0].degree,
                        major: response.data.rows[0].major,
                        year: response.data.rows[0].year,
                        cgpa: response.data.rows[0].cgpa
                    });
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
            })
    }
    render() {
        let renderRedirect = null;
        let profileData = this.state.profileData;
        console.log(profileData)
        if (this.state.redirect === true || profileData.length == 0) {
            renderRedirect = (
                <div>
                    <Card>
                        <CardContent>
                        <Typography color="black" gutterBottom><b><p style={{ fontSize: '24px' }}>Education</p></b></Typography>
                            <div style={{ width: '30%' }} class="form-group">
                                <input onChange={this.inputChangeHandler} type="text" class="form-control" name="clg" value={this.state.clg} placeholder="College" />
                                <input onChange={this.inputChangeHandler} type="text" class="form-control" name="loc" value={this.state.loc} placeholder="Location" />
                                <input onChange={this.inputChangeHandler} type="text" class="form-control" name="degree" value={this.state.degree} placeholder="Degree" />
                                <input onChange={this.inputChangeHandler} type="text" class="form-control" name="major" value={this.state.major} placeholder="Major" />
                                <input onChange={this.inputChangeHandler} type="number" class="form-control" name="year" value={this.state.year} placeholder="Year" min="1900" max="2020" />
                                <input onChange={this.inputChangeHandler} type="number" class="form-control" name="cgpa" value={this.state.cgpa} placeholder="CGPA" step="0.01" />
                            </div>
                            <button onClick={this.saveProfile} class="btn btn-primary">save</button>&nbsp;
                            <button onClick={this.cancel} class="btn btn-primary" style={{backgroundColor:"#F7F7F7",color:"black"}}>Cancel</button>
                        </CardContent></Card><br /><br />
                </div>
            );
        }
        else if (this.state.redirect === false || this.state.rerender === true) {
            if (profileData.length > 0) {
                renderRedirect = (
                    profileData.map((data, index) => {
                        return (
                            <div>
                                <div key={data.stud_id}>
                                    <Card>
                                        <CardContent>
                                        <div class="row">
                                            <div class="col-md-10">
                                            <Typography color="black" gutterBottom>
                                            <b><p style={{ fontSize: '24px' }}>Education</p></b>
                                            </Typography>
                                            </div>
                                            <div class="col-md-2">
                                            <CreateOutlinedIcon onClick={this.editProfile} style={{ alignContent: 'right',height:"15px",width:"15px" }}></CreateOutlinedIcon>
                                            </div>
                                            </div>
                                            <p>{data.clg}</p>
                                            <p>{data.loc}</p>
                                            <p>{data.degree} {data.major} {data.year} </p>
                                        </CardContent>
                                    </Card>
                                    <br /><br />
                                </div>
                                {/* <div class="container">
                                    <div class="login-form">
                                        <div class="main-div">
                                            <button onClick={this.editProfile} class="btn btn-primary">Edit Profile</button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        )
                    }))
            }
        }
        return (
            <div>
                {renderRedirect}
            </div>
        )
    }
}
export default Education;





