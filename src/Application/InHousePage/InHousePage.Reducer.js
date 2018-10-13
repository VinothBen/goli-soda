import InHouseDataConstants from "./InHousePage.Constants";

const initialState = {
    columnConfig: [],
    initialGridData: [],
    updatedGridData: [],
    showSpinner: true,
    showPopUpModel: false,
    popUpMessage: "",
    searchDetailsByDate: [],
    showDownaloadPageSpinner: false,
    searchErrorMessage: {}
};

function InHouseDataReducer(state = initialState, action) {
    switch (action.type) {
        case InHouseDataConstants.IN_HOUSE_COLUMN_CONFIG_UPDATE_DATA:
            return Object.assign({}, state, { columnConfig: action.data });
        case InHouseDataConstants.SHOW_INHOUSE_SPINNER:
            return Object.assign({}, state, { showSpinner: action.data });
        case InHouseDataConstants.SHOW_DOWNLOAD_SPINNER:
            return Object.assign({}, state, { showDownaloadPageSpinner: action.data });
        case InHouseDataConstants.SHOW_INHOUSE_POPUPMODEL:
            return Object.assign({}, state, { showPopUpModel: action.showPopUpModel, popUpMessage: action.message });
        case InHouseDataConstants.GET_INHOUSE_DATA_SUCCESS:
            return Object.assign({}, state, { initialGridData: action.data });
        case InHouseDataConstants.UPDATE_INHOUSE_GRID_DATA:
            return Object.assign({}, state, { updatedGridData: action.data });
        case InHouseDataConstants.UPDATE_SEARCH_DETAILS_BY_SEARCH:
            return Object.assign({}, state, { searchDetailsByDate: action.data, showDownaloadPageSpinner: false, searchErrorMessage: {} });
        case InHouseDataConstants.ERROR_MESSAGE_WHILE_SEARCHING:
            return Object.assign({}, state, { searchErrorMessage: action.data });
        default:
            return state;
    }
}
export default InHouseDataReducer;
export { initialState };