import {
    STUDENT_LOGIN, LOGOUT_USER, STUDENT_PROFILE,
    STUDENT_PROFILE_NAME, STUDENT_PROFILE_PIC,
    STUDENT_CAREER_OBJ, STUDENT_PERSONAL_INFO,
    STUDENT_EDUCATION, STUDENT_EXPERIENCE,
    STUDENT_SKILLS, STUDENT_REGISTRATIONS,
    STUDENT_EVENT_LIST, STUDENT_APPLICATIONS,
    STUDENT_JOBS, STUDENT_LIST,VIEW_STUDENT,
    SAVE_MESSAGE, COMPANY_JOBS, JOB_APPLICANTS,
    COMPANY_EVENTS, EVENTS_REGISTRATIONS, MESSAGES
} from "../constants/action-types";
const initialState = {
    user: {
        "name": localStorage.getItem("firstName"),
        "id": localStorage.getItem("studentId"),
        "email": localStorage.getItem("email"),
        "token": sessionStorage.getItem("token")
    },
    invalidCredentials: false,
    profile: {},
    profilenamedata: {},
    studentimage: "",
    updateprofilename: false,
    updatecareerobj:false,
    updatepersonalinfo: false,
    addschool:false,
    educationstu_id:"",
    addexperience:false,
    experiencestu_id:"",
    addskill:"",
    studenteventlist:{},
    studentregistrations:{},
    studentapplications:{},
    studentjobs:{},
    studentlist:{},
    studentview:{},
    message:{},
    redirectToMessages:false,
    companyjobs:{},
    jobapplicants:{},
    companyevents:{},
    eventregistrations:{},
    messages:{}
};

function rootReducer(state = initialState, action) {
    if (action.type === STUDENT_LOGIN) {
        console.log("Login success reducer")
        console.log(action.payload)
        return Object.assign({}, state, {
            user: action.payload
        });
    }
    if (action.type === LOGOUT_USER) {
        console.log("reducer")
        return Object.assign({}, state, {
            initialState : {}
        });
    }
    if (action.type === STUDENT_PROFILE) {
        console.log("Profile data saved")
        console.log(action.payload)
        return Object.assign({}, state, {
            profile: action.payload
        });
    }
    if (action.type === STUDENT_PROFILE_NAME) {
        return Object.assign({}, state, {
            profile: action.payload,
            updateprofilename: false
        });
    }
    if (action.type === STUDENT_PROFILE_PIC) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                updateprofilename: true
            });
        }
    }
    if (action.type === STUDENT_CAREER_OBJ) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                updatecareerobj: false
            });
        }
    }
    if (action.type === STUDENT_PERSONAL_INFO) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                updatepersonalinfo: false
            });
        }
    }
    if (action.type === STUDENT_EDUCATION) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                addschool: false,
                educationstu_id:""
            });
        }
    }
    if (action.type === STUDENT_EXPERIENCE) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                addexperience: false,
                experiencestu_id:""
            });
        }
    }
    if (action.type === STUDENT_SKILLS) {
        if (action.payload) {
            return Object.assign({}, state, {
                profile: action.payload,
                addskill: ""
            });
        }
    }
    if(action.type === STUDENT_EVENT_LIST) {
        if (action.payload) {
            return Object.assign({}, state, {
                studenteventlist: action.payload[0],
                studentmajor: action.payload[1]
            });
        }
    }
    if(action.type === STUDENT_REGISTRATIONS) {
        if (action.payload) {
            return Object.assign({}, state, {
                studentregistrations: action.payload
            });
        }
    }
    if(action.type === STUDENT_APPLICATIONS) {
        if (action.payload) {
            return Object.assign({}, state, {
                studentapplications: action.payload
            });
        }
    }
    if(action.type === STUDENT_JOBS) {
        if (action.payload) {
            return Object.assign({}, state, {
                studentjobs: action.payload
            });
        }
    }
    if(action.type === STUDENT_LIST) {
        if (action.payload) {
            return Object.assign({}, state, {
                studentlist: action.payload
            });
        }
    }
    if(action.type === VIEW_STUDENT) {
        if (action.payload) {
            return Object.assign({}, state, {
                studentview: action.payload
            });
        }
    }
    if(action.type === SAVE_MESSAGE) {
        if (action.payload) {
            return Object.assign({}, state, {
                message: action.payload,
                redirectToMessages:true
            });
        }
    }
    if(action.type === COMPANY_JOBS) {
        if (action.payload) {
            return Object.assign({}, state, {
                companyjobs: action.payload
            });
        }
    }
    if(action.type === JOB_APPLICANTS) {
        if (action.payload) {
            return Object.assign({}, state, {
                jobapplicants: action.payload
            });
        }
    }
    if(action.type === COMPANY_EVENTS) {
        if (action.payload) {
            return Object.assign({}, state, {
                companyevents: action.payload
            });
        }
    }
    if(action.type === EVENTS_REGISTRATIONS) {
        if (action.payload) {
            return Object.assign({}, state, {
                eventregistrations: action.payload
            });
        }
    }
    if(action.type === MESSAGES) {
        if (action.payload) {
            return Object.assign({}, state, {
                messages: action.payload,
                redirectToMessages : false
            });
        }
    }
    return state;
}

export default rootReducer;