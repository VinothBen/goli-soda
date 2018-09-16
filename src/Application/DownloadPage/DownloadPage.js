import React from "react";
import DateRangePicker from 'react-daterange-picker'
import 'react-daterange-picker/dist/css/react-calendar.css' // For some basic styling. (OPTIONAL)
import ReactDataGrid from 'react-data-grid';
// import update from 'immutability-helper';
import { FadeLoader } from 'react-spinners';
import Dialog from 'react-bootstrap-dialog';
import Workbook from 'react-excel-workbook';

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
            showSpinner: false
        }
    }
    componentWillMount() {
        let rowData = [
            { "id": 1, "date": "11/27/2017", "day": "Monday", "total-bottles": "1400", "bottles-producedfor": "1400", "employee-cost": "1400" },
            { "id": 2, "date": "11/27/2017", "day": "Monday", "total-bottles": "1400", "bottles-producedfor": "1400", "employee-cost": "1400" },
            { "id": 3, "date": "11/27/2017", "day": "Monday", "total-bottles": "1400", "bottles-producedfor": "1400", "employee-cost": "1400" }
        ];
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
        this.setState({ rowData, columnsConfig });
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
    rowGetter = (i) => {
        return this.state.rowData[i] ? this.state.rowData[i] : {};
    };

    handleSelect = (dates) => {
        this.setState({ dates, selectedDate: dates.format("YYYY-MM-DD"), showDatePicker: false, isDateSelected: true });
    }

    handleDatePicker = () => {
        this.setState({ showDatePicker: !this.state.showDatePicker });
    }
    onClickSearch = () => {
        if (this.state.isDateSelected && this.state.selectedDate) {
            this.setState({ showDateWarning: false, showSpinner: true });
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
                    this.state.showSpinner ? <div className="spinner-backround">&nbsp;</div> : null
                }
                <div className="in-house-spinner">
                    <FadeLoader
                        color={'#0E2B8A'}
                        loading={this.state.showSpinner}
                    />
                </div>
                <div className="downloadpage-searchcontainer">
                    <div>
                        <div className="date-header"><h4>Select Date:</h4></div>
                        <div onClick={this.handleDatePicker} className="date-details">
                            <span className="date-value">{this.state.selectedDate ? this.state.selectedDate : null}</span>
                            <span className="glyphicon glyphicon-calendar date-icon"></span>
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
                            <i className="glyphicon glyphicon-search"></i>Search</button>
                    </div>
                </div>
                <div className="datagrid-container-1">
                    <div className="grid-header-name"><h4>Details 1:</h4>
                        {/* <button className="btn btn-sm btn-primary button-download">
                            <i className="glyphicon glyphicon-download-alt"></i>Download ExcelData</button> */}
                        <div>
                            <Workbook filename="InHouseData.xlsx"
                                element={
                                    <button className="btn btn-sm btn-primary button-download">
                                        <i className="glyphicon glyphicon-download-alt"></i>Download ExcelData</button>
                                }>
                                <Workbook.Sheet data={this.state.rowData ? this.state.rowData : []} name="InHouseData">
                                    {!_.isEmpty(this.state.columnsConfig) ? this.getWorkBookDetails(this.state.columnsConfig) : null}
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
            </div>);
    }
}

export default DownloadPage;