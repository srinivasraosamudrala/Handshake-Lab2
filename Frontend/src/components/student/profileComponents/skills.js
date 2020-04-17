import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { environment } from '../../../Utils/constants';
import TextField from '@material-ui/core/TextField';
import { Chip } from '@material-ui/core/';

class Skillset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skillSet: "",
            newSkill: "",
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.deleteSkill = this.deleteSkill.bind(this);
        this.addSkill = this.addSkill.bind(this);
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            skillSet: nextProps.profile,
            newSkill: nextProps.addskill
        })
    }

    deleteSkill = e => {
        let data = {};
        let skillstr = "";
        let tempskillSet = this.state.skillSet.split(",");
        tempskillSet.splice(e, 1);
        skillstr = tempskillSet.toString();
        data = {
            studentId: localStorage.getItem('studentId'),
            update: { skills: skillstr }
        };
        this.props.updateSkill(data)
        //set the with credentials to true
        // axios.defaults.withCredentials = true;
        // axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        // //make a post request with the user data
        // axios.post(environment.baseUrl + '/student/profile', data)
        //     .then(response => {
        //         if (response.data) {
        //             this.setState({
        //                 skillSet: response.data.skills
        //             })
        //         } else {
        //             console.log(response.data.error)
        //         }
        //     })
    }

    addSkill = (e) => {
        let data = {}
        let tempskillSet = this.state.skillSet;
        let tempskillSet1 = this.state.newSkill;
        let duplicate = false;

        tempskillSet1 = tempskillSet1.charAt(0).toUpperCase() + tempskillSet1.slice(1)

        if (tempskillSet && tempskillSet.indexOf(tempskillSet1) === -1)
            tempskillSet = tempskillSet + "," + tempskillSet1
        else if (!tempskillSet)
            tempskillSet = tempskillSet1
        else
            duplicate = true

        if (!duplicate) {
            let skillstr = tempskillSet;

            data = {
                studentId: localStorage.getItem('studentId'),
                update: { skills: skillstr }
            };
            this.props.updateSkill(data)

            // //set the with credentials to true
            //     axios.defaults.withCredentials = true;
            //     axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            // //make a post request with the user data
            //     axios.post(environment.baseUrl+'/student/profile', data)
            //     .then(response => {
            //         if (response.data) {
            //             this.setState({
            //                 skillSet: response.data.skills,
            //                 newSkill: ""
            //             })
            //         } else {
            //             console.log(response.data.error)
            //         }
            //     })
        } else {
            this.setState({
                newSkill: ""
            })
        }

    }

    render() {
        let profile = null;

        if (this.state.skillSet) {
            let skillSet = this.state.skillSet.split(",");
            profile = (
                <div style={{ marginBottom: '10px' }}>
                    {skillSet.map((data, index) => {
                        return (
                            <Chip
                                key={index}
                                label={data}
                                onDelete={() => this.deleteSkill(index)}
                                style={{ marginRight: '8px', marginBottom: '8px', borderRadius: '3px', color: '#575757', fontSize: '13px', lineHeight: '15px', fontWeight: 500 }}
                            />
                        )
                    })}
                </div>
            )
        }

        return (
            <div>
                <Card>
                    <CardContent>
                        <h1 style={{ fontFamily: "Arial", fontWeight: "550", fontSize: '18px' }}>Skills</h1>
                        {profile /*skillset*/}
                        <div class="login-form">
                            <div class='col-md-8'>
                                <TextField type='text' variant="outlined" class='form control' name='newSkill' value={this.state.newSkill} placeholder='Add new skills' size='small' onChange={this.inputChangeHandler} />
                            </div>
                            <Button onClick={this.addSkill} style={{ backgroundColor: '#0d7f02', color: 'white', fontSize: '13px', fontWeight: '500', lineHeight: '20px' }}>Add</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
export default Skillset;
