import {
    STUDENT_LOGIN, LOGOUT_USER,STUDENT_PROFILE
} from "../constants/action-types";
const initialState = {
    user: {
        "name": localStorage.getItem("firstName"),
        "id": localStorage.getItem("studentId"),
        "email": localStorage.getItem("email")
    },
    invalidCredentials: false,
    profile: {}
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
            user: {}
        });
    }
    if (action.type === STUDENT_PROFILE) {
        console.log("Profile data saved")
        console.log(action.payload)
        return Object.assign({}, state, {
            profile: action.payload
        });
    }
    return state;
}

export default rootReducer;