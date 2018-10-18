import LandingPageConstants from "./LandingPage.Constants";
// import axios from "axios";
// import LocalDB from "../../LocalDB";
require('es6-promise').polyfill();
require('isomorphic-fetch');
export const landingPageActionCheck = (data) => {
    return {
        type: LandingPageConstants.UPDATE_DATA,
        data
    };
}

export const logOutOption = () => {
    return {
        type: LandingPageConstants.LOGOUT_OPTION,
    };
}

export const loginSuccess = (data) => {
    return {
        type: LandingPageConstants.LOGIN_SUCCESS,
        data
    };
}

export const loginFail = (data) => {
    return {
        type: LandingPageConstants.LOGIN_FAILURE,
        data
    };
}

export const loginPostCall = (url, postData) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(postData, null, 2),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("Username or Password is invalid.");
            }
        }).then(response => {
                dispatch(loginSuccess(response));
            })
            .catch(error => {
                dispatch(loginFail(error.message));
            });
    }
}