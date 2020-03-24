import React, { Component } from 'react';
import '../../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardContent, Dialog, DialogContent,Avatar } from '@material-ui/core';
import emptyPic from '../../../images/empty-profile-picture.png';
import {environment} from '../../../Utils/constants'

//Define a Login Component
class ViewApplicants extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name: "",
            email: "",
            phone: "",
            event_id:this.props.match.params.eventId,
            redirect: false,
            stuData: [],
            view_profile:false,
            studId:"",
            toEvents : false,
            showStatus : "",
            statusUpdated:"",
            previewresume:false,
            emptyprofilepic:emptyPic
        }
        this.viewProfile = this.viewProfile.bind(this);
        this.toevents = this.toevents.bind(this);
    }

  
    viewProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        console.log(e.target.value);
        this.setState({
            view_profile: true,
            studId:e.target.value
        })
    }

    inputChangeHandler = (e) => {
        let value = e.target.value
        this.setState({
            [e.target.name] : value
        })
        console.log(this.state)
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    componentDidMount() {
        this.fetchApplicants()
    }

    fetchApplicants(){
        let companyId = localStorage.getItem('companyId')
        const data = {
            id: companyId,
            event_id:this.state.event_id
        }
        console.log(data)
        axios.post(environment.baseUrl+'/company/listRegistrations', data)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data.result)
                if (response.data.result) {
                        var base64Flag = 'data:image/jpeg;base64,';
                        response.data.result.map((company,index) => {
                            console.log("profile")
                            if (company.profilepic!== null) {
                                var imgstring = this.arrayBufferToBase64(company.profilepic.data);
                                 company.profilepic = base64Flag + imgstring
                                 console.log(company.profilepic)
                            }
                            console.log(company.profilepic)
                        } )
                    this.setState({
                        stuData: response.data.result,
                    });
                  console.log(this.state.stuData)
                } else if (response.data.error) {
                    console.log("response" + response.data.error)
                }
            })
    }

    toevents = (e) =>{
        this.setState({
            toEvents:true
        })
    }


    render() {
        let renderRedirect = null;
        let selectStatus = null;
        // if (this.state.redirect === true) {
        //     renderRedirect = <Redirect to='/jobs' />
        // }
        if (this.state.view_profile === true) {
            renderRedirect = <Redirect to={`/ViewProfile/${this.state.studId}`}/>
        }

        if(this.state.showStatus === true){
            selectStatus = (<div style={{marginLeft:'20px',marginBottom:'10px'}}>
            <select name="showStatus" onChange={this.inputChangeHandler}>
                <option value="Change Status" >Change Status</option>
                <option value="Pending" >Pending</option>
                <option value="Reviewed" >Reviewed</option>
                <option value="Declined" >Declined</option>
            </select>
        </div>)
        }

        if(this.state.toEvents === true){
            console.log('to events')
            renderRedirect = <Redirect to= "/company/events"/>
        }
        
        let stuData = this.state.stuData;
        console.log(stuData)
        return (
            <div>
                <div class="container">
                            <div class="panel1">
                                <h2 style={{position:'relative',top:'10px'}}>Students Registered </h2>
                                <div style={{float:'right',position:'relative',top:'-22px',marginRight:'10px'}}>
                                    <button onClick={this.toevents} class="btn btn-primary" style={{backgroundColor:'#808080',borderRadius:'15px',border:'0px'}}><span class="glyphicon glyphicon-chevron-left" style={{ color: "white" }}></span>Back to events</button>
                                </div>
                            </div>    
                            <div>
                                {renderRedirect}
                            </div>
                                <div>
                                    {stuData.map((data, index) => {
                                        return (
                                            <div style={{margin:"10px 0px 10px 100px",width:"80%"}}>
                                            <Card>
                                                <CardContent>
                                                <div key={data.stud_id} style={{padding:'10px 0px 10px 50px'}}>
                                                <div className="row App-align">
                                                <div className="col-md-1">
                                                    <img src={data.profilepic?data.profilepic:this.state.emptyprofilepic} height='70' width='70' style={{ position:'relative',top:'20px',left:'-30px'}} alt='Profile'/>
                                                </div>
                                                <div className="col-md-8" style={{ fontSize: "23px", color: "#1569E0",marginLeft:"-10px" }}><Link onClick = {()=>(this.viewProfile(data.stud_id))}>{data.firstName+ " " +data.lastName}</Link>
                                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-envelope" style={{ color: "#1569E0" }}></span> {data.email}</div>    
                                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-book" style={{ color: "#1569E0" }}></span> {data.collegename}</div>
                                                {/* <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-calendar" style={{ color: "#1569E0" }}></span> Applied on {data.applieddate}</div> */}
                                                <div style={{ fontSize: "13px" }}><span class="glyphicon glyphicon-time" style={{ color: "#1569E0" }}></span> Status:{data.eventstatus}</div></div>
                                                </div>
                                                </div>
                                                </CardContent>
                                            </Card>
                                            </div>
                                            
                                        )
                                    })}
                                </div>                          
                        </div>
                    </div>
        )
    }
}
//export Login Component
export default ViewApplicants;