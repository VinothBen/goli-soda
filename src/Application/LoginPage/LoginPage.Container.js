import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LoginPage from "./LoginPage";
import * as LandingPageActions from "../LandingPage/LandingPage.Actions";
export default connect(
    (state)=>{
       return {
                token: state.landingPageReducer.token,
                username: state.landingPageReducer.username,
                errorMessage: state.landingPageReducer.errorMessage,
              };
},
    (dispatch)=>{
        return {
            landingPageActions: bindActionCreators(LandingPageActions, dispatch)
        };
}
)(LoginPage);