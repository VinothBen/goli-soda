import LandingPageConstants from "./LandingPage.Constants";
 
const initialState={
   data:"",
 };

 function LandingPage(state=initialState, action){
  switch(action.type){
    case LandingPageConstants.UPDATE_DATA:
        return Object.assign({}, state, {data:action.data});
    default:
        return state;
  }
 }
 export default LandingPage;
 export {initialState};