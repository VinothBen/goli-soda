import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import Workbook from 'react-excel-workbook';
import { FadeLoader } from 'react-spinners';
import Dialog from 'react-bootstrap-dialog'
import index from "react-excel-workbook";
import { hashHistory } from "react-router";


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
    }

    componentWillMount() {
        // let rowData = [
        //     { "id": 1, "date": "11/27/2017", "day": "Monday", "bottleType": "crown cap 200ml", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
        //     { "id": 2, "date": "11/27/2017", "day": "Monday", "bottleType": "goli colour", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
        //     { "id": 3, "date": "11/27/2017", "day": "Monday", "bottleType": "goli soda", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" }
        // ];
        if (!_.isEmpty(this.props) && !this.props.username && !this.props.token) {
            hashHistory.push("/login");
        } else {
            let columnsConfig = [
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
            // this.setState({ columnsConfig });
            // this.props.inHousePageActions.inHousePageActionCheck("Hai");
            if (this.props.showSpinner) {
                this.setState({ showSpinner: true });
            } else {
                this.setState({ showSpinner: false });
            }
            if (_.isEmpty(this.props.columnConfig)) {
                this.props.inHousePageActions.inHousePageColumnConfig(columnsConfig);
            }
            if (_.isEmpty(this.props.initialGridData) && this.props.token) {
                // let URL = "http://localhost:3010/api/inhouse-getdata";
                let URL = "https://goli-soda-services.herokuapp.com/api/inhouse-getdata";
                this.props.inHousePageActions.getInHousePageDetails(URL, this.props.token);
            }

            if (!_.isEmpty(this.props.initialGridData) && !_.isEmpty(this.props.columnConfig) && _.isEmpty(this.props.updatedGridData)) {
                let sortedGridData = _.sortBy(this.props.initialGridData, 'id');
                if (sortedGridData.length > 5) {
                    let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
                    newGridData.map((obj, index) => {
                        obj.s_no = index + 1;
                    });
                    this.setState({ rowData: newGridData, columnsConfig: this.props.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(newGridData);
                } else {
                    sortedGridData.map((obj, index) => {
                        obj.s_no = index + 1;
                    });
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
        // console.log("...nextProps inhouse", nextProps);
        if (!_.isEmpty(nextProps) && !nextProps.username && !nextProps.token) {
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
            if (!_.isEmpty(nextProps.initialGridData) && !_.isEmpty(nextProps.columnConfig) && _.isEmpty(nextProps.updatedGridData)) {
                let sortedGridData = _.sortBy(nextProps.initialGridData, 'id');
                if (sortedGridData.length > 5) {
                    let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
                    newGridData.map((obj, index) => {
                        obj.s_no = index + 1;
                    });
                    this.setState({ rowData: newGridData, columnsConfig: nextProps.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(newGridData);
                } else {
                    sortedGridData.map((obj, index) => {
                        obj.s_no = index + 1;
                    });
                    this.setState({ rowData: sortedGridData, columnsConfig: nextProps.columnConfig });
                    this.props.inHousePageActions.updateInHousePageGridData(sortedGridData);
                }
            }
            if (!_.isEmpty(nextProps.columnConfig) && !_.isEmpty(nextProps.updatedGridData) && !_.isEqual(this.props.updatedGridData, nextProps.updatedGridData)) {
                let sortedGridData = _.sortBy(nextProps.updatedGridData, 'id');
                // if (sortedGridData.length > 5) {
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
        if (!_.isEmpty(this.state.rowData)) {
            let rowData = this.state.rowData.slice();
            for (let i = fromRow; i <= toRow; i++) {
                let rowToUpdate = rowData[i];
                let updatedRow = update(rowToUpdate, { $merge: updated });
                rowData[i] = updatedRow;
            }
            this.setState({ rowData });
        }
    };

    onClickSave = () => {
        if (!_.isEmpty(this.props) && this.props.username && this.props.username) {
            let newObjects = [];
            let SaveURL = "http://localhost:3010/api/inhouse-savedata";
            // let SaveURL = "https://goli-soda-services.herokuapp.com/api/inhouse-savedata";
            let rowData = _.cloneDeep(this.state.rowData);
            if (!_.isEmpty(rowData) && rowData.length > 5 && !_.isEqual(rowData, this.props.updatedGridData)) {
                newObjects = _.differenceWith(rowData, this.props.updatedGridData, (obj1, obj2) => { return obj1.s_no === obj2.s_no });
                if (!_.isEmpty(newObjects)) {
                    newObjects.map((obj) => {
                        delete obj.s_no;
                    });
                    this.props.inHousePageActions.saveInHouseData(SaveURL, { inhousedata: newObjects }, this.props.token);
                }
                this.props.inHousePageActions.updateInHousePageGridData(this.state.rowData);
            }
            this.dialog.show({
                body: this.state.showMessage ? this.state.showMessage : "Data Saved Successfuly.",
                bsSize: "small",
                actions: [
                    Dialog.OKAction((dialog) => {
                        dialog.hide()
                        this.setState({ showSpinner: false });
                    })
                ],
                onHide: (dialog) => {
                    dialog.hide()
                    this.setState({ showSpinner: false });
                }
            })
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
        objectKeyName.map((obj, index) => {
            if (obj === "id") {
                value[obj] = maxId.id + 1;
            } else {
                value[obj] = "";
            }
        });
        value.s_no = maxSerialNo + 1;
        // let newObject = { "id": maxId.id + 1, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
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
                rowData.map((obj, index) => {
                    if (obj.s_no === this.state.rowId) {
                        let objectKeyName = Object.keys(obj);
                        objectKeyName.map((keyString, index) => {
                            if (keyString === "s_no") {
                                obj[keyString] = this.state.rowId;
                            } else {
                                obj[keyString] = "";
                            }
                        });
                        // obj = { "id": this.state.rowId, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
                    }
                    newRowData.push(obj);
                });
                this.setState({ rowData: newRowData, undoStack, redoStack: [] });
            } else if (this.state.showDeleteRowInput && this.state.rowId) {
                newRowData = rowData.filter((item) => item.s_no !== this.state.rowId);
                newRowData.map((obj, index) => {
                    if (obj.s_no > this.state.rowId) {
                        obj.s_no = obj.s_no - 1;
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
            // delete undoStack[(undoStack.length-1)];
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
            <div className="in-house-container">
                <Dialog ref={(el) => { this.dialog = el }} />
                <div className="nav-title"><h4 className="nav-title-text">IN HOUSE DATA :</h4></div>
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
                        minHeight={300}
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
                        }}
                    />
                    <button className="btn btn-sm btn-success buttons" onClick={this.onClickSave}>
                        <i className="glyphicon glyphicon-floppy-disk"></i>Save Data</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onCreateRow}>
                        <i className="glyphicon glyphicon-plus"></i>Create Row</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onClearRow}>
                        <i className="glyphicon glyphicon-refresh"></i>Clear Row</button>
                    {this.state.showClearRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        />
                        : null}
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onDeleteRow}>
                        <i className="glyphicon glyphicon-remove"></i>Delete Row</button>
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
                        <i className="glyphicon glyphicon-arrow-left"></i>Undo</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onRedoClick} disabled={_.isEmpty(this.state.redoStack) ? true : false}>
                        <i className="glyphicon glyphicon-arrow-right" data-toggle="tooltip"
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