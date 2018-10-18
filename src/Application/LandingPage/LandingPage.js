import React from "react";
import _ from "lodash";
import { hashHistory } from "react-router";
import {Modal ,Button} from "react-bootstrap";

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: "0",
            navOptions: ["IN HOUSE", "SUPPLY", "BOTTLE RETURN", "DOWNLOAD", "CONTACT US"],
            showModel: false
        }
    }
    componentWillMount() {

        if (!_.isEmpty(this.props.routes) && this.props.routes[1].path) {
            for (let i = 0; i < this.state.navOptions.length; i++) {
                let routingValue = "/" + this.state.navOptions[i].replace(/\s+/g, '-').toLocaleLowerCase();
                if (routingValue === this.props.routes[1].path) {
                    this.setState({ activeIndex: i.toString() });
                    break;
                }
            }
        }
        // this.props.landingPageActions.landingPageActionCheck("Hai!");

    }
    // componentWillReceiveProps(nextProps){
    //     console.log("..nextProps", nextProps);
    // }
    onClickNavMenu = (e) => {
        if (e.target.id) {
            this.setState({ activeIndex: e.target.id });
            let routingValue = "/" + this.state.navOptions[parseInt(e.target.id)].replace(/\s+/g, '-').toLocaleLowerCase();
            hashHistory.push(routingValue.toString());
        }

    }
    getNavigationMenu = (values) => {
        let comp = [];

        let { activeIndex } = this.state;
        if (!_.isEmpty(values)) {
            values.map((value, index) => {
                comp.push(<li className={activeIndex === index.toString() ? "active underscore-bar" : ""} id={index} key={index}>{value}
                </li>);
            });
        }
        return comp;
    }
    // onClickLogout = () => {
    //     this.setState({ showModel: true });
    // }
    handleOkButton = () => {
        this.props.landingPageActions.logOutOption();
    }
    // handleHide = () => {
    //     this.setState({ showModel: false });
    // }
    render() {
        return (< div className="landing-page-container">
            <div className="navigation-bar">
                <div className="header-text"><span className="first">Kannan&nbsp;</span><span className="second">Soda</span></div>
                <div className="logout-button" data-toggle="tooltip" title="Logout"
                    data-delay={{ "show": 0, "hide": 100 }} onClick={()=> this.setState({showModel:true})}>
                    <i class="fas fa-sign-out-alt"></i>
                </div>
                <ul onClick={this.onClickNavMenu}>
                    {this.getNavigationMenu(this.state.navOptions)}
                </ul>
            </div>
            <div>
                <Modal
                    show={this.state.showModel}
                    onHide={ ()=> this.setState({showModel:false}) }
                    container={this}
                    aria-labelledby="contained-modal-title"
                    animation={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            Warning!
            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Aru you sure you want to logout?
          </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={()=>this.handleOkButton()}>Ok</Button>
                        <Button onClick={()=> this.setState({showModel:false})}>Cencel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {this.props.children}
        </div>);
    }
}
export default LandingPage;