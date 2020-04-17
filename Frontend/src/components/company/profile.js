import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import '../../App.css';
import { Card, CardContent, Button, IconButton, InputBase, TextField, Avatar,Input } from '@material-ui/core/';
import Company_Logo from '../../images/Cover_Letter_Social.png'
import {environment} from '../../Utils/constants'
import emptyPic from '../../images/empty-profile-picture.png';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyId: localStorage.getItem('companyId'),
            profile:null,
            editprofile:false,
            companyname:"",
            location:"",
            email:"",
            phone:"",
            companydesc:"",
            image:emptyPic
        }
        this.editProfile = this.editProfile.bind(this);
        this.fetchCompanydetails = this.fetchCompanydetails.bind(this);
    }

    inputChangeHandler = (e) => {
        const value = e.target.value
        this.setState({
            [e.target.name]: value
        })
    }

    componentDidMount(){
        this.fetchCompanydetails()
    }

    fetchCompanydetails(){
        console.log(localStorage.getItem('companyId'))
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl+'/company/profile/' + localStorage.getItem('companyId'))
            .then((response) => {
                this.setState({
                    profile : response.data.result[0],
                    companyname:response.data.result[0].name,
                    location:response.data.result[0].location,
                    email:response.data.result[0].email,
                    phone:response.data.result[0].phone,
                    companydesc:response.data.result[0].company_description,
                    image:response.data.result[0].image
                })
                console.log(this.state.profile)
                console.log(this.state.companydesc)
            })
    }

    editProfile = () => {
        this.setState(currentState =>({
            editprofile: !currentState.editprofile
        }))

    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    showProfilepic = async (e) => {
        console.log("profilepic")
        this.setState({
            image : e.target.files[0]
        })
        e.preventDefault();

        const formData = new FormData();
        formData.append('companyId', localStorage.getItem('companyId'))
        formData.append('profilepic', e.target.files[0]);
      
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        await console.log(formData)

        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');

        let rest = await axios.post(environment.baseUrl+"/company/uploadpic",formData, config)
            .then((response) => {
                this.fetchCompanydetails();
                this.setState({
                    openimage: false,
                    file:null
                })
            }).catch((error) => {
                console.log('error occured while setting profilepic')
            });
    }

    saveProfile = () =>{
        console.log(this.state.companydesc)
        let data={
            'company_id':localStorage.getItem('companyId'),
            'name':this.state.companyname,
            'location':this.state.location,
            'email':this.state.email,
            'phone':this.state.phone,
            'company_description':this.state.companydesc
        }
        console.log(data)
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.put(environment.baseUrl+'/company/updateprofile', data)
            .then((response)=>{
                console.log(response.data)
                if (response.data.result) {
                    this.editProfile()
                    this.fetchCompanydetails()
                    console.log(response.data.result)
                } else {
                    console.log(response.data.error)
                }
            })
    }

    render(){
        let companyEdit = null;
        if (this.state.profile){
            console.log(this.state.editprofile)
        if(this.state.editprofile === true){
            companyEdit = (
                <div>
                <Card style={{borderTopRightRadius:'0px',borderTopLeftRadius:'0px'}}>
                            <CardContent><div style ={{ position: 'relative', top: '30px'}}>
                                <div class="upload-btn-img">
                                    <img src={this.state.image} height='70' width='70' alt="Company"/>
                                    <input type="file" name="image" onChange={this.showProfilepic} />
                                </div>
                                <div style = {{position:'relative', top:'-110px',left:'85px'}}>
                                    <div className="col-md-8">
                                        <div class="form-group">
                                        <div class="active-pink-4 mb-4" style={{ width: "50%",float:"left"}}>
                                            <div style={{fontSize : "12px", marginTop:'15px',marginBottom:"7px"}}>Company Name</div>
                                            <input class="form-control" type="text"  name="companyname" value = {this.state.companyname} style={{ width: "80%"}} placeholder="Company Name" aria-label="Company Name" onChange={this.inputChangeHandler}/>
                                        </div> 
                                        <div class="active-pink-4 mb-4" style={{ width: "50%",float:"right"}}>
                                            <div style={{fontSize : "12px", marginTop:'15px',marginBottom:"7px"}}>Location</div>
                                            <input class="form-control" type="text"  name="location" value = {this.state.location} style={{ width: "80%"}} placeholder="Location" aria-label="Location" onChange={this.inputChangeHandler}/>
                                        </div> 
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <Button variant="contained" size="small" color="primary" style = {{position:'relative',top:'-70px',left:'150px', backgroundColor : "#1569E0", width:'2px', marginRight:'10px' }} onClick={()=>{console.log("save");this.saveProfile()}}>Save</Button>
                                        <Button variant="contained" size="small" color="primary" style = {{position:'relative',top:'-70px',left:'150px', backgroundColor : "#808080", width:'2px'}} onClick={()=>{this.editProfile()}}>Cancel</Button>
                                    </div></div>
                            </CardContent>
                        </Card>
                        <div style = {{marginTop : '20px', width:'103%',position:'relative',left:'-14px'}}>
                        <div className="col-md-8">
                        <Card>
                            <CardContent>
                                <h4>{'About ' + this.state.companyname}</h4>
                                <textarea name="companydesc" rows="4" cols="80" style={{borderRadius:'5px'}}  onChange={this.inputChangeHandler}>
                                    {this.state.companydesc}
                                </textarea>
                            </CardContent>
                        </Card>
                        </div>
                        <div className="col-md-4">
                        <Card>
                            <CardContent>
                                <h4>Contact Information</h4>
                                <div class="form-group">
                                    <div class="active-pink-4 mb-4" style={{ width: "90%",marginBottom:"15px",marginTop:"20px"}}>
                                        <div style={{fontSize : "12px", marginTop:'15px',marginBottom:"7px"}}>Email</div>
                                        <input class="form-control" type="text"  name="email" value = {this.state.email} style={{ width: "80%" }} placeholder="Email" aria-label="Company Name" onChange={this.inputChangeHandler}/>
                                    </div> 
                                    <div class="active-pink-4 mb-4" style={{ width: "90%"}}>
                                        <div style={{fontSize : "12px", marginTop:'15px',marginBottom:"7px"}}>Phone</div>
                                        <input class="form-control" type="text"  name="phone" value = {this.state.phone} style={{ width: "80%" }} placeholder="Phone" aria-label="Location" onChange={this.inputChangeHandler}/>
                                    </div> 
                                </div>
                            </CardContent>
                        </Card>
                     </div>
                     </div>
                    </div>)
        }
        else{
        companyEdit = (
            <div>
            <Card style={{borderTopRightRadius:'0px',borderTopLeftRadius:'0px'}}>
                        <CardContent><div style ={{ position: 'relative', top: '30px' }}>
                            {/* <img src = {Company_Logo} alt = 'Logo' height='70' width='70' ></img> */}
                            <img src = {this.state.image} alt = 'Logo' height='70' width='70' ></img>
                            <div style = {{position:'relative', top:'-70px',left:'85px'}}>
                                <div className="col-md-9">
                                    <div><h4>{this.state.profile.name}</h4></div>
                                    <div className="col-md-6" style={{marginLeft:"-10px",marginTop:"7px"}}><span class="glyphicon glyphicon-map-marker" style={{color: "Black" }}></span> {this.state.profile.location}</div>
                                    <div className="col-md-4" style={{marginLeft:"-10px",marginTop:"7px"}}><span class="glyphicon glyphicon-envelope" style={{color: "Black" }}></span> {this.state.profile.email}</div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <Button variant="contained" size="small" color="primary" style = {{position:'relative',top:'-70px',left:'150px', backgroundColor : "#1569E0",width:'2px' }} onClick={()=>{this.editProfile()}}>Edit</Button>
                                </div></div>
                        </CardContent>
                    </Card>
                    <div style = {{marginTop : '20px', width:'103%',position:'relative',left:'-14px'}}>
                    <div className="col-md-8">
                    <Card>
                        <CardContent>
                            <h4>{'About ' + this.state.profile.name}</h4>
                            {this.state.profile.company_description}
                        </CardContent>
                    </Card>
                    </div>
                    <div className="col-md-4">
                    <Card>
                        <CardContent>
                            <h4>Contact Information</h4>
                            <div style={{fontSize : "12px", marginTop:'15px'}}>Email</div>
                            <div style={{color: "#1569E0"}}><span class="glyphicon glyphicon-envelope" style={{color: "Black" }}></span>  {this.state.profile.email}</div>
                            <div style={{fontSize : "12px", marginTop:'10px'}}>Phone</div>
                            <div style={{color: "#1569E0"}}><span class="glyphicon glyphicon-earphone" style={{color: "Black" }}></span>  {this.state.profile.phone}</div>
                        </CardContent>
                    </Card>
                 </div>
                 </div>
                </div>)
        }
        }
        return(
            <div style={{width:'90%',paddingLeft:'120px'}}>
                <Card>
                    <div style={{height:"200px"}}>
                        <img src={Company_Logo}></img>
                    </div>
                </Card>
                {companyEdit}
                
            </div>
        )
    }
}

export default Profile;