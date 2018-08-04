import LandingPageConstants from "./LandingPage.Constants";
// import axios from "axios";
// import LocalDB from "../../LocalDB";
require('es6-promise').polyfill();
require('isomorphic-fetch');
export const landingPageActionCheck = (data) =>{
    return {
        type : LandingPageConstants.UPDATE_DATA,
        data
    };  
}
