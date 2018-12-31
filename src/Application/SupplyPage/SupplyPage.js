import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import { FadeLoader } from 'react-spinners';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import moment from "moment";
import { hashHistory } from "react-router";
const { AutoComplete: AutoCompleteEditor } = Editors;

class SupplyPage extends React.Component {
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
            showMessage: ""
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
            // const url = "http://localhost:3010/api/getSupplyData?date=" + this.props.userDetails.lastSavedDateForSupply.toString();
            let url = "https://goli-soda-services.herokuapp.com/api/getSupplyData?date=" + this.props.userDetails.lastSavedDateForSupply.toString();
            this.columnsConfig = [
                {
                    key: 'id',
                    name: 'S.NO',
                    width: 50
                },
                {
                    key: 'date',
                    name: 'DATE',
                    editable: true,
                    format: "date"
                },
                {
                    key: 'day',
                    name: 'DAY',
                    editor: this.DaysDropDownValue,
                    format: "string"
                },
                {
                    key: 'bottle_type',
                    name: 'BOTTLE TYPE',
                    editor: this.BottleType,
                    format: "string"
                },
                {
                    key: 'total_bottles',
                    name: 'TOTAL BOTTLES',
                    editable: true,
                    format: "number"
                },
                {
                    key: 'type_of_supply',
                    name: 'TYPE OF SUPPLY',
                    editable: true,
                    format: "string"
                },
                {
                    key: 'area',
                    name: 'AREA',
                    editable: true,
                    format: "string"
                },
                {
                    key: 'type_of_vehicle',
                    name: 'TYPE OF VEHICLE',
                    editable: true,
                    format: "string"
                },
                {
                    key: 'fuel_cost',
                    name: 'FUEL-COST',
                    editable: true,
                    format: "number"
                },
                {
                    key: 'employee_wage',
                    name: 'EMPLOYEE - WAGE',
                    editable: true,
                    format: "number"
                }
            ];
            this.setState({ showSpinner: this.props.showSpinner });
            if (_.isEmpty(this.props.columnConfig) || _.isEmpty(this.state.columnsConfig)) {
                this.props.supplyActions.supplyColumnConfig(this.columnsConfig);
                this.setState({ columnsConfig: this.columnsConfig });
            }
            if (_.isEmpty(this.props.initialGridData) && this.props.token) {
                this.props.supplyActions.getSupplyPageDetails(url, this.props.token);
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
                this.props.supplyActions.updateSupplyPageGridData(nextProps.initialGridData);
            }
            this.setState({ showSpinner: nextProps.showSpinner });
        }
    }
    rowGetter = (i) => {
        return this.state.rowData[i] ? this.state.rowData[i] : {};
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let isValidData = false;
        // ****** Add validation for all Data *****//
        if (!_.isEmpty(updated) && !_.isEmpty(updated[Object.keys(updated)[0]])) {
            try {
                if (!_.isEmpty(updated) && Object.keys(updated).length != 0) {
                    let columnObject = _.find(this.state.columnsConfig, { "key": Object.keys(updated)[0].toString() });
                    if (!_.isEmpty(columnObject) && columnObject.format === "number") {
                        isValidData = !(Number.isNaN(Number.parseInt(updated[columnObject.key])));
                    }
                    if (!_.isEmpty(updated) && columnObject.format === "date") {
                        isValidData = moment(updated[columnObject.key], "MM-DD-YY", true).isValid();
                    }
                    if (!_.isEmpty(updated) && columnObject.format === "string") {
                        isValidData = true;
                    }
                }
            } catch (err) {
                NotificationManager.info(err.message, 'Message', 4000);
            }
            if (!_.isEmpty(this.state.rowData) && isValidData) {
                let rowData = this.state.rowData.slice();
                for (let i = fromRow; i <= toRow; i++) {
                    let rowToUpdate = rowData[i];
                    let updatedRow = update(rowToUpdate, { $merge: updated });
                    rowData[i] = updatedRow;
                }
                this.setState({ rowData });
            } else {
                NotificationManager.error('Invalid Date/Data Format.', 'Message', 4000);
            }
        }
    };

    onClickSave = () => {
        if (!_.isEmpty(this.props.userDetails) && this.props.username) {
            let newObjects = [];
            // let SaveURL = "http://localhost:3010/api/supply-saveData";
            let SaveURL = "https://goli-soda-services.herokuapp.com/api/supply-saveData";
            let rowData = _.cloneDeep(this.state.rowData);
            if (!_.isEmpty(rowData) && !_.isEmpty(this.props.updatedGridData) && !_.isEqual(rowData, this.props.updatedGridData)) {
                newObjects = _.differenceWith(rowData, this.props.updatedGridData, (obj1, obj2) => { return obj1.id === obj2.id });
                if (!_.isEmpty(newObjects)) {
                    let isDateEmpty = false;
                    for (let i = 0; i < newObjects.length; i++) {
                        if (newObjects[i].date === "") {
                            isDateEmpty = (newObjects[i].date === "");
                            break;
                        }
                    }
                    if (!isDateEmpty) {
                        this.props.supplyActions.saveSupplyData(SaveURL,
                            { supplyData: newObjects, username: this.props.userDetails.username.toString() }, this.props.token, this.state.rowData);
                        // NotificationManager.success('Data Saved Successfully.', 'Message', 3000);
                        // this.props.supplyActions.updateSupplyPageGridData(this.state.rowData);
                    } else {
                        NotificationManager.error('Date fields should not be empty.', 'Message', 4000);
                    }
                }
            }
        }
    }
    onCreateRow = () => {
        let rowData = _.cloneDeep(this.state.rowData);
        let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
        undoStack.push(_.cloneDeep(rowData));
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
        this.setState({ rowData, undoStack, redoStack: [] });
    }
    onClearRow = () => {
        this.setState({ showClearRowInput: !this.state.showClearRowInput, showDeleteRowInput: false });
    }

    onDeleteRow = () => {
        this.setState({ showDeleteRowInput: !this.state.showDeleteRowInput, showClearRowInput: false });
    }
    onChangeInput = (e) => {
        if ((e.which == 13 || e.keyCode == 13) && e.target.value) {
            let rowData = _.cloneDeep(this.state.rowData);
            let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
            let newRowData = [];
            undoStack.push(_.cloneDeep(rowData));
            if (this.state.showClearRowInput && this.state.rowId) {
                rowData.map((obj) => {
                    if (Number(obj.id) === this.state.rowId) {
                        let objectKeyName = Object.keys(obj);
                        objectKeyName.map((keyString) => {
                            if (keyString === "id") {
                                obj[keyString] = this.state.rowId;
                            } else {
                                obj[keyString] = "";
                            }
                        });
                    }
                    newRowData.push(obj);
                });
                this.setState({ rowData: newRowData, undoStack, redoStack: [] });
            } else if (this.state.showDeleteRowInput && this.state.rowId) {
                newRowData = rowData.filter((item) => Number(item.id) !== this.state.rowId);
                newRowData.map((obj) => {
                    if (Number(obj.id) > this.state.rowId) {
                        obj.id = (Number(obj.id) - 1).toString();
                    }
                });
                this.setState({ rowData: newRowData, undoStack, redoStack: [] });
            }
            this.setState({ showDeleteRowInput: false, showClearRowInput: false });
        } else if (e.which == 27 || e.keyCode == 27) {
            this.setState({ showDeleteRowInput: false, showClearRowInput: false });
        }
        this.setState({ rowId: parseInt(e.target.value) });
    }
    onUndoClick = () => {
        if (!_.isEmpty(this.state.undoStack)) {
            let undoStack = _.cloneDeep(this.state.undoStack);
            let newRowData = _.cloneDeep(undoStack[(undoStack.length - 1)]);
            let redoStack = this.state.redoStack ? _.cloneDeep(this.state.redoStack) : [];
            redoStack.push(_.cloneDeep(this.state.rowData));
            undoStack.pop();
            this.setState({ undoStack, rowData: newRowData, redoStack });
        }
    }
    onRedoClick = () => {
        if (!_.isEmpty(this.state.redoStack)) {
            let redoStack = _.cloneDeep(this.state.redoStack);
            let newRowData = _.cloneDeep(redoStack[(redoStack.length - 1)]);
            let undoStack = this.state.undoStack ? _.cloneDeep(this.state.undoStack) : [];
            undoStack.push(_.cloneDeep(this.state.rowData));
            redoStack.pop();
            this.setState({ rowData: newRowData, redoStack, undoStack });
        }
    }

    onClickRefresh = () => {
        if (!_.isEmpty(this.props.userDetails) && !_.isEmpty(this.props.token)) {
            // const URL = "http://localhost:3010/api/getSupplyData?date=" + this.props.userDetails.lastSavedDateForSupply.toString();
            let URL = "https://goli-soda-services.herokuapp.com/api/getSupplyData?date="+ this.props.userDetails.lastSavedDateForSupply.toString();
            this.setState({ rowData: [], redoStack: [], undoStack: [] });
            this.props.supplyActions.updateSupplyPageGridData([]);
            this.props.supplyActions.getSupplyPageDetails(URL, this.props.token.toString());
        }
    }
    render() {
        //To show notifications for succes/error/warning
        if (!_.isEmpty(this.props.searchErrorMessage)) {
            if (!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message && this.props.searchErrorMessage.type === "error") {
                NotificationManager.error(this.props.searchErrorMessage.message, 'Message', 4000);
                this.props.supplyActions.onErrorSearchDetails({});
            } else if (!_.isEmpty(this.props.searchErrorMessage) && this.props.searchErrorMessage.message && this.props.searchErrorMessage.type === "success") {
                NotificationManager.success(this.props.searchErrorMessage.message, 'Message', 3000);
                this.props.supplyActions.onErrorSearchDetails({});
            }
        }
        return (
            <div className="in-house-container">
                <NotificationContainer />
                <div className="nav-title">
                    <h4 className="nav-title-text">SUPPLY DETAILS :</h4>
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
                            showCheckbox: false,
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
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onClearRow}>
                        <i className="fas fa-minus-circle"></i>Clear Row</button>
                    {this.state.showClearRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        />
                        : null}
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onDeleteRow}>
                        <i className="fas fa-trash-alt"></i>Delete Row</button>
                    {this.state.showDeleteRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        /> :
                        null}
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

export default SupplyPage;