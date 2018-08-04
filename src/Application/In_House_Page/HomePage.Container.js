import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import HomePage from "./HomePage";
import * as HomePageActions from "./HomePage.Actions";
export default connect(
    (state)=>{
       return {
                data: state.homePageReducer.data,
                searchData: state.homePageReducer.searchData
              };
},
    (dispatch)=>{
        return {
                actions: bindActionCreators(HomePageActions, dispatch)
        };
}
)(HomePage);