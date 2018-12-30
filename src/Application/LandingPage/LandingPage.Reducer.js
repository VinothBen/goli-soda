import LandingPageConstants from "./LandingPage.Constants";

const initialState = {
    data: "",
    token: "",
    userDetails: {},
    errorMessage: null
};

function LandingPage(state = initialState, action) {
    switch (action.type) {
        case LandingPageConstants.UPDATE_DATA:
            return Object.assign({}, state, { data: action.data });
        case LandingPageConstants.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                token: action.data.user.token,
                userDetails: action.data.user,
                errorMessage: null
            });
        case LandingPageConstants.LOGOUT_OPTION:
            return Object.assign({}, state, {
                token: "",
                userDetails: {},
                errorMessage: null
            });
        case LandingPageConstants.LOGIN_FAILURE:
            return Object.assign({}, state, { errorMessage: action.data, token: "", userDetails: {} });
        default:
            return state;
    }
}
export default LandingPage;
export { initialState };