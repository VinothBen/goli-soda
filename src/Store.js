// import {routerMiddleware, push} from "react-router-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import Logger from "redux-logger";
import Reducers from "../src/CompineReducer";

export let Store = null;
// const middleWare = routerMiddleware(Logger, thunk, hashHistory);
if(process.env.NODE_ENV === "production"){
    Store = createStore(Reducers, applyMiddleware(thunk));
}else{
    Store = createStore(Reducers, applyMiddleware(thunk, Logger));
}