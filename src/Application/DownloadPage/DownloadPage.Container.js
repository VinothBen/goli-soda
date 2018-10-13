import DownloadPage from "./DownloadPage";
import {connect} from "react-redux";

export default connect(
    (state)=>{
        return {
                initialGridData: state.inHousePageReducer.initialGridData,
                updatedGridData: state.inHousePageReducer.updatedGridData,
                token: state.landingPageReducer.token,
                username: state.landingPageReducer.username,
                errorMessage: state.landingPageReducer.errorMessage,
        };
    }
)(DownloadPage)