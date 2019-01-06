import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import Workbook from 'react-excel-workbook';
import { FadeLoader } from 'react-spinners';
// import index from "react-excel-workbook";
import { hashHistory } from "react-router";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import moment from "moment";
// import DateRangePicker from 'react-daterange-picker';
// import 'react-daterange-picker/dist/css/react-calendar.css';

const { AutoComplete: AutoCompleteEditor } = Editors;
// const days = [
//     { id: 0, title: 'Monday' },
//     { id: 1, title: 'Tuesday' },
//     { id: 2, title: 'Wednesday' },
//     { id: 3, title: 'Thursday' },
//     { id: 4, title: 'Friday' },
//     { id: 5, title: 'Saturday' },
//     { id: 6, title: 'Sunday' }
// ];
// const bottleType = [
//     { id: 0, title: 'crown cap 200ml' },
//     { id: 1, title: 'goli colour' },
//     { id: 2, title: 'goli soda' },
//     { id: 3, title: 'crown cap 250ml' }
// // ];
// const BottleType = <AutoCompleteEditor options={bottleType} />;
// const DaysDropDownValue = <AutoCompleteEditor options={days} />;

class InHousePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndexes: [],
            selectedRows: [],
            rowData: [],
            columnsConfig: [],
            showSpinner: false,
            showClearRowInput: false,
            showDeleteRowInput: false,
            rowId: null,
            undoStack: [],
            redoStack: [],
            showMessage: ""
        };
        this.bottleType = [
            { id: 0, title: 'crown cap 200ml' },
            { id: 1, title: 'goli colour' },
            { id: 2, title: 'goli soda' },
            { id: 3, title: 'crown cap 250ml' }
        ];
        this.days = [
            { id: 0, title: 'Monday' },
            { id: 1, title: 'Tuesday' },
            { id: 2, title: 'Wednesday' },
            { id: 3, title: 'Thursday' },
            { id: 4, title: 'Friday' },
            { id: 5, title: 'Saturday' },
            { id: 6, title: 'Sunday' }
        ];
        this.BottleType = <AutoCompleteEditor options={this.bottleType} />;
        this.DaysDropDownValue = <AutoCompleteEditor options={this.days} />;
        // this.showDatePicker = false;
        // this.dates = null;
        // this.datePicker = (date) => {
        //     return (<div onDoubleClick={(event) => {
        //         event.preventDefault();
        //         this.onClickDateField(event);
        //     }}>
        //         <span>{date.value}</span>
        //         {this.showDatePicker ? <div className="date-picker">
        //             <DateRangePicker
        //                 onSelect={this.handleDateSelect}
        //                 value={moment(date.value)}
        //                 selectionType="single"
        //                 local="en"
        //             />  
        //         </div> : null}
        //     </div>);
        // };
    }

    componentWillMount() {
        // let rowData = [
        //     { "id": 1, "date": "11/27/2017", "day": "Monday", "bottleType": "crown cap 200ml", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
        //     { "id": 2, "date": "11/27/2017", "day": "Monday", "bottleType": "goli colour", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
        //     { "id": 3, "date": "11/27/2017", "day": "Monday", "bottleType": "goli soda", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" }
        // ];
        if (_.isEmpty(this.props.userDetails) && !this.props.token) {
            hashHistory.push("/login");
        } else {
            let columnsConfig = [
                {
                    key: 'date',
                    name: 'DATE',
                    editable: true,
                    format: "date",
                    width: 115
                },
                {
                    key: 'day',
                    name: 'DAY',
                    editable: false,
                    format: "string",
                    width: 115
                },
                {
                    key: 'temperature',
                    name: 'TEMPERATURE (\xB0C)',
                    editable: true,
                    width: 140,
                    format: "number"
                },
                {
                    key: 'bottle_type',
                    name: 'BOTTLE TYPE',
                    editor: this.BottleType,
                    format: "string"
                },
                {
                    key: 'rate',
                    name: 'RATE',
                    editable: true,
                    format: "number",
                    width: 120
                },
                {
                    key: 'no_of_bottles',
                    name: 'BOTTLES COUNT',
                    editable: true,
                    format: "number",
                    width: 140

                },
                {
                    key: 'employee_involved',
                    name: 'EMPLOYEE-INVOLVED',
                    editable: true,
                    format: "number",
                    width: 160
                },
                {
                    key: 'employee_cost',
                    name: 'EMPLOYEE-COST',
                    editable: true,
                    format: "number"
                },
                {
                    key: 'bottle_for_cost',
                    name: 'MANUFACTURING COST',
                    editable: false,
                    format: "number"
                }
            ];
            // this.setState({ columnsConfig });
            // this.props.inHousePageActions.inHousePageActionCheck("Hai");
            if (this.props.showSpinner) {
                this.setState({ showSpinner: true });
            } else {
                this.setState({ showSpinner: false });
            }
            if (_.isEmpty(this.props.columnConfig) || this.state.columnsConfig.length === 0) {
                this.props.inHousePageActions.inHousePageColumnConfig(columnsConfig);
                this.setState({ columnsConfig: columnsConfig });
            }
            if (_.isEmpty(this.props.initialGridData) && this.props.token) {
                // let URL = "http://localhost:3010/api/inhouse-getdata?date="+ this.props.userDetails.lastSavedDateForInhouse.toString();
                let URL = "https://goli-soda-services.herokuapp.com/api/inhouse-getdata?date=" + this.props.userDetails.lastSavedDateForInhouse.toString();
                this.props.inHousePageActions.getInHousePageDetails(URL, this.props.token);
            }

            if (!_.isEmpty(this.props.initialGridData) && !_.isEmpty(this.props.columnConfig) && _.isEmpty(this.props.updatedGridData)) {
                let sortedGridData = _.sortBy(this.props.initialGridData, 'id');
                if (sortedGridData.length) {
                    // let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
                    let newGridData = _.cloneDeep(sortedGridData);
                    // newGridData.map((obj, index) => {
                    //     obj.s_no = index + 1;
                    // });
                    this.setState({ rowData: newGridData, columnsConfig: this.props.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(newGridData);
                } else {
                    // sortedGridData.map((obj, index) => {
                    //     obj.s_no = index + 1;
                    // });
                    this.setState({ rowData: sortedGridData, columnsConfig: this.props.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(sortedGridData);
                }
            }
            if (!_.isEmpty(this.props.columnConfig) && !_.isEmpty(this.props.updatedGridData)) {
                let sortedGridData = _.sortBy(this.props.updatedGridData, 'id');
                this.setState({ rowData: sortedGridData, columnsConfig: this.props.columnConfig });
                this.props.inHousePageActions.updateInHousePageGridData(sortedGridData);
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        if (_.isEmpty(nextProps.userDetails) && !nextProps.token) {
            hashHistory.push("/login");
        } else {
            if (nextProps.showSpinner) {
                this.setState({ showSpinner: true });
            } else {
                this.setState({ showSpinner: false });
            }
            // if (_.isEmpty(nextProps.initialGridData) && !_.isEmpty(nextProps.token)) {
            //     let URL = "http://localhost:3010/api/inhouse-getdata";
            //     // let URL = "https://goli-soda-services.herokuapp.com/api/inhouse-getdata";
            //     this.props.inHousePageActions.getInHousePageDetails(URL, nextProps.token.toString());
            // }
            if(!_.isEqual(this.props.updatedGridData, nextProps.updatedGridData)){
                this.setState({rowData: nextProps.updatedGridData});
            }
            if (!_.isEmpty(nextProps.initialGridData) && !_.isEmpty(nextProps.columnConfig) && _.isEmpty(nextProps.updatedGridData)) {
                let sortedGridData = _.sortBy(nextProps.initialGridData, 'id');
                if (sortedGridData.length) {
                    // let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
                    let newGridData = _.cloneDeep(sortedGridData);
                    // newGridData.map((obj, index) => {
                    //     obj.s_no = index + 1;
                    // });
                    this.setState({ rowData: newGridData, columnsConfig: nextProps.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(newGridData);
                } else {
                    // sortedGridData.map((obj, index) => {
                    //     obj.s_no = index + 1;
                    // });
                    this.setState({ rowData: sortedGridData, columnsConfig: nextProps.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(sortedGridData);
                }
            }
            if (!_.isEmpty(nextProps.columnConfig) && !_.isEmpty(nextProps.updatedGridData) && !_.isEqual(this.props.updatedGridData, nextProps.updatedGridData)) {
                let sortedGridData = _.sortBy(nextProps.updatedGridData, 'id');
                // if (sortedGridData.length) {
                //     let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
                //     newGridData.map((obj, index) => {
                //         obj.s_no = index + 1;
                //     });
                //     this.setState({ rowData: newGridData, columnsConfig: nextProps.columnConfig });
                // } else {
                // sortedGridData.map((obj, index) => {
                //     obj.s_no = index + 1;
                // });
                this.setState({ rowData: sortedGridData, columnsConfig: nextProps.columnConfig });
                this.props.inHousePageActions.updateInHousePageGridData(sortedGridData);

                // }
            }
        }

    }

    rowGetter = (i) => {
        return this.state.rowData[i] ? this.state.rowData[i] : {};
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let isValidData = null;
        // ****** Add validation for all Data *****//
        if (!_.isEmpty(updated) && !_.isEmpty(updated[Object.keys(updated)[0]])) {
            try {
                if (!_.isEmpty(updated) && Object.keys(updated).length != 0) {
                    let columnObject = _.find(this.state.columnsConfig, { "key": Object.keys(updated)[0].toString() });
                    if (!_.isEmpty(columnObject) && columnObject.format === "number") {
                        isValidData = !(Number.isNaN(Number.parseInt(updated[columnObject.key])))?null : "Number";
                    }
                    if (!_.isEmpty(updated) && columnObject.format === "date") {
                        isValidData = moment(updated[columnObject.key], "MM-DD-YY", true).isValid()? null : "Date";
                    }
                    if (!_.isEmpty(updated) && columnObject.format === "string") {
                        isValidData = null;
                    }
                }
            } catch (err) {
                NotificationManager.info(err.message, 'Message', 4000);
            }
            if (!_.isEmpty(this.state.rowData) && isValidData === null) {
                let rowData = this.state.rowData.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    let rowToUpdate = rowData[i];
                    let updatedRow = update(rowToUpdate, { $merge: updated });
                    if (updated.rate || updated.no_of_bottles) {
                        let updateBottleForCost = {
                            bottle_for_cost:
                                ((isNaN(Number(updatedRow.rate)) ? 0 : Number(updatedRow.rate)) *
                                    (isNaN(Number(updatedRow.no_of_bottles)) ? 0 : Number(updatedRow.no_of_bottles))).toString()
                        };
                        updatedRow = update(updatedRow, { $merge: updateBottleForCost });
                    } else if (updated.date) {
                        let updateDay = {
                            day: moment(updated.date).format("dddd")
                        };
                        updatedRow = update(updatedRow, { $merge: updateDay });
                    }
                    rowData[i] = updatedRow;
                }
                this.setState({ rowData });
            } else {
                NotificationManager.error(`Invalid ${isValidData} Format.`, 'Message', 4000);
            }
        }
    };
    // onClickDateField = (event) => {
    //     console.log("...click", event.clientX, event.clientY);
    //     this.showDatePicker = true;
    //     this.forceUpdate();
    // }
    // handleDateSelect = (date)=>{
    //     console.log("...date", date);
    //     this.showDatePicker = false;
    //     this.forceUpdate();
    // }
    onClickSave = () => {
        if (!_.isEmpty(this.props.userDetails) && this.props.token) {
            let newObjects = [];
            // let SaveURL = "http://localhost:3010/api/inhouse-savedata";
            let SaveURL = "https://goli-soda-services.herokuapp.com/api/inhouse-savedata";
            let rowData = _.cloneDeep(this.state.rowData);
            if (!_.isEmpty(rowData) && rowData.length !== 0 && this.props.updatedGridData.length !== 0) {
                newObjects = _.differenceWith(rowData, this.props.updatedGridData, (obj1, obj2) => { return obj1.id === obj2.id });
                if (!_.isEmpty(newObjects)) {
                    let emptyCheckFlag = false;
                    let newObjectKeys = Object.keys(newObjects[0]);
                    newObjects.map((obj) => {
                        delete obj._id;
                    });
                    for (let i = 0; i < newObjects.length; i++) {
                        for (let j = 0; j < newObjectKeys.length; j++) {
                            let value = newObjects[i];
                            let validColumn = _.find(this.state.columnsConfig, (obj) => obj.key === newObjectKeys[j]);
                            if (value[newObjectKeys[j]] === "" && !_.isEmpty(validColumn)) {
                                emptyCheckFlag = true;
                                break;
                            }
                        }
                        //Object.keys(newObjects[i]) === columnsConfig[i].datakey
                        //To-Do : to check only necessary fields should not be empty.
                    }
                    if (!emptyCheckFlag) {
                        this.props.inHousePageActions.saveInHouseData(SaveURL,
                            { inhousedata: newObjects, username: this.props.userDetails.username }, this.props.token, this.state.rowData);
                        // NotificationManager.success('Data Saved Successfully.', 'Message', 3000);
                        // this.props.inHousePageActions.updateInHousePageGridData(this.state.rowData);
                        this.setState({ redoStack: [], undoStack: [], selectedIndexes: [], selectedRows: [] });
                    } else {
                        NotificationManager.error('Editable fields should not be empty.', 'Message', 4000);
                    }
                } else {
                    NotificationManager.success('Data is upto date.', 'Message', 4000);
                }
            }
        }
    }
    onCreateRow = () => {
        let rowData = _.cloneDeep(this.state.rowData);
        let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
        undoStack.push(_.cloneDeep(rowData));
        if (rowData.length === 0) {
            rowData = [{
                "id": 0,
                "date": "",
                "day": "",
                "bottle_type": "",
                "rate": "",
                "no_of_bottles": "",
                "employee_involved": "",
                "employee_cost": "",
                "bottle_for_cost": "",
                "temperature": ""
            }];
            let maxId = _.maxBy(this.props.updatedGridData, (obj) => { return obj.id });
            try {
                rowData[0].id = maxId.id + 1;
            } catch (error) {
                //eslint-disable-next-line
                console.log("...error", error);
            }
        } else {
            let maxId = _.maxBy(rowData, (obj) => { return obj.id });
            // let maxSerialNo = rowData.length;
            let objectKeyName = Object.keys(rowData[0]);
            let value = {};
            objectKeyName.map((obj) => {
                if (obj === "id") {
                    value[obj] = maxId.id + 1;
                } else {
                    value[obj] = "";
                }
            });
            // value.s_no = maxSerialNo + 1;
            rowData.push(value);
        }
        // let newObject = { "id": maxId.id + 1, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
        this.setState({ rowData, undoStack, redoStack: [] });
    }
    // onClearRow = () => {
    //     this.setState({ showClearRowInput: !this.state.showClearRowInput, showDeleteRowInput: false });
    // }

    onDeleteRow = () => {
        //commented line for previuos changes
        //this.setState({ showDeleteRowInput: !this.state.showDeleteRowInput, showClearRowInput: false });
        if (!_.isEmpty(this.state.rowData) && this.state.selectedRows.length !== 0) {
            let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
            undoStack.push(_.cloneDeep(this.state.rowData));
            this.setState({
                rowData:
                    _.differenceWith(this.state.rowData, this.state.selectedRows, (obj1, obj2) => obj1.id === obj2),
                undoStack, redoStack: [], selectedRows: [], selectedIndexes: []
            });
        } else {
            NotificationManager.info("Please Select Rows To Delete.", 'Message', 4000);
        }
    }
    // onChangeInput = (e) => {
    //     if ((e.which == 13 || e.keyCode == 13) && e.target.value) {
    //         let rowData = _.cloneDeep(this.state.rowData);
    //         let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
    //         let newRowData = [];
    //         undoStack.push(_.cloneDeep(rowData));
    //         if (this.state.showClearRowInput && this.state.rowId) {
    //             rowData.map((obj) => {
    //                 if (obj.s_no === this.state.rowId) {
    //                     let objectKeyName = Object.keys(obj);
    //                     objectKeyName.map((keyString) => {
    //                         if (keyString === "s_no") {
    //                             obj[keyString] = this.state.rowId;
    //                         } else {
    //                             obj[keyString] = "";
    //                         }
    //                     });
    //                     // obj = { "id": this.state.rowId, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
    //                 }
    //                 newRowData.push(obj);
    //             });
    //             this.setState({ rowData: newRowData, undoStack, redoStack: [] });
    //         } else if (this.state.showDeleteRowInput && this.state.rowId) {
    //             newRowData = rowData.filter((item) => item.s_no !== this.state.rowId);
    //             newRowData.map((obj) => {
    //                 if (obj.s_no > this.state.rowId) {
    //                     obj.s_no = obj.s_no - 1;
    //                 }
    //             });
    //             this.setState({ rowData: newRowData, undoStack, redoStack: [] });
    //         }
    //         this.setState({ showDeleteRowInput: false, showClearRowInput: false });
    //     } else if (e.which == 27 || e.keyCode == 27) {
    //         this.setState({ showDeleteRowInput: false, showClearRowInput: false });
    //     }
    //     this.setState({ rowId: parseInt(e.target.value) });
    // }
    onUndoClick = () => {
        if (!_.isEmpty(this.state.undoStack)) {
            let undoStack = _.cloneDeep(this.state.undoStack);
            let newRowData = _.cloneDeep(undoStack[(undoStack.length - 1)]);
            let redoStack = this.state.redoStack ? _.cloneDeep(this.state.redoStack) : [];
            redoStack.push(_.cloneDeep(this.state.rowData));
            // delete undoStack[(undoStack.length-1)];
            undoStack.pop();
            this.setState({ undoStack, rowData: newRowData, redoStack, selectedIndexes: [], selectedRows: [] });
        }
    }
    onRedoClick = () => {
        if (!_.isEmpty(this.state.redoStack)) {
            let redoStack = _.cloneDeep(this.state.redoStack);
            let newRowData = _.cloneDeep(redoStack[(redoStack.length - 1)]);
            let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
            undoStack.push(_.cloneDeep(this.state.rowData));
            redoStack.pop();
            this.setState({ rowData: newRowData, redoStack, undoStack, selectedIndexes: [], selectedRows: [] });
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
    // onClickRefresh = () => {
    //     if (!_.isEmpty(this.props.userDetails) && !_.isEmpty(this.props.token)) {
    //         // let URL = "http://localhost:3010/api/inhouse-getdata?date="+ this.props.userDetails.lastSavedDateForInhouse.toString();
    //         let URL = "https://goli-soda-services.herokuapp.com/api/inhouse-getdata?date=" + 
    //             this.props.userDetails.lastSavedDateForInhouse.toString();
    //         // this.showDatePicker = false;
    //         this.setState({ rowData: [], redoStack: [], undoStack: [], selectedIndexes: [], selectedRows: [] });
    //         this.props.inHousePageActions.updateInHousePageGridData([]);
    //         this.props.inHousePageActions.getInHousePageDetails(URL, this.props.token.toString());
    //     }
    // }

    onRowsSelected = rows => {
        this.setState({
            selectedIndexes: this.state.selectedIndexes.concat(
                rows.map(r => r.rowIdx)
            ),
            selectedRows: this.state.selectedRows.concat(
                rows.map(r => r.row.id)
            )
        });
    };

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.rowIdx);
        let rowsSelected = rows.map(r => r.row.id);
        this.setState({
            selectedIndexes: this.state.selectedIndexes.filter(
                i => rowIndexes.indexOf(i) === -1
            ),
            selectedRows: this.state.selectedRows.filter(
                i => rowsSelected.indexOf(i) === -1
            ),
        });
    };
    render() {
        //To show notifications for succes/error/warning
        if (!_.isEmpty(this.props.searchErrorMessage)) {
            if (!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message && this.props.searchErrorMessage.type === "error") {
                NotificationManager.error(this.props.searchErrorMessage.message, 'Message', 4000);
                this.props.inHousePageActions.onErrorSearchDetails({});
            } else if (!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message && this.props.searchErrorMessage.type === "success") {
                NotificationManager.success(this.props.searchErrorMessage.message, 'Message', 3000);
                this.props.inHousePageActions.onErrorSearchDetails({});
            }
        }
        return (
            <div className="in-house-container">
                <NotificationContainer />
                <div className="nav-title">
                    <h4 className="nav-title-text">IN HOUSE DATA :</h4>
                    {/* <button className="btn btn-sm btn-primary buttons-logout" onClick={() => this.onClickRefresh()}>
                        <i className="fas fa-sync-alt"></i>Refresh</button> */}
                </div>
                {
                    this.state.showSpinner ? <div className="spinner-backround">&nbsp;</div> : null
                }
                <div className="in-house-spinner">
                    <FadeLoader
                        color={'#0E2B8A'}
                        loading={this.state.showSpinner}
                    />
                </div>
                <div>
                    <ReactDataGrid
                        rowKey="id"
                        enableCellSelect={true}
                        columns={!_.isEmpty(this.state.columnsConfig) ? this.state.columnsConfig : []}
                        rowGetter={this.rowGetter}
                        rowsCount={this.state.rowData ? this.state.rowData.length : 0}
                        minHeight={350}
                        minWidth={1450}
                        onGridRowsUpdated={this.handleGridRowsUpdated}
                        onRowClick={this.onRowClick}
                        rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                                indexes: this.state.selectedIndexes
                            }
                        }}
                    />
                    <button className="btn btn-sm btn-success buttons" onClick={this.onClickSave}>
                        <i className="fas fa-save"></i>Save Data</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onCreateRow}>
                        <i className="fas fa-plus-circle"></i>Create Row</button>
                    {/* <button className="btn btn-sm btn-primary buttons" onClick={this.onClearRow}>
                        <i className="fas fa-minus-circle"></i>Clear Row</button>
                    {this.state.showClearRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        />
                        : null} */}
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onDeleteRow}>
                        <i className="fas fa-trash-alt"></i>Delete Row</button>
                    {/* {this.state.showDeleteRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        /> :
                        null} */}
                    <button className="btn btn-sm btn-primary buttons" data-toggle="tooltip" data-animation="true"
                        data-placement="top" title="Undo" onClick={this.onUndoClick} disabled={_.isEmpty(this.state.undoStack) ? true : false}>
                        <i className="fas fa-undo"></i>Undo</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onRedoClick} disabled={_.isEmpty(this.state.redoStack) ? true : false}>
                        <i className="fas fa-redo" data-toggle="tooltip"
                            data-delay={{ "show": 1000, "hide": 100 }} data-animation="true" data-placement="top" title="Redo"></i>Redo</button>
                </div>

                {/* <div className="row text-center" style={{ marginTop: '100px' }}>
                    <Workbook filename="InHouseData.xlsx"
                        element={
                            <button className="btn btn-lg btn-primary">
                                <i className="glyphicon glyphicon-download-alt"></i>Download Excel
                        </button>
                        }>
                        <Workbook.Sheet data={this.state.rowData ? this.state.rowData : []} name="InHouseData">
                            {!_.isEmpty(this.state.columnsConfig) ? this.getWorkBookDetails(this.state.columnsConfig) : null}
                        </Workbook.Sheet>
                    </Workbook>
                </div> */}
            </div>
        );
    }
}
export default InHousePage;