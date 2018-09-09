import DownloadPage from "./DownloadPage";
import {connect} from "react-redux";

export default connect(
    (state)=>{
        return {
                initialGridData: state.inHousePageReducer.initialGridData,
                updatedGridData: state.inHousePageReducer.updatedGridData
        };
    }
)(DownloadPage)