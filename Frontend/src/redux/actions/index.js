import { STUDENT_LOGIN } from "../constants/action-types";
import { LOGOUT_USER } from "../constants/action-types";
import {
    STUDENT_PROFILE, STUDENT_PROFILE_NAME,
    STUDENT_PROFILE_PIC, STUDENT_CAREER_OBJ,
    STUDENT_PERSONAL_INFO, STUDENT_EDUCATION,
    STUDENT_EXPERIENCE, STUDENT_SKILLS,
    STUDENT_EVENT_LIST, STUDENT_REGISTRATIONS,
    STUDENT_APPLICATIONS, STUDENT_JOBS, STUDENT_LIST,
    VIEW_STUDENT, SAVE_MESSAGE, COMPANY_JOBS,
    JOB_APPLICANTS, COMPANY_EVENTS, EVENTS_REGISTRATIONS,
    MESSAGES
} from "../constants/action-types";
import { environment } from '../../Utils/constants';
import axios from 'axios';
import messages from "../../components/student/messages";

export function logoutUser(payload) {
    console.log("logoutUser")
    return { type: LOGOUT_USER, payload };
}

export const saveProfileData = (payload) => {
    console.log("saveProfileData")
    return { type: STUDENT_PROFILE, payload };
};

export const saveProfileName = (payload) => {
    return { type: STUDENT_PROFILE_NAME, payload }
}

export const saveProfilePic = (payload) => {
    return { type: STUDENT_PROFILE_PIC, payload }
}

export const saveCareerObj = (payload) => {
    return { type: STUDENT_CAREER_OBJ, payload }
}

export const savePersonalInfo = (payload) => {
    return { type: STUDENT_PERSONAL_INFO, payload }
}

export const saveEducation = (payload) => {
    return { type: STUDENT_EDUCATION, payload }
}

export const saveExperience = (payload) => {
    return { type: STUDENT_EXPERIENCE, payload }
}

export const saveSkill = (payload) => {
    return { type: STUDENT_SKILLS, payload }
}

export const saveEventList = (payload) => {
    return { type: STUDENT_EVENT_LIST, payload }
}

export const saveStudentRegistrations = (payload) => {
    return { type: STUDENT_REGISTRATIONS, payload }
}

export const saveStudentApplications = (payload) => {
    return { type: STUDENT_APPLICATIONS, payload }
}

export const saveStudentJobs = (payload) => {
    return { type: STUDENT_JOBS, payload }
}

export const saveStudentLists = (payload) => {
    return { type: STUDENT_LIST, payload }
}

export const saveStudentView = (payload) => {
    return { type: VIEW_STUDENT, payload }
}

export const saveMessage = (payload) => {
    return { type: SAVE_MESSAGE, payload }
}

export const loginUser = (payload) => {
    console.log("loginUser")
    return { type: STUDENT_LOGIN, payload };
};

export const saveCompanyJobs = (payload) => {
    return { type: COMPANY_JOBS, payload };
}

export const saveJobApplicants = (payload) => {
    return { type: JOB_APPLICANTS, payload }
}

export const saveCompanyEvents = (payload) => {
    return { type: COMPANY_EVENTS, payload }
}

export const saveEventRegistrations = (payload) => {
    return { type: EVENTS_REGISTRATIONS, payload }
}

export const saveMessages = (payload) => {
    return { type: MESSAGES, payload }
}

export const getProfileData = (payload) => {
    return dispatch => {
        console.log("saveProfileData")
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/profile/' + localStorage.getItem('studentId'))
            .then((response) => {
                if (response.data) {
                    dispatch(saveProfileData(response.data[0]));
                } else {
                    dispatch(saveProfileData({}));
                }
            });
    }
};

export const updateProfileName = (payload) => {
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                if (response.data) {
                    dispatch(saveProfileName(response.data));
                } else {
                    dispatch(saveProfileName({}));
                }
            })
    }
}

export const updateProfilePic = (payload) => {
    return dispatch => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + "/student/uploadpic", payload, config)
            .then((response) => {
                dispatch(saveProfilePic(response.data))
            }).catch((error) => {
                dispatch(saveProfilePic({}))
            });
    }
}

export const updateCareerObj = (payload) => {
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                if (response.data) {
                    dispatch(saveCareerObj(response.data))
                } else {
                    dispatch(saveCareerObj(response.data))
                }
            })
    }
}

export const updatePersonalInfo = (payload) => {
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                console.log(response.data)
                if (response.data) {
                    dispatch(savePersonalInfo(response.data))
                } else {
                    dispatch(savePersonalInfo({}))
                }
            })
    }
}

export const updateEducation = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    dispatch(saveEducation(response.data))
                } else if (response.data.error) {
                    dispatch(saveEducation({}))
                }
            }
            )
    }
}

export const updateExperience = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    dispatch(saveExperience(response.data))
                } else if (response.data.error) {
                    dispatch(saveExperience({}))
                }
            }
            )
    }
}

export const updateSkill = (payload) => {
    return dispatch => {
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/profile', payload)
            .then(response => {
                if (response.data) {
                    dispatch(saveSkill(response.data))
                } else {
                    dispatch({})
                }
            })
    }
}

export const getEventDetails = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/events/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    let eventlist = response.data
                    console.log(eventlist)
                    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
                    axios.post(environment.baseUrl + '/student/education', { 'studentId': localStorage.getItem('studentId') })
                        .then((response) => {
                            console.log(response)
                            if (response.data[0].education[0]) {
                                dispatch(saveEventList([eventlist, response.data[0].education[0].major]))
                            } else {
                                dispatch(saveEventList([eventlist, ""]))
                            }
                        })
                    // console.log(eventlist)
                    // dispatch(saveEventList([eventlist, response.data]))
                } else {
                    dispatch(saveEventList([]))
                }
            })
    }
}

export const getStudentRegistrations = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/eventregistrations/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    dispatch(saveStudentRegistrations(response.data))
                }
            })
    }
}

export const getStudentApplications = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/jobapplications/' + localStorage.getItem('studentId'))
            .then((response) => {
                if (response.data.length > 0) {
                    dispatch(saveStudentApplications(response.data))
                }
            })
    }
}

export const getStudentJobs = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/jobsearch/' + localStorage.getItem('studentId'))
            .then((response) => {
                if (response.data.length > 0) {
                    dispatch(saveStudentJobs(response.data))
                }
            })
    }
}

export const getStudentList = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/studentsearch/' + localStorage.getItem('studentId'))
            .then((response) => {
                console.log(response.data)
                if (response.data) {
                    dispatch(saveStudentLists(response.data))
                }
            })
    }
}

export const viewStudent = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/student/profile/' + localStorage.getItem('sstudentId'))
            .then((response) => {
                if (response.data) {
                    dispatch(saveStudentView(response.data[0]))
                }
            });
    }
}

export const sendMessages = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/message/sendmessage', payload)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data)
                if (response.data) {
                    dispatch(saveMessage(response.data))
                } else if (response.data.error) {
                    dispatch(saveMessage({}))
                }
            }
            )
    }
}

export const getCompanyJobs = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/company/list-of-jobs-and-events/' + localStorage.getItem('companyId') + '/jobs')
            .then((response) => {
                dispatch(saveCompanyJobs(response.data.result))
            });
    }
}

export const getJobApplicants = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/company/listApplicants', payload)
            .then(response => {
                if (response.data.result) {
                    dispatch(saveJobApplicants(response.data.result))
                } else if (response.data.error) {
                    dispatch(saveJobApplicants({}))
                }
            })
    }
}

export const getCompanyEvents = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/company/list-of-jobs-and-events/' + localStorage.getItem('companyId') + '/events')
            .then((response) => {
                dispatch(saveCompanyEvents(response.data))
            });
    }
}

export const getEventRegistrations = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/company/listRegistrations', payload)
            .then(response => {
                console.log("in frontend after response");
                console.log(response.data.result)
                if (response.data.result) {
                    dispatch(saveEventRegistrations(response.data.result))
                } else if (response.data.error) {
                    dispatch(saveEventRegistrations({}))
                }
            })
    }
}

export const getMessages = (payload) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.get(environment.baseUrl + '/message/fetchmessages/' + payload)
            .then((response) => {
                console.log(response.data)
                if (response.data.length > 0) {
                    dispatch(saveMessages(response.data))
                } else {
                    dispatch(saveMessages({}))
                }
            })
    }
}

export const applyJobs = (payload,config) => {
    return dispatch => {
        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
        axios.post(environment.baseUrl + '/student/applyjob', payload, config)
            .then((response) => {
                // console.log(response.data)
                // appiledJob = this.state.appiledJob
                // this.uploadResume(0, 0)
                if (response.data){
                    dispatch(getStudentJobs(""))
                }
                else{
                    dispatch(saveStudentJobs({}))
                }
                // this.setState({
                //     appliedjob: appiledJob.push(jobId)
                // })

            })
    }
}

export const handleLogout = () => {
    return { type: LOGOUT_USER }
}