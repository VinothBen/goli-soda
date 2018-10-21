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
                token: state.landingPageReducer.token,
                username: state.landingPageReducer.username,
                errorMessage: state.landingPageReducer.errorMessage,
              };
},
    (dispatch)=>{
        return {
            actions: bindActionCreators(supplyPageActions, dispatch)
        };
}
)(SupplyPage);