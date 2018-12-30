import inHousePageReducer from "./Application/InHousePage/InHousePage.Reducer";
import landingPageReducer from "./Application/LandingPage/LandingPage.Reducer";
import supplyPageReducer from "./Application/SupplyPage/SupplyPage.Reducer";
import bottleReturnsPageReducer from "./Application/BottleReturnsPage/BottleReturnsPage.Reducer";

import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

export default combineReducers(
    {
        routing: routerReducer,
        inHousePageReducer,
        landingPageReducer,
        supplyPageReducer,
        bottleReturnsPageReducer
    }
);