import BottleReturnsPageConstants from "./BottleReturnsPage.Constants";

const initialState = {
    columnConfig: [],
    initialGridData: [],
    updatedGridData: [],
    showSpinner: false,
    showPopUpModel: false,
    popUpMessage: "",
    searchDetailsByDate: [],
    showDownaloadPageSpinner: false,
    searchErrorMessage: {
        message: "",
        type: ""
    }
};

function bottleReturnsPageReducer(state = initialState, action) {
    switch (action.type) {
        case BottleReturnsPageConstants.BOTTLE_RETURNS_COLUMN_CONFIG_UPDATE_DATA:
            return Object.assign({}, state, { columnConfig: action.data });
        case BottleReturnsPageConstants.SHOW_BOTTLE_RETURNS_SPINNER:
            return Object.assign({}, state, { showSpinner: action.data });
        case BottleReturnsPageConstants.SHOW_DOWNLOAD_SPINNER:
            return Object.assign({}, state, { showDownaloadPageSpinner: action.data });
        case BottleReturnsPageConstants.SHOW_BOTTLE_RETURNS_POPUPMODEL:
            return Object.assign({}, state, { showPopUpModel: action.showPopUpModel, popUpMessage: action.message });
        case BottleReturnsPageConstants.GET_BOTTLE_RETURNS_DATA_SUCCESS:
            return Object.assign({}, state, { initialGridData: action.data });
        case BottleReturnsPageConstants.UPDATE_BOTTLE_RETURNS_GRID_DATA:
            return Object.assign({}, state, { updatedGridData: action.data });
        // case BottleReturnsPageConstants.UPDATE_SEARCH_DETAILS_BY_SEARCH:
        //     return Object.assign({}, state, { searchDetailsByDate: action.data, showDownaloadPageSpinner: false, searchErrorMessage: {} });
        case BottleReturnsPageConstants.ERROR_MESSAGE_WHILE_SEARCHING:
            return Object.assign({}, state, { searchErrorMessage: action.data });
        default:
            return state;
    }
}
export default bottleReturnsPageReducer;
export { initialState };