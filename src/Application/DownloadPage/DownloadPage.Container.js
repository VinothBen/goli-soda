import DownloadPage from "./DownloadPage";
import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import * as InHousePageActions from "../InHousePage/InHousePage.Actions";

export default connect(
    (state) => {
        return {
            initialGridData: state.inHousePageReducer.initialGridData,
            updatedGridData: state.inHousePageReducer.updatedGridData,
            showDownaloadPageSpinner: state.inHousePageReducer.showDownaloadPageSpinner,
            token: state.landingPageReducer.token,
            userDetails: state.landingPageReducer.userDetails,
            errorMessage: state.landingPageReducer.errorMessage,
            searchDetailsByDate: state.inHousePageReducer.searchDetailsByDate,
            searchErrorMessage: state.inHousePageReducer.searchErrorMessage
        };
    },
    (dispatch) => {
        return {
            inHousePageActions: bindActionCreators(InHousePageActions, dispatch)
        };
    }
)(DownloadPage)