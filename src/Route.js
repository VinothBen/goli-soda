import React from "react";
import { Store } from "./Store";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import LandingPage from "../src/Application/LandingPage/LandingPage.Container";
import InHousePage from "../src/Application/InHousePage/InHousePage.Container";
import DownloadPage from "../src/Application/DownloadPage/DownloadPage.Container";


const history = syncHistoryWithStore(hashHistory, Store);
// const ppsPage = <EmptyPage name="Properties"/>;
export const routeComponents = (
    <Router history={history} basename={process.env.REACT_APP_ROUTER_BASE || ''}>
        < Route path="/" component={LandingPage}>
           <IndexRoute component={InHousePage}/>
            <Route path="/in-house" component={InHousePage} />
            <Route path="/supply" component={()=>(<div>Supply Page Not Found!</div>)}/>
            <Route path="/bottle-return" component={()=>(<div>Bottle Return Page Found!</div>)}/>
            <Route path="/download" component={DownloadPage}/>
            <Route path="/contact-us" component={()=>(<div>Contact Us Page Found!</div>)}/>
            <Route path="*" component={()=>(<div>No Match Found!</div>)} />
        </ Route>
        <Route path="*" component={()=>(<div>No Match Found!</div>)} />
    </Router>
);