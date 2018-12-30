import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import BottleReturnsPage from "./BottleReturnsPage";
import * as bottleReturnsPageActions from "./BottleReturnsPage.Actions";
export default connect(
    (state)=>{
       return {
                columnConfig: state.bottleReturnsPageReducer.columnConfig,
                initialGridData: state.bottleReturnsPageReducer.initialGridData,
                updatedGridData: state.bottleReturnsPageReducer.updatedGridData,
                showSpinner: state.bottleReturnsPageReducer.showSpinner,
                showPopUpModel: state.bottleReturnsPageReducer.showPopUpModel,
                popUpMessage: state.bottleReturnsPageReducer.popUpMessage,
                searchErrorMessage: state.bottleReturnsPageReducer.searchErrorMessage,
                token: state.landingPageReducer.token,
                userDetails: state.landingPageReducer.userDetails,
                errorMessage: state.landingPageReducer.errorMessage,
              };
},
    (dispatch)=>{
        return {
            bottleReturnActions: bindActionCreators(bottleReturnsPageActions, dispatch)
        };
}
)(BottleReturnsPage);