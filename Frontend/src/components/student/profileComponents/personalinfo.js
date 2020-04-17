import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import CakeIcon from '@material-ui/icons/Cake';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { environment } from '../../../Utils/constants';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import emptyPic from '../../../images/empty-profile-picture.png';
// import {KeyboardDatePicker} from '@material-ui/pickers';

class Profile1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profiledata: null,
            redirect: true,
            rerender: false,
            updateprofile: false,
            image: emptyPic,
            profile1_preferred: "",
            profile1_last: ""
        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.profile)
        let profile_props = null
        if (nextProps.profile) {
            profile_props = {
                email: nextProps.profile.email,
                mobile: nextProps.profile.mobile,
                dob: nextProps.profile.dob,
                city: nextProps.profile.city,
                state: nextProps.profile.state,
                country: nextProps.profile.country
            }
        }
        console.log(profile_props)

        this.setState({
            profiledata : profile_props,
            image : nextProps.profile.image,
            updateprofile : nextProps.updatepersonalinfo
        })
    }

    updateProfile = (e) => {
        const data = {
            studentId: localStorage.getItem('studentId'),
            update: {
                email: this.state.email_preferred,
                mobile: this.state.mobile_preferred,
                dob: this.state.dob_preferred,
                city: this.state.city_preferred,
                state: this.state.state_preferred,
                country: this.state.country_preferred
            }
        }

        console.log(data)

        this.props.updatePersonalInfo(data)
        // axios.defaults.withCredentials = true;
        // axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        // axios.post(environment.baseUrl+'/student/profile', data)
        //     .then(response => {
        //         console.log(response.data)
        //         if (response.data) {
        //             let profiledata = {
        //                 email   : response.data.email,
        //                 mobile  : response.data.mobile,
        //                 dob     : response.data.dob,
        //                 city    : response.data.city,
        //                 state   : response.data.state,
        //                 country : response.data.country}
        //             this.setState({
        //                 profiledata : profiledata
        //             })
        //         } else {
        //             console.log(response.data.error)
        //         }
        //         this.setState(currentState => ({
        //             updateprofile: !currentState.updateprofile
        //         }))
        //     })
    }

    updateInfo = (e) => {
        let email_preferred = this.state.profiledata.email
        let mobile_preferred = this.state.profiledata.mobile
        let dob_preferred = this.state.profiledata.dob
        let city_preferred = this.state.profiledata.city
        let state_preferred = this.state.profiledata.state
        let country_preferred = this.state.profiledata.country
        this.setState(currentState => ({
            updateprofile: !currentState.updateprofile,
            email_preferred: email_preferred,
            mobile_preferred: mobile_preferred,
            dob_preferred: dob_preferred,
            city_preferred: city_preferred,
            state_preferred: state_preferred,
            country_preferred: country_preferred,
        }))
    }

    render() {
        let profile1 = null
        console.log(this.state.profiledata)
        if (!this.state.updateprofile) {
            if (this.state.profiledata) {
                profile1 = (
                    <CardContent>
                        <div class="row">
                            <div class="col-md-9" >
                                <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px' }}>Personal Info</h4>
                            </div>
                            <div class="col-md-3" style={{ textAlign: '-webkit-right' }}>
                                <IconButton onClick={this.updateInfo} style={{ textAlign: "right" }}><EditOutlinedIcon color='primary' /></IconButton>
                            </div>
                        </div>
                        <div class="row">
                            <div style={{ paddingLeft: "16px", fontSize: '13px', fontFamily: "Arial", fontWeight: "400" }} >
                                {(this.state.profiledata.email) ? (<h5><EmailOutlinedIcon color='primary' /> {this.state.profiledata.email}</h5>) : <div></div>}
                                {(this.state.profiledata.mobile) ? (<h5><PhoneOutlinedIcon color='primary' /> {this.state.profiledata.mobile}</h5>) : <div></div>}
                                {(this.state.profiledata.dob) ? (<h5><CakeIcon color='primary' /> {this.state.profiledata.dob}</h5>) : <div></div>}
                                {(this.state.profiledata.city) ? (<h5><LocationCityIcon color='primary' /> {`${this.state.profiledata.city}, ${this.state.profiledata.state}, ${this.state.profiledata.country}`}</h5>) : <div></div>}
                            </div>
                        </div>
                    </CardContent>
                )
            }
        } else {
            profile1 = (
                <CardContent>
                    <div class="row">
                        <h4 style={{ fontFamily: "Arial", fontWeight: "700", fontSize: '18px', paddingLeft: '15px' }}>Personal Info</h4>
                    </div>
                    <div class="login-form" style={{ textAlign: '-webkit-left' }}>
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>Email</p>
                        <TextField onChange={this.inputChangeHandler} name="email_preferred" value={this.state.email_preferred} variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>Phone</p>
                        <TextField onChange={this.inputChangeHandler} name="mobile_preferred" value={this.state.mobile_preferred} variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>Date of Birth</p>
                        <TextField onChange={this.inputChangeHandler} name="dob_preferred" value={this.state.dob_preferred} type='date' variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        {/* <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" label="Date picker inline" value={this.state.dob_preferred} onChange={this.inputChangeHandler} KeyboardButtonProps={{ 'aria-label': 'change date'}}/> */}
                        {/* <div class="input-group date" data-provide="datepicker">
                                <input type="text" class="form-control"/>
                                <div class="input-group-addon">
                                    <span class="glyphicon glyphicon-th"></span>
                                </div>
                            </div> */}
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>City</p>
                        <TextField onChange={this.inputChangeHandler} name="city_preferred" value={this.state.city_preferred} variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>State</p>
                        <TextField onChange={this.inputChangeHandler} name="state_preferred" value={this.state.state_preferred} variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: "0px" }}>Country</p>
                        <TextField onChange={this.inputChangeHandler} name="country_preferred" value={this.state.country_preferred} variant="outlined" class='form control' size='small' style={{ marginBottom: '5px' }} />
                        <div style={{ marginTop: "16px" }}>
                            <div class="col-md-4"></div>
                            <div class="col-md-4">
                                <Button onClick={this.updateInfo} variant="contained" component="span" style={{ marginRight: '5px', backgroundColor: "#E0E0E0", color: 'black', width: "100%" }}>
                                    Cancel
                        </Button>
                            </div>
                            <div class="col-md-4" style={{ marginBottom: '10px' }}>
                                <Button onClick={() => this.updateProfile('name')} variant="contained" component="span" style={{ backgroundColor: '#1569E0', color: 'white', width: "100%" }}>
                                    Save
                        </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
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