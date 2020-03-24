const initialstate = {
    user: {
    }
}
export const loggedReducer = (state = initialstate, action) => {
    switch (action.type) {
        case 'SIGNIN':

            //return studentdetails;
            console.log("---IN Reducer")
            return Object.assign({}, state, {
                user: action.payload
            })
            break;
            case "updateStudentDetails" :{
                state = {
                    ...state,
                    user : action.payload
                }
                console.log(state);
            }

        default:
            return state
    }
}

export default loggedReducer;