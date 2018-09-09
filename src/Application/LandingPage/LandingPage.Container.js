import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import LandingPage from "./LandingPage";
import * as LandingPageActions from "./LandingPage.Actions";
export default connect(
    (state)=>{
       return {
                data: state.landingPageReducer.data,
              };
},
    (dispatch)=>{
        return {
                landingPageActions: bindActionCreators(LandingPageActions, dispatch)
        };
}
)(LandingPage);