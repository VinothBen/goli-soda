import React from "react";
// import DatePicker from 'react-datepicker';
// import moment from 'moment';
// import 'react-datepicker/dist/react-datepicker.css';
import DayPicker from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import 'react-day-picker/lib/style.css';


class DownloadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date().toISOString(),
            // startDate: moment()
        }
    }
    componentWillMount() {
        console.log("...props", this.props, new Date().toISOString());
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log("...nextProps", nextProps);
    // }
    // handleChange = (date, v) => {
    //     this.setState({
    //         startDate: date
    //     });
    //     console.log("...onChange", date, v);
    // }
    handleSelect = (data) => {
        console.log("...select", data);
    }
    render() {
        return (<div>
            {/* <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                dateFormat="MM/DD/YYY"
            />
            <DayPicker selectedDays={new Date()} /> */}
            <div>
                <div><h4>Select Data:</h4></div>
                <div>
                    <DayPickerInput onDayChange={this.handleSelect} placeholder="DD/MM/YYYY" format="DD/MM/YYYY" />
                </div>
            </div>
        </div>);
    }
}

export default DownloadPage;