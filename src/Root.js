import React, { Component } from "react";
import { Provider } from "react-redux";
import { routeComponents } from "./Route";
import { Store } from "./Store";
import ErrorBoundary from "./Application/ErrorHandler"

class Root extends Component {
    render() {
        return (
            <ErrorBoundary>
                <Provider store={Store}>
                    {routeComponents}
                </Provider>
            </ErrorBoundary>
        );
    };
}
export default Root;

// import { HashRouter, Link, Route, Switch } from "react-router-dom";
// class Root extends Component {
//     render() {
//         return (
//             <Provider store={Store}>
//                 <HashRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
//                     <Switch>
//                         <Route exact path="/" component={LandingPage}>
//                             {/* <Route exact path="/home" component={}></Route>
//                         <Route exact path="/properties" component={}></Route>
//                         <Route exact path="/topdevelopers" component={}></Route>
//                         <Route exact path="/happycustomers" component={}></Route>
//                         <Route exact path="/contactus" component={}></Route> */}
//                         </Route>
//                         <Route exact path="/components" component={ComponentsDemo}></Route>
//                     </Switch>
//                 </HashRouter>
//             </Provider>
//         );
//     };
// }
// export default Root;