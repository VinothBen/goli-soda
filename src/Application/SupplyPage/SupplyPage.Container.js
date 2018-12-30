import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import SupplyPage from "./SupplyPage";
import * as supplyPageActions from "./SupplyPage.Actions";
export default connect(
    (state)=>{
       return {
                columnConfig: state.supplyPageReducer.columnConfig,
                initialGridData: state.supplyPageReducer.initialGridData,
                updatedGridData: state.supplyPageReducer.updatedGridData,
                showSpinner: state.supplyPageReducer.showSpinner,
                showPopUpModel: state.supplyPageReducer.showPopUpModel,
                popUpMessage: state.supplyPageReducer.popUpMessage,
                searchErrorMessage: state.supplyPageReducer.searchErrorMessage,
                token: state.landingPageReducer.token,
                userDetails: state.landingPageReducer.userDetails,
                errorMessage: state.landingPageReducer.errorMessage,
              };
},
    (dispatch)=>{
        return {
            supplyActions: bindActionCreators(supplyPageActions, dispatch)
        };
}
)(SupplyPage);