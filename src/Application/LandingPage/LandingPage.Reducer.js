import LandingPageConstants from "./LandingPage.Constants";

const initialState = {
    data: "",
    token: "",
    username: "",
    errorMessage: null
};

function LandingPage(state = initialState, action) {
    switch (action.type) {
        case LandingPageConstants.UPDATE_DATA:
            return Object.assign({}, state, { data: action.data });
        case LandingPageConstants.LOGIN_SUCCESS:
            return Object.assign({}, state, {
                token: action.data.user.token,
                username: action.data.user.username,
                errorMessage: null
            });
        case LandingPageConstants.LOGOUT_OPTION:
            return Object.assign({}, state, {
                token: "",
                username: "",
                errorMessage: null
            });
        case LandingPageConstants.LOGIN_FAILURE:
            return Object.assign({}, state, { errorMessage: action.data, token: "", username: "" });
        default:
            return state;
    }
}
export default LandingPage;
export { initialState };