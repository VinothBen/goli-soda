import SupplyPageConstants from "./SupplyPage.Constants";

const initialState = {
    columnConfig: [],
    initialGridData: [],
    updatedGridData: [],
    showSpinner: false,
    showPopUpModel: false,
    popUpMessage: "",
    searchDetailsByDate: [],
    showDownaloadPageSpinner: false,
    searchErrorMessage: {}
};

function supplyPageReducer(state = initialState, action) {
    switch (action.type) {
        case SupplyPageConstants.SUPPLY_COLUMN_CONFIG_UPDATE_DATA:
            return Object.assign({}, state, { columnConfig: action.data });
        case SupplyPageConstants.SHOW_SUPPLY_SPINNER:
            return Object.assign({}, state, { showSpinner: action.data });
        case SupplyPageConstants.SHOW_DOWNLOAD_SPINNER:
            return Object.assign({}, state, { showDownaloadPageSpinner: action.data });
        case SupplyPageConstants.SHOW_SUPPLY_POPUPMODEL:
            return Object.assign({}, state, { showPopUpModel: action.showPopUpModel, popUpMessage: action.message });
        case SupplyPageConstants.GET_SUPPLY_DATA_SUCCESS:
            return Object.assign({}, state, { initialGridData: action.data });
        case SupplyPageConstants.UPDATE_SUPPLY_GRID_DATA:
            return Object.assign({}, state, { updatedGridData: action.data });
        /*case SupplyPageConstants.UPDATE_SEARCH_DETAILS_BY_SEARCH:
            return Object.assign({}, state, { searchDetailsByDate: action.data, showDownaloadPageSpinner: false, searchErrorMessage: {} });
        case SupplyPageConstants.ERROR_MESSAGE_WHILE_SEARCHING:
            return Object.assign({}, state, { searchErrorMessage: action.data });*/
        default:
            return state;
    }
}
export default supplyPageReducer;
export { initialState };