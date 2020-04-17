import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import {Card} from '@material-ui/core/';
import { connect } from "react-redux";
import { getProfileData, updateProfileName,
        updateProfilePic,updateCareerObj,updatePersonalInfo,
        updateEducation,updateExperience, updateSkill } from "../../redux/actions/index";
import {environment} from '../../Utils/constants';
import Profile1 from "./profileComponents/profile1";
import CareerObj from './profileComponents/careerobj';
import Skillset from './profileComponents/skills';
import PersonalInfo from './profileComponents/personalinfo';
import Education from './profileComponents/education';
import Experience from './profileComponents/experience';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profiledata:"",
            studentId: ""
        }
    }

    componentDidMount() {
        // this.readstudentdata()
        this.props.getProfileData()
    }

    // readstudentdata(){
    //     this.setState({ studentId: localStorage.getItem('studentId') })
    //     axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    //     axios.get(environment.baseUrl+'/student/profile/' + localStorage.getItem('studentId'))
    //         .then((response) => {
    //             if(response.data){
    //             console.log(response.data)
    //             // this.props.saveProfileData(response.data)
    //             const data = response.data
    //                 this.setState({
    //                     profiledata:data[0],
    //                 })

    //                 console.log(this.props.profiledata)
    //         }});
    // }

    render() {
        return (
            <div style={{ width: "95%", backgroundColor: '#F7F7F7', fontFamily:'Arial'}}>
                <div class="container" style={{  backgroundColor: '#F7F7F7' }}>
                    <div class="col-md-1">
                    </div>
                    <div class="col-md-3">
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px'}}>
                            <Profile1   profile = {this.props.profiledata} 
                                        updateProfileName={this.props.updateProfileName}
                                        updateprofilename = {this.props.updateprofilename}
                                        updateProfilePic = {this.props.updateProfilePic} />
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <Skillset   profile = {this.props.profiledata.skills}
                                        updateSkill = {this.props.updateSkill}
                                        addskill = {this.props.addskill} />
                        </div>
                        <div class="row" style={{ marginBottom: '20px', marginRight: '20px' }}>
                            <PersonalInfo   profile = {this.props.profiledata}
                                            updatePersonalInfo = {this.props.updatePersonalInfo}
                                            updatepersonalinfo = {this.props.updatepersonalinfo}/>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <CareerObj profile = {this.props.profiledata.career_objective}
                                            updateCareerObj = {this.props.updateCareerObj}
                                            updatecareerobj = {this.props.updatecareerobj}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <Education profile = {this.props.profiledata.education}
                                            updateEducation = {this.props.updateEducation}
                                            addschool = {this.props.addschool}
                                            educationstu_id = {this.props.educationstu_id}/>
                            </Card>
                        </div>
                        <div class="row" style={{ marginBottom: '20px' }}>
                            <Card>
                                <Experience profile = {this.props.profiledata.experience}
                                            updateExperience = {this.props.updateExperience}
                                            addexperience = {this.props.addexperience}
                                            experiencestu_id = {this.props.experiencestu_id}/>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    console.log(state)
    return {
        profiledata : state.profile,
        updateprofilename : state.updateprofilename,
        updatecareerobj : state.updatecareerobj,
        updatepersonalinfo : state.updatepersonalinfo,
        addschool: state.addschool,
        educationstu_id: state.educationstu_id,
        addexperience : state.addexperience,
        experiencestu_id: state.experiencestu_id,
        addskill: state.addskill
    };
};

function mapDispatchToProps(dispatch) {
    return {
        getProfileData: payload => dispatch(getProfileData(payload)),
        updateProfileName: payload => dispatch(updateProfileName(payload)),
        updateProfilePic: payload => dispatch(updateProfilePic(payload)),
        updateCareerObj: payload => dispatch(updateCareerObj(payload)),
        updatePersonalInfo: payload => dispatch(updatePersonalInfo(payload)),
        updateEducation: payload => dispatch(updateEducation(payload)),
        updateExperience: payload => dispatch(updateExperience(payload)),
        updateSkill: payload => dispatch(updateSkill(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);