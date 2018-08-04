import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import Workbook from 'react-excel-workbook';
import { FadeLoader } from 'react-spinners';
import Dialog from 'react-bootstrap-dialog'
import index from "react-excel-workbook";

const { AutoComplete: AutoCompleteEditor } = Editors;
const days = [
    { id: 0, title: 'Monday' },
    { id: 1, title: 'Tuesday' },
    { id: 2, title: 'Wednesday' },
    { id: 3, title: 'Thursday' },
    { id: 4, title: 'Friday' },
    { id: 5, title: 'Saturday' },
    { id: 6, title: 'Sunday' }
];
const bottleType = [
    { id: 0, title: 'crown cap 200ml' },
    { id: 1, title: 'goli colour' },
    { id: 2, title: 'goli soda' },
    { id: 3, title: 'crown cap 250ml' }
];
const BottleType = <AutoCompleteEditor options={bottleType} />;
const DaysDropDownValue = <AutoCompleteEditor options={days} />;

class IN_House_Page extends React.Component {
    constructor(props) {
        super(props);
        this._columns = [
            {
                key: 'id',
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
                editor: DaysDropDownValue
            },
            {
                key: 'bottleType',
                name: 'BOTTLE TYPE',
                editor: BottleType
            },
            {
                key: 'rate',
                name: 'RATE',
                editable: true
            },
            {
                key: 'bottleCount',
                name: 'NO.OF.BOTTLES',
                editable: true
            },
            {
                key: 'empCount',
                name: 'EMPLOYEE-INVOLVED',
                editable: true
            },
            {
                key: 'empCost',
                name: 'EMPLOYEE-COST',
                editable: true
            },
            {
                key: 'totalCost',
                name: 'BOTTLES FOR COST',
                editable: true
            }
        ];

        this.state = {
            selectedIndexes: [],
            rowData: [
                { "id": 1, "date": "11/27/2017", "day": "Monday", "bottleType": "crown cap 200ml", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
                { "id": 2, "date": "11/27/2017", "day": "Monday", "bottleType": "goli colour", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" },
                { "id": 3, "date": "11/27/2017", "day": "Monday", "bottleType": "goli soda", "rate": "6", "bottleCount": "5,280", "empCount": "7", "empCost": "1400", "totalCost": "31680" }
            ],
            showSpinner: false,
            showClearRowInput: false,
            showDeleteRowInput: false,
            rowId: null
        };
    }

    rowGetter = (i) => {
        return this.state.rowData[i];
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
        this.setState({ showSpinner: !this.state.showSpinner });
        this.dialog.show({
            body: "Data Saved Successfully.",
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
    onCreateRow = () => {
        let rowData = _.cloneDeep(this.state.rowData)
        let maxId = _.maxBy(rowData, (obj) => { return obj.id });
        let newObject = { "id": maxId.id + 1, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
        rowData.push(newObject);
        this.setState({ rowData });
    }
    onClearRow = () => {
        this.setState({ showClearRowInput: !this.state.showClearRowInput });
    }

    onDeleteRow = () => {
        this.setState({ showDeleteRowInput: !this.state.showDeleteRowInput });
    }
    onChangeInput = (e) => {
        if ((e.which == 13 || e.keyCode == 13) && e.target.value) {
            let rowData = _.cloneDeep(this.state.rowData);
            let newRowData = [];
            if (this.state.showClearRowInput && this.state.rowId) {
                rowData.map((obj, index) => {
                    if (obj.id.toString() === this.state.rowId) {
                        obj = { "id": this.state.rowId, "date": "", "day": "", "bottleType": "", "rate": "", "bottleCount": "", "empCount": "", "empCost": "", "totalCost": "" };
                    }
                    newRowData.push(obj);
                });
                this.setState({ rowData: newRowData });
            } else if (this.state.showDeleteRowInput && this.state.rowId) {
                newRowData = rowData.filter((item) => item.id.toString() !== this.state.rowId);
                newRowData.map((obj, index) => {
                    if (obj.id > this.state.rowId) {
                        obj.id = obj.id - (obj.id - this.state.rowId);
                    }
                });
                this.setState({ rowData: newRowData });
            }
            this.setState({ showDeleteRowInput: false, showClearRowInput: false });
        } else if (e.which == 27 || e.keyCode == 27) {
            this.setState({ showDeleteRowInput: false, showClearRowInput: false });
        }
        this.setState({ rowId: e.target.value });
    }
    render() {
        return (
            <div className="in-house-container">
                <Dialog ref={(el) => { this.dialog = el }} />
                <div className="nav-title"><h4 className="nav-title-text">IN HOUSE DATA :</h4></div>
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
                        columns={this._columns}
                        rowGetter={this.rowGetter}
                        rowsCount={this.state.rowData.length}
                        minHeight={250}
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
                    <button className="btn btn-sm btn-success buttons" onClick={this.onClickSave}>Save Data</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onCreateRow}>Create Row</button>
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onClearRow}>Clear Row</button>
                    {this.state.showClearRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        />
                        : null}
                    <button className="btn btn-sm btn-primary buttons" onClick={this.onDeleteRow}>Delete Row</button>
                    {this.state.showDeleteRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                            onKeyUp={this.onChangeInput}
                        /> :
                        null}
                </div>
                <div className="row text-center" style={{ marginTop: '100px' }}>
                    <Workbook filename="sample.xlsx" element={<button className="btn btn-lg btn-primary">Download Excel</button>}>
                        <Workbook.Sheet data={this.state.rowData ? this.state.rowData : []} name="in-house">
                            <Workbook.Column label="S.No" value="id" />
                            <Workbook.Column label="DATE" value="date" />
                            <Workbook.Column label="DAY" value="day" />
                            <Workbook.Column label="BOTTLE TYPE" value="bottleType" />
                            <Workbook.Column label="RATE" value="rate" />
                            <Workbook.Column label="NO.OF.BOTTLES" value="bottleCount" />
                            <Workbook.Column label="EMPLYEE-INVOLVED" value="empCount" />
                            <Workbook.Column label="EMPLOYEE-COST" value="empCost" />
                            <Workbook.Column label="BOTTLE FOR COST" value="totalCost" />
                        </Workbook.Sheet>
                    </Workbook>
                </div>
            </div>
        );
    }
}
export default IN_House_Page;