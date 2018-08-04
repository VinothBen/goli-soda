import HomePageConstants from "./HomePage.Constants";

const initialState = {
    data: "",
    searchData: []
};

function HomePage(state = initialState, action) {
    switch (action.type) {
        case HomePageConstants.UPDATE_DATA:
            return Object.assign({}, state, { data: action.data });
        case HomePageConstants.GET_ALL_PROPERTIES_SUCCESS:
            return Object.assign({}, state, { searchData: action.data });
        default:
            return state;
    }
}
export default HomePage;
export { initialState };