import { STUDENT_LOGIN } from "../constants/action-types";
import { LOGOUT_USER } from "../constants/action-types";
import {STUDENT_PROFILE} from "../constants/action-types";
import axios from 'axios';

export function logoutUser(payload) {
    console.log("logoutUser")
    return { type: LOGOUT_USER, payload };
}

export const saveProfileData = (payload) => {
    console.log("saveProfileData")
    return { type: STUDENT_PROFILE, payload };
};

export const loginUser = (payload) => {
    console.log("loginUser")
    return { type: STUDENT_LOGIN, payload };
};