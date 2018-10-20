import React from "react";
import DateRangePicker from 'react-daterange-picker'
import 'react-daterange-picker/dist/css/react-calendar.css' // For some basic styling. (OPTIONAL)
import ReactDataGrid from 'react-data-grid';
// import update from 'immutability-helper';
import { FadeLoader } from 'react-spinners';
import Dialog from 'react-bootstrap-dialog';
import Workbook from 'react-excel-workbook';
import { hashHistory } from "react-router";

class DownloadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date().toISOString(),
            // startDate: moment(),
            dates: null,
            selectedDate: null,
            showDatePicker: false,
            rowData: [],
            columnsConfig: [],
            isDateSelected: false,
            showDateWarning: false,
            showSpinner: false,
            columnConfigDetails2: [],
            rowDataDetails2: [],
            inHouseData: []
        };
        this.bottleTypes = [];
        this.rowData = [
            { "id": 1, "date": "", "day": "", "total-bottles": "", "bottles-producedfor": "", "employee-cost": "" }
        ];
        this.rowDataDetails2 = [
            {
                "crown cap 200ml": "",
                "crown cap 250ml": "",
                "goli colour": "",
                "goli soda": "",
                "day": "",
                "id": 1
            }
        ];
        this.inHousePageColumnConfig = [
            {
                key: 's_no',
                name: 'S.NO',
                width: 50
            },
            {
                key: 'date',
                name: 'DATE',
                editable: true
            },
            {
                key: 'day',
                name: 'DAY',
                editor: this.DaysDropDownValue
            },
            {
                key: 'bottle_type',
                name: 'BOTTLE TYPE',
                editor: this.BottleType
            },
            {
                key: 'rate',
                name: 'RATE',
                editable: true
            },
            {
                key: 'no_of_bottles',
                name: 'NO.OF.BOTTLES',
                editable: true
            },
            {
                key: 'employee_involved',
                name: 'EMPLOYEE-INVOLVED',
                editable: true
            },
            {
                key: 'employee_cost',
                name: 'EMPLOYEE-COST',
                editable: true
            },
            {
                key: 'bottles_for_cost',
                name: 'BOTTLES FOR COST',
                editable: true
            }
        ];
    }
    componentWillMount() {
        if (!_.isEmpty(this.props) && !this.props.username && !this.props.token) {
            hashHistory.push("/login");
        }
        // if(!_.isEmpty(this.props.searchDetailsByDate) && _.has(this.props, "searchDetailsByDate[0].inHouseData")){
        //     this.setState({showSpinner: false});
        // }
        let columnsConfig = [
            {
                key: 'id',
                name: 'S.NO',
                width: 50,
                editable: false
            },
            {
                key: 'date',
                name: 'DATE',
                width: 240,
                editable: false
            },
            {
                key: 'day',
                name: 'DAY',
                width: 240,
                editable: false
            },
            {
                key: 'total-bottles',
                name: 'TOTAL BOTTLES',
                width: 240,
                editable: false
            },
            {
                key: 'bottles-producedfor',
                name: 'BOTTLES PRODUCED FOR',
                width: 240,
                editable: false
            },
            {
                key: 'employee-cost',
                name: 'EMPLOYEE COST',
                width: 240,
                editable: false
            }
        ];
        let columnConfigDetails2 = [
            {
                "key": "id",
                "name": "S.NO",
                "width": 50,
                "editable": false
            },
            {
                "key": "day",
                "name": "DAY",
                "width": 100,
                "editable": false
            },
            {
                "key": "crown cap 200ml",
                "name": "crown cap 200ml",
                "width": 280,
                "editable": false
            },
            {
                "key": "crown cap 250ml",
                "name": "crown cap 250ml",
                "width": 280,
                "editable": false
            },
            {
                "key": "goli colour",
                "name": "goli colour",
                "width": 280,
                "editable": false
            },
            {
                "key": "goli soda",
                "name": "goli soda",
                "width": 280,
                "editable": false
            }
        ];
        this.setState({ rowData: this.rowData, columnsConfig, columnConfigDetails2, rowDataDetails2: this.rowDataDetails2 });
        if (!_.isEmpty(this.props.searchDetailsByDate)) {
            if (_.has(this.props, "searchDetailsByDate[0].inHouseData")) {
                this.setState({ inHouseData: _.get(this.props, "searchDetailsByDate[0].inHouseData") });
                this.constructGridData(_.get(this.props, "searchDetailsByDate[0].inHouseData"));
            }
        }
        // console.log("...props", this.props, new Date().toISOString());
    }
    componentWillReceiveProps(nextProps) {
        // console.log("...nextProps", nextProps);
        if (!_.isEmpty(nextProps) && !nextProps.username && !nextProps.token) {
            hashHistory.push("/login");
        }
        if (!_.isEmpty(nextProps.searchDetailsByDate) && !_.isEqual(this.props.searchDetailsByDate, nextProps.searchDetailsByDate)) {
            if (_.has(nextProps, "searchDetailsByDate[0].inHouseData")) {
                this.setState({ inHouseData: _.get(nextProps, "searchDetailsByDate[0].inHouseData") });
                this.constructGridData(_.get(nextProps, "searchDetailsByDate[0].inHouseData"));
            }
        }
        if (nextProps.searchErrorMessage.message) {
            this.setState({ rowData: this.rowData, rowDataDetails2: this.rowDataDetails2 });
        }
    }
    constructGridData = (data) => {
        let rowData = [];
        let value = [];
        let columnConfigDetails2 = [], rowDataDetails2 = [];
        // **********construct data for grid  ********
        data.map((obj) => {
            value.push({
                rate: obj.rate ? !(Number.isNaN(Number.parseInt(obj.rate))) ?
                    parseInt(obj.rate) : 0 : 0,
                bottleType: obj.bottle_type ? obj.bottle_type : "",
                noOfBottles: obj.no_of_bottles ? !(Number.isNaN(Number.parseInt(obj.no_of_bottles))) ?
                    parseInt(obj.no_of_bottles) : 0 : 0,
                day: obj.day ? obj.day : "",
                date: obj.date ? obj.date : "",
                employeeCost: obj.employee_cost ? !(Number.isNaN(Number.parseInt(obj.employee_cost))) ?
                    parseInt(obj.employee_cost) : 0 : 0
            });
        });
        // **********construct columnConfig for grid 2 ********
        if (!_.isEmpty(value)) {
            this.bottleTypes = value;
            columnConfigDetails2.push(
                {
                    key: 'id',
                    name: 'S.NO',
                    width: 50,
                    editable: false
                },
                {
                    key: "day",
                    name: "DAY",
                    width: 100,
                    editable: false
                }
            );
            value.map((obj, index) => {
                columnConfigDetails2.push(
                    {
                        key: obj.bottleType ? obj.bottleType : "",
                        name: obj.bottleType ? obj.bottleType : "unknown type",
                        width: 280,
                        editable: false
                    }
                );
            });
            this.setState({ columnConfigDetails2 });
        }

        let groupValue = _.groupBy(value, "bottleType");
        let objValue = _.reduce(Object.keys(groupValue), function (o, v) { return o[v] = 0, o; }, {});
        let resultData = _.reduce(groupValue, function (obj, val, key) { obj[key] += val[0].noOfBottles; return obj }, objValue);
        rowDataDetails2.push({ ...resultData, "day": value[0].day, "id": 1 });
        let totalBottles = _.reduce(value, function (obj, val, key) { obj.sum += val.noOfBottles; return obj }, { sum: 0 });
        let bottleProducedFor = _.reduce(value, function (obj, val, key) { obj.sum += parseInt(val.noOfBottles * val.rate); return obj }, { sum: 0 });
        let emplyeeCost = _.reduce(value, function (obj, val, key) { obj.sum += val.employeeCost; return obj }, { sum: 0 });
        rowData.push({
            "id": 1,
            "date": value[0].date,
            "day": value[0].day,
            "total-bottles": totalBottles.sum ? totalBottles.sum : 0,
            "bottles-producedfor": bottleProducedFor.sum ? bottleProducedFor.sum : 0,
            "employee-cost": emplyeeCost.sum ? emplyeeCost.sum : 0
        });

        this.setState({ rowData, rowDataDetails2 });
    }
    rowGetter = (i) => {
        return this.state.rowData[i] ? this.state.rowData[i] : {};
    };
    rowGetterForDetails2 = (i) => {
        return this.state.rowDataDetails2[i] ? this.state.rowDataDetails2[i] : {};
    }
    handleSelect = (dates) => {
        this.setState({ dates, selectedDate: dates.format("MM-DD-YY"), showDatePicker: false, isDateSelected: true });
    }

    handleDatePicker = () => {
        this.setState({ showDatePicker: !this.state.showDatePicker });
    }
    onClickSearch = () => {
        if (this.state.isDateSelected && this.state.selectedDate) {
            this.setState({ showDateWarning: false, showSpinner: true });
            if (this.props.username && this.props.token) {
                // let  url = "http://localhost:3010/api/download-search?date=08-28-18";
                let url = "https://goli-soda-services.herokuapp.com/api/download-search?date=" + this.state.selectedDate;
                // let  url = "https://goli-soda-services.herokuapp.com/api/download-search?date=08-28-18";
                this.props.inHousePageActions.getSearchDetailsByDate(url, this.props.token);
            }
        }
        else {
            this.setState({ showDateWarning: true });
        }
    }
    getWorkBookDetails = (columns) => {
        if (columns) {
            let excelComponents = [];
            columns.map((obj, index) => {
                excelComponents.push(<Workbook.Column key={index} label={obj.name} value={obj.key} />);
            });
            return excelComponents;
        }
    }
    render() {
        return (
            <div className="download-page">
                {
                    this.props.showDownaloadPageSpinner ? <div className="spinner-backround">&nbsp;</div> : null
                }
                <div className="in-house-spinner">
                    <FadeLoader
                        color={'#0E2B8A'}
                        loading={this.props.showDownaloadPageSpinner}
                    />
                </div>
                <div className="downloadpage-searchcontainer">
                    <div>
                        <div className="date-header"><h4>Select Date:</h4></div>
                        <div onClick={this.handleDatePicker} className="date-details">
                            <span className="date-value">{this.state.selectedDate ? this.state.selectedDate : null}</span>
                            <i class="far fa-calendar-alt date-icon"></i>
                        </div>
                        {this.state.showDatePicker ? <div className="date-picker">
                            <DateRangePicker
                                onSelect={this.handleSelect}
                                value={this.state.dates}
                                selectionType="single"
                                local="en"
                            />
                        </div> : null}
                        {this.state.showDateWarning ? <span className="date-warning-message">Please Select Date.</span> : null}
                        <button className="btn btn-sm btn-success button-search" onClick={this.onClickSearch}>
                            <i className="fas fa-search search-icon"></i>Search</button>
                    </div>
                </div>
                {!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message ?
                    <div className="search-warning"><h4>{this.props.searchErrorMessage.message}</h4></div> : null}
                <div className="datagrid-container-1">
                    <div className="grid-header-name"><h4>Details 1:</h4>
                        {/* <button className="btn btn-sm btn-primary button-download">
                            <i className="glyphicon glyphicon-download-alt"></i>Download ExcelData</button> */}
                        <div>
                            <Workbook filename="InHouseData.xlsx"
                                element={
                                    <button className="btn btn-sm btn-primary button-download">
                                        <i className="fas fa-download"></i>Download ExcelData</button>
                                }>
                                <Workbook.Sheet data={this.state.inHouseData ? this.state.inHouseData : []} name="In House Data">
                                    {!_.isEmpty(this.inHousePageColumnConfig) ? this.getWorkBookDetails(this.inHousePageColumnConfig) : null}
                                </Workbook.Sheet>
                                <Workbook.Sheet data={this.state.rowData ? this.state.rowData : []} name="Details 1">
                                    {!_.isEmpty(this.state.columnsConfig) ? this.getWorkBookDetails(this.state.columnsConfig) : null}
                                </Workbook.Sheet>
                                <Workbook.Sheet data={this.state.rowDataDetails2 ? this.state.rowDataDetails2 : []} name="Details 2">
                                    {!_.isEmpty(this.state.columnConfigDetails2) ? this.getWorkBookDetails(this.state.columnConfigDetails2) : null}
                                </Workbook.Sheet>
                            </Workbook>
                        </div>
                    </div>
                    <ReactDataGrid
                        rowKey="id"
                        enableCellSelect={false}
                        columns={!_.isEmpty(this.state.columnsConfig) ? this.state.columnsConfig : []}
                        rowGetter={this.rowGetter}
                        rowsCount={this.state.rowData ? this.state.rowData.length : 0}
                        minHeight={150}
                        onGridRowsUpdated={this.handleGridRowsUpdated}
                    // onRowClick={this.onRowClick}
                    // rowSelection={{
                    //     showCheckbox: false,
                    //     enableShiftSelect: true,
                    //     onRowsSelected: this.onRowsSelected,
                    //     onRowsDeselected: this.onRowsDeselected,
                    //     selectBy: {
                    //         indexes: this.state.selectedIndexes
                    //     }
                    // }}
                    />
                </div>
                <div className="datagrid-container-2">
                    <div className="grid-header-name">
                        <h4>Details 2:</h4>
                    </div>
                    <ReactDataGrid
                        rowKey="id"
                        enableCellSelect={false}
                        columns={!_.isEmpty(this.state.columnConfigDetails2) ? this.state.columnConfigDetails2 : []}
                        rowGetter={this.rowGetterForDetails2}
                        rowsCount={this.state.rowDataDetails2 ? this.state.rowDataDetails2.length : 0}
                        minHeight={150}
                        onGridRowsUpdated={this.handleGridRowsUpdated}
                    // onRowClick={this.onRowClick}
                    // rowSelection={{
                    //     showCheckbox: false,
                    //     enableShiftSelect: true,
                    //     onRowsSelected: this.onRowsSelected,
                    //     onRowsDeselected: this.onRowsDeselected,
                    //     selectBy: {
                    //         indexes: this.state.selectedIndexes
                    //     }
                    // }}
                    />
                </div>
            </div>);
    }
}

export default DownloadPage;