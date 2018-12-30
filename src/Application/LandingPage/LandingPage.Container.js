import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LandingPage from "./LandingPage";
import * as LandingPageActions from "./LandingPage.Actions";
export default connect(
    (state)=>{
       return {
                data: state.landingPageReducer.data,
                token: state.landingPageReducer.token,
                userDetails: state.landingPageReducer.userDetails,
                errorMessage: state.landingPageReducer.errorMessage,
              };
},
    (dispatch)=>{
        return {
                landingPageActions: bindActionCreators(LandingPageActions, dispatch)
        };
}
)(LandingPage);