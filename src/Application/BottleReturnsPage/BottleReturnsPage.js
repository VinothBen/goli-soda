import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
// import Workbook from 'react-excel-workbook';
import { FadeLoader } from 'react-spinners';
// import index from "react-excel-workbook";
// import { hashHistory } from "react-router";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import moment from "moment";
import { hashHistory } from "react-router";

const { AutoComplete: AutoCompleteEditor } = Editors;

class BottleReturnsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndexes: [],
            rowData: [],
            columnsConfig: [],
            showSpinner: false,
            showClearRowInput: false,
            showDeleteRowInput: false,
            rowId: null,
            undoStack: [],
            redoStack: [],
            showMessage: "",
            selectedRows: []
        }
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
        this.columnsConfig = [];
    }

    componentWillMount() {
        if (_.isEmpty(this.props.userDetails) && !this.props.token) {
            hashHistory.push("/login");
        } else {
            // const url = "http://localhost:3010/api/getBottleReturnsData?date=" + this.props.userDetails.lastSavedDateForBottleReturns.toString();
            let url = "https://goli-soda-services.herokuapp.com/api/getBottleReturnsData?date=" + this.props.userDetails.lastSavedDateForBottleReturns.toString();
            this.columnsConfig = [
                {
                    key: 'date',
                    name: 'DATE',
                    editable: true,
                    format: "date"
                },
                {
                    key: 'day',
                    name: 'DAY',
                    editable: false,
                    format: "string"
                },
                {
                    key: 'area',
                    name: 'AREA',
                    editable: true,
                    format: "string"

                },
                {
                    key: 'bottle_type',
                    name: 'BOTTLE TYPE',
                    editor: this.BottleType,
                    format: "string"
                },
                {
                    key: 'delivered_bottles',
                    name: 'DELEVERED BOTTLES',
                    editable: true,
                    format: "string"

                },
                {
                    key: 'empty_bottles_count',
                    name: 'EMPTY BOTTLES COUNT',
                    editable: true,
                    format: "string"

                },
                {
                    key: 'return_bottles',
                    name: 'RETURN BOTTLES',
                    editable: true,
                    format: "string"

                }
            ];

            this.setState({ showSpinner: this.props.showSpinner });
            if (_.isEmpty(this.props.columnConfig) || _.isEmpty(this.state.columnsConfig)) {
                this.props.bottleReturnActions.bottleReturnsColumnConfig(this.columnsConfig);
                this.setState({ columnsConfig: this.columnsConfig });
            }
            if (_.isEmpty(this.props.initialGridData) && this.props.token) {
                this.props.bottleReturnActions.getBottleReturnsDetails(url, this.props.token);
            }
            if (!_.isEmpty(this.props) && !_.isEmpty(this.props.initialGridData)) {
                this.setState({ rowData: _.cloneDeep(this.props.initialGridData) });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (_.isEmpty(nextProps.userDetails) && !nextProps.token) {
            hashHistory.push("/login");
        } else {
            if (!_.isEmpty(nextProps) && !_.isEmpty(nextProps.initialGridData) && _.isEmpty(nextProps.updatedGridData)) {
                this.setState({ rowData: _.cloneDeep(nextProps.initialGridData) });
                this.props.bottleReturnActions.updateBottleReturnsGridData(nextProps.initialGridData);
            }
            this.setState({ showSpinner: nextProps.showSpinner });
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
                        isValidData = !(Number.isNaN(Number.parseInt(updated[columnObject.key]))) ? null : "Number";
                    }
                    if (!_.isEmpty(updated) && columnObject.format === "date") {
                        isValidData = moment(updated[columnObject.key], "MM-DD-YY", true).isValid() ? null : "Date";
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
                    if (updated.date) {
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

    onClickSave = () => {
        if (!_.isEmpty(this.props.userDetails) && this.props.token) {
            let newObjects = [];
            // let SaveURL = "http://localhost:3010/api/bottleReturns-saveData";
            let SaveURL = "https://goli-soda-services.herokuapp.com/api/bottleReturns-saveData";
            let rowData = _.cloneDeep(this.state.rowData);
            if (!_.isEmpty(rowData) && this.props.updatedGridData.length !== 0) {
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
                        this.props.bottleReturnActions.saveBottleReturnsData(SaveURL,
                            { bottleReturnsData: newObjects, username: this.props.userDetails.username.toString() }, this.props.token, this.state.rowData);
                        // NotificationManager.success('Data Saved Successfully.', 'Message', 3000);
                        // this.props.bottleReturnActions.updateBottleReturnsGridData(this.state.rowData);
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
                "id": "0",
                "date": "",
                "day": "",
                "area": "",
                "bottle_type": "",
                "empty_bottles_count": "",
                "delivered_bottles": "",
                "return_bottles": ""
            }];
            let maxId = _.maxBy(this.props.updatedGridData, (obj) => { return Number(obj.id) });
            try {
                rowData[0].id = (Number(maxId.id) + 1).toString();
            } catch (error) {
                //eslint-disable-next-line
                console.log("...error", error);
            }
        } else {
            let maxId = _.maxBy(rowData, (obj) => { return obj.id });
            let maxSerialNo = rowData.length;
            let objectKeyName = Object.keys(rowData[0]);
            let value = {};
            objectKeyName.map((obj) => {
                if (obj === "id") {
                    value[obj] = maxId.id + 1;
                } else {
                    value[obj] = "";
                }
            });
            value.id = (maxSerialNo + 1).toString();
            rowData.push(value);
        }
        this.setState({ rowData, undoStack, redoStack: [] });
    }

    // onClearRow = () => {
    //     this.setState({ showClearRowInput: !this.state.showClearRowInput, showDeleteRowInput: false });
    // }

    onDeleteRow = () => {
        // this.setState({ showDeleteRowInput: !this.state.showDeleteRowInput, showClearRowInput: false });
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
    //                 if (Number(obj.id) === this.state.rowId) {
    //                     let objectKeyName = Object.keys(obj);
    //                     objectKeyName.map((keyString) => {
    //                         if (keyString === "id") {
    //                             obj[keyString] = this.state.rowId;
    //                         } else {
    //                             obj[keyString] = "";
    //                         }
    //                     });
    //                 }
    //                 newRowData.push(obj);
    //             });
    //             this.setState({ rowData: newRowData, undoStack, redoStack: [] });
    //         } else if (this.state.showDeleteRowInput && this.state.rowId) {
    //             newRowData = rowData.filter((item) => Number(item.id) !== this.state.rowId);
    //             newRowData.map((obj) => {
    //                 if (Number(obj.id) > this.state.rowId) {
    //                     obj.id = (Number(obj.id) - 1).toString();
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

    onClickRefresh = () => {
        if (!_.isEmpty(this.props.userDetails) && !_.isEmpty(this.props.token)) {
            // let URL = "http://localhost:3010/api/getBottleReturnsData?date=" + this.props.userDetails.lastSavedDateForBottleReturns.toString();
            let URL = "https://goli-soda-services.herokuapp.com/api/getBottleReturnsData?date=" + this.props.userDetails.lastSavedDateForBottleReturns.toString();
            this.setState({ rowData: [], redoStack: [], undoStack: [], selectedIndexes: [], selectedRows: [] });
            this.props.bottleReturnActions.updateBottleReturnsGridData([]);
            this.props.bottleReturnActions.getBottleReturnsDetails(URL, this.props.token.toString());
        }
    }
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
                this.props.bottleReturnActions.onErrorSearchDetails({});
            } else if (!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message && this.props.searchErrorMessage.type === "success") {
                NotificationManager.success(this.props.searchErrorMessage.message, 'Message', 3000);
                this.props.bottleReturnActions.onErrorSearchDetails({});
            }
        }
        return (
            <div className="in-house-container">
                <NotificationContainer />
                <div className="nav-title">
                    <h4 className="nav-title-text">BOTTLE RETURNS DETAILS :</h4>
                    <button className="btn btn-sm btn-primary buttons-logout" onClick={() => this.onClickRefresh()}>
                        <i class="fas fa-sync-alt"></i>Refresh</button>
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
                        columns={!_.isEmpty(this.columnsConfig) ? this.columnsConfig : []}
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
                        }} />
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
            </div>
        );
    }
}

export default BottleReturnsPage;