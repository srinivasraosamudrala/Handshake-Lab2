import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {environment} from '../../../Utils/constants';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';



class CareerObj extends Component {
    constructor(props) {
        super(props);
        this.state = {
            careerObj: "",
            updateprofile:false,
            careerObj_preferred:""
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    componentWillReceiveProps(nextProps) {     
            this.setState({
                careerObj:nextProps.profile,
                updateprofile:nextProps.updatecareerobj
            })
            }

    updateProfile = (e) => {
        const data = {
            studentId: localStorage.getItem('studentId'),
            update:{career_objective: this.state.careerObj_preferred}
            }
            this.props.updateCareerObj(data)
            // axios.defaults.withCredentials = true;
            // axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            // axios.post(environment.baseUrl+'/student/profile', data)
            //     .then(response => {
            //         if (response.data) {
            //             this.setState({
            //                 careerObj : response.data.career_objective,
            //                 updateprofile: false
            //             })
            //         } else {
            //             console.log(response.data.error)
            //         }
            //     })
            }

    updateInfo = (e) => {
        let careerObj_preferred = this.state.careerObj
        this.setState(currentState =>({
            updateprofile: !currentState.updateprofile,
            careerObj_preferred: careerObj_preferred
            }))
    }

    render() {
        let profile2 = null;
        if (!this.state.careerObj) {
            profile2 = (<CardContent>
                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>My Journey</h4>
                <Typography style = {{fontSize : '14px',fontFamily : "Suisse Int'l", color:"#1569E0"}}>What are you passionate about? What are you looking for on Handshake? What are your experiences or skills?</Typography>
                <div class="login-form">
                    <textarea onChange = {this.inputChangeHandler} onFocus = {this.profile2SaveButton} onBlur = {this.profile2SaveButton} style = {{padding:"2px", width : "100%",borderRadius:"4px"}} name = "careerObj_preferred" rows = "4" placeholder = "Type your introduction..."></textarea><br/>
                    <div style = {{textAlign:"right"}}>
                    <Button onClick={() => {this.updateProfile('careerObj')}} variant="contained" component="span" style={{ backgroundColor: '#0D7F02', color: 'white' }}>save</Button>
                    </div>
                </div>
            </CardContent>)
        }else if(this.state.updateprofile){
            profile2 = (<CardContent>
                <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>My Journey</h4>
                <Typography style = {{fontSize : '14px',fontFamily : "Suisse Int'l", color:"#1569E0"}}>What are you passionate about? What are you looking for on Handshake? What are your experiences or skills?</Typography>
                <div class="login-form">
                <textarea onChange = {this.inputChangeHandler} style = {{padding:"2px", width : "100%",borderRadius:"4px"}} name = "careerObj_preferred" rows = "4" placeholder = "Type your introduction..." value={this.state.careerObj_preferred}></textarea><br/>
                <div style = {{textAlign:"right"}}>
                <Button onClick={this.updateInfo} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: '"#E0E0E0"', color: 'black' }}>Cancel</Button>
                <Button onClick={() => this.updateProfile('careerObj')} variant="contained" component="span" style={{ backgroundColor: '#0D7F02', color: 'white' }}>Save</Button>
                </div>
                </div>
            </CardContent>)
        }else{
            profile2 = (<CardContent>
                <div class = "row">
                <div class="col-md-9" >
                    <h4 style = {{fontFamily : "Arial",fontWeight:"700", fontSize : '18px'}}>My Journey</h4>
                </div>
                <div class="col-md-3" style={{ textAlign: '-webkit-right' }}>
                    <IconButton onClick={this.updateInfo} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
                </div>
                </div>
                <div class = "row">
                    <div style={{paddingLeft:"16px"}} >
                        <h4 style = {{fontSize:"24px"}}>{this.state.careerObj}</h4>
                    </div>
                </div>
            </CardContent>)
        }
        return (
            <div>
                <Card >
                    {profile2}
                </Card>
            </div>
        )
    }
}
export default CareerObj;
