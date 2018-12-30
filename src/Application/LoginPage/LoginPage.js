import React from "react";
import { ValidationForm, TextInput } from 'react-bootstrap4-form-validation';
import { Modal } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { hashHistory } from "react-router";
import { FadeLoader } from 'react-spinners';

// import validator from 'validator'

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoginPage: true,
            username: "",
            password: "",
            showSpinner: false
        };
    }
    componentWillMount() {
        // console.log("...props login", this.props);
        if (!_.isEmpty(this.props) && !_.isEmpty(this.props.userDetails) && this.props.token) {
            hashHistory.push("/in-house");
        }
        if (this.props.errorMessage) {
            this.setState({ showSpinner: false });
        }
    }
    componentWillReceiveProps(nextProps) {
        // console.log("...nextProps login", this.props, nextProps);
        if (!_.isEqual(this.props, nextProps)) {
            if (!_.isEmpty(nextProps.userDetails) && nextProps.token) {
                this.setState({ showSpinner: false });
                hashHistory.push("/in-house");
            }
        }
        if (nextProps.errorMessage) {
            this.setState({ showSpinner: false });
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = (e, formData) => {
        e.preventDefault();
        let newFormData = {
            user: _.cloneDeep(formData)
        };
        if (newFormData && newFormData.user.password) {
            this.setState({ showSpinner: true });
            newFormData.user.password = CryptoJS.AES.encrypt(newFormData.user.password, 'secret key vinothben').toString();
            this.props.landingPageActions.loginPostCall("http://localhost:3010/api/user/login", newFormData);
            // this.props.landingPageActions.loginPostCall("https://goli-soda-services.herokuapp.com/api/user/login", newFormData);
        }
    }

    // handleErrorSubmit = (e, formData, errorInputs) => {
    //     console.error(errorInputs)
    // }

    matchPassword = (value) => {
        return value && value === this.state.password;
    }

    render() {
        return (
            <div className="landing-page-container loginpage">
                {
                    this.state.showSpinner ? <div className="spinner-backround">&nbsp;</div> : null
                }
                <div className="in-house-spinner">
                    <FadeLoader
                        color={'#0E2B8A'}
                        sizeUnit={"px"}
                        size={150}
                        loading={this.state.showSpinner}
                    />
                </div>
                <div className="navigation-bar">
                    <div className="header-text"><span className="first">Kannan&nbsp;</span><span className="second">Soda</span></div>
                </div>
                <div className="model-background"></div>
                <div className="static-modal-loginpage">
                    <Modal.Dialog>
                        <Modal.Header>
                            <div className="bk"></div>
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        {this.props.errorMessage ? <div className="login-error">{this.props.errorMessage}</div> : null}
                        <Modal.Body>
                            {/* <ValidationForm onSubmit={this.handleSubmit} onErrorSubmit={this.handleErrorSubmit}> */}
                            <ValidationForm onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <TextInput name="username" id="username" required
                                        value={this.state.firstName}
                                        errorMessage={{ required: "Username is required" }}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <TextInput name="password" id="password" type="password" required
                                        pattern="(?=.*[A-Z]).{6,}"
                                        errorMessage={{ required: "Password is required", pattern: "Password should be at least 6 characters and contains at least one upper case letter" }}
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {/* <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <TextInput name="email" id="email" type="email" 
                                    validator={validator.isEmail} 
                                    errorMessage={{validator:"Please enter a valid email"}}
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    />
                            </div> */}
                                <div className="form-group">
                                    <button className="btn btn-primary">Login</button>
                                    <a className="forgot-password" href="JavaScript:void(0);">Forgot Password?</a>
                                </div>
                            </ValidationForm>
                        </Modal.Body>
                        {/* <Modal.Footer>
                            <Button>Close</Button>
                            <Button bsStyle="primary">Save changes</Button>
                        </Modal.Footer> */}
                    </Modal.Dialog>
                </div>
            </div>
        )
    }
}
export default LoginPage;