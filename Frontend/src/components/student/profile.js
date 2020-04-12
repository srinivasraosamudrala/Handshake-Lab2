import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card,Button} from '@material-ui/core/';
import IconButton from '@material-ui/core/IconButton';
import { connect } from "react-redux";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import emptyPic from '../../images/empty-profile-picture.png';
import {environment} from '../../Utils/constants'
import { saveProfileData } from "../../redux/actions/index";
import Profile1 from "./profileComponents/profile1";
import CareerObj from './profileComponents/careerobj';
import Skillset from './profileComponents/skills';
import PersonalInfo from './profileComponents/personalinfo';
import Education from './profileComponents/education';
import Experience from './profileComponents/experience';

//Define a Login Component
class Profile extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            profiledata:"",
            studentId: ""
        }
    }

    componentDidMount() {
        this.readstudentdata()
    }

    readstudentdata(){
        this.setState({ studentId: localStorage.getItem('studentId') })
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl+'/student/profile/' + localStorage.getItem('studentId'))
            .then((response) => {
                //update the state with the response data
                if(response.data){
                console.log(response.data)
                this.props.saveProfileData(response.data)
                const data = response.data
                    this.setState({
                        profiledata:data[0],
                    })

                    console.log(this.state.profiledata)
            }});
    }

    render() {
        return (
            <div style={{ width: "95%", backgroundColor: '#F7F7F7', fontFamily:'Arial'}}>
                <div class="container" style={{  backgroundColor: '#F7F7F7' }}>
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-3">
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px'}}>
                            <Profile1 profile = {this.state.profiledata}/>
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <Skillset profile = {this.state.profiledata.skills} />
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <PersonalInfo profile = {this.state.profiledata}/>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <CareerObj profile = {this.state.profiledata.career_objective}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                {console.log(this.state.profiledata)}
                                {console.log(this.state.profiledata.education)}
                                <Education profile = {this.state.profiledata.education}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <Experience profile = {this.state.profiledata.experience}/>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
//export Profile Component
//export default Profile;
// const mapStateToProps = state => {
//     return {
//         user: state.user,
//     };
// };


// export default connect(mapStateToProps, null)(Profile);
const mapStateToProps = state => {
    return {
        profile: state.profile
    };
};

function mapDispatchToProps(dispatch) {
    return {
        saveProfileData: payload => dispatch(saveProfileData(payload))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);