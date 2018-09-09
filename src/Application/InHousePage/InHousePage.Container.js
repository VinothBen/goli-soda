import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import InHousePage from "./InHousePage";
import * as InHousePageActions from "./InHousePage.Actions";
export default connect(
    (state)=>{
       return {
                columnConfig: state.inHousePageReducer.columnConfig,
                initialGridData: state.inHousePageReducer.initialGridData,
                updatedGridData: state.inHousePageReducer.updatedGridData,
                showSpinner: state.inHousePageReducer.showSpinner,
                showPopUpModel: state.inHousePageReducer.showPopUpModel,
                popUpMessage: state.inHousePageReducer.popUpMessage
              };
},
    (dispatch)=>{
        return {
                inHousePageActions: bindActionCreators(InHousePageActions, dispatch)
        };
}
)(InHousePage);