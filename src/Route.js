import React from "react";
import { Store } from "./Store";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import LandingPage from "../src/Application/LandingPage/LandingPage.Container";
import In_House_Page from "../src/Application/In_House_Page/In_House_Page";

const history = syncHistoryWithStore(hashHistory, Store);
// const ppsPage = <EmptyPage name="Properties"/>;

export const routeComponents = (
    <Router history={history} basename={process.env.REACT_APP_ROUTER_BASE || ''}>
        < Route path="/" component={LandingPage}>
           <IndexRoute component={In_House_Page}/>
            <Route path="/in-house" component={In_House_Page} />
            <Route path="/supply" component={()=>(<div>Supply Page Not Found!</div>)}/>
            <Route path="/bottle-return" component={()=>(<div>Bottle Return Page Found!</div>)}/>
            <Route path="/download" component={()=>(<div>Download Page Found!</div>)}/>
            <Route path="/contact-us" component={()=>(<div>Contact Us Page Found!</div>)}/>
            <Route path="*" component={()=>(<div>No Match Found!</div>)} />
        </ Route>
        <Route path="*" component={()=>(<div>No Match Found!</div>)} />
    </Router>
);