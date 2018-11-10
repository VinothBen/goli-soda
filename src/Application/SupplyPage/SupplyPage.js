import React from "react";
import ReactDataGrid from 'react-data-grid';
import { Editors } from 'react-data-grid-addons';
import update from 'immutability-helper';
import Workbook from 'react-excel-workbook';
import { FadeLoader } from 'react-spinners';
import index from "react-excel-workbook";
import { hashHistory } from "react-router";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import moment from "moment";

const { AutoComplete: AutoCompleteEditor } = Editors;

class SupplyPage extends React.Component {
     constructor(props){
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

     componentWillMount(){
        const url = "http://localhost:3010/api/getSupplyData"
        // let url = "https://goli-soda-services.herokuapp.com/api/getSupplyData";
        this.columnsConfig = [
            {
                key: 's_no',
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
            },
            {
                key: 'delivery_expense',
                name: 'DELIVERY-EXPENSE',
                editable: true,
                format: "number"
            }
        ];

        if (_.isEmpty(this.props.columnConfig)) {
            this.props.actions.supplyColumnConfig(this.columnsConfig);
        }

        if (_.isEmpty(this.props.initialGridData)) {
            this.props.actions.getSupplyPageDetails(url);
       }
       if(!_.isEmpty(this.props) && !_.isEmpty(this.props.initialGridData)){
        this.setState({rowData: _.cloneDeep(nextProps.initialGridData)});
    }
        // if (!_.isEmpty(this.props.initialGridData) && !_.isEmpty(this.props.columnConfig) &&  _.isEmpty(this.props.updatedGridData)) {
        //     let sortedGridData = _.sortBy(this.props.initialGridData, 'id');
        //     if (sortedGridData.length > 5) {
        //         let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
        //         newGridData.map((obj, index) => {
        //             obj.s_no = index + 1;
        //         });
        //         this.setState({ rowData: newGridData, columnsConfig: this.props.columnConfig });
        //         this.props.actions.updateSupplyPageGridData(newGridData);
        //     } else {
        //         sortedGridData.map((obj, index) => {
        //             obj.s_no = index + 1;
        //         });
        //         this.setState({ rowData: sortedGridData, columnsConfig: this.props.columnConfig });
        //         this.props.actions.updateSupplyPageGridData(sortedGridData);
        //     }
        // }
        if (!_.isEmpty(this.props.columnConfig) && !_.isEmpty(this.props.updatedGridData)) {
            let sortedGridData = _.sortBy(this.props.updatedGridData, 'id');
            this.setState({ rowData: sortedGridData, columnsConfig: this.props.columnConfig });
            this.props.actions.updateSupplyPageGridData(sortedGridData);
        }        
    }

    componentWillReceiveProps(nextProps) {
        console.log("...nextProps inhouse", nextProps);
        if(!_.isEmpty(nextProps) && !_.isEmpty(nextProps.initialGridData)){
            this.setState({rowData: _.cloneDeep(nextProps.initialGridData)});
        }
        // if (!_.isEmpty(nextProps)) {
        //     hashHistory.push("/login");
        // } else {
        //     if (nextProps.showSpinner) {
        //         this.setState({ showSpinner: true });
        //     } else {
        //         this.setState({ showSpinner: false });
        //     }
        //     if (!_.isEmpty(nextProps.initialGridData) && !_.isEmpty(nextProps.columnConfig) && _.isEmpty(nextProps.updatedGridData)) {
        //         let sortedGridData = _.sortBy(nextProps.initialGridData, 'id');
        //         if (sortedGridData.length > 5) {
        //             let newGridData = sortedGridData.slice(Math.max(sortedGridData.length - 5, 1));
        //             newGridData.map((obj, index) => {
        //                 obj.s_no = index + 1;
        //             });
        //             this.setState({ rowData: newGridData, columnsConfig: nextProps.columnConfig });
        //             this.props.actions.updateSupplyPageGridData(newGridData);
        //         } else {
        //             sortedGridData.map((obj, index) => {
        //                 obj.s_no = index + 1;
        //             });
        //             this.setState({ rowData: sortedGridData, columnsConfig: nextProps.columnConfig });
        //             this.props.actions.updateSupplyPageGridData(sortedGridData);
        //         }
        //     }
        //     if (!_.isEmpty(nextProps.columnConfig) && !_.isEmpty(nextProps.updatedGridData) && !_.isEqual(this.props.updatedGridData, nextProps.updatedGridData)) {
        //         let sortedGridData = _.sortBy(nextProps.updatedGridData, 'id');
        //         this.setState({ rowData: sortedGridData, columnsConfig: nextProps.columnConfig });
        //         this.props.actions.updateSupplyPageGridData(sortedGridData);
        //     }
        // }

    }

    rowGetter = (i) => {
        return this.state.rowData[i] ? this.state.rowData[i] : {};
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let isValidData = false;
        // ****** Add validation for all Data *****//
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
    };

    render(){
        return(
          <div className="in-house-container">
            <NotificationContainer />
            <div className="nav-title">
                <h4 className="nav-title-text">SUPPLY DETAILS :</h4>
                <button className="btn btn-sm btn-primary buttons-logout">
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
                    }}/>
                    <button className="btn btn-sm btn-success buttons">
                        <i className="fas fa-save"></i>Save Data</button>
                    <button className="btn btn-sm btn-primary buttons">
                        <i className="fas fa-plus-circle"></i>Create Row</button>
                    <button className="btn btn-sm btn-primary buttons">
                        <i className="fas fa-minus-circle"></i>Clear Row</button>
                    {this.state.showClearRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                        />
                        : null}
                    <button className="btn btn-sm btn-primary buttons">
                        <i className="fas fa-trash-alt"></i>Delete Row</button>
                    {this.state.showDeleteRowInput ?
                        <input
                            type="number"
                            placeholder="Enter Row No"
                            defaultValue=""
                        /> :
                        null}
                    <button className="btn btn-sm btn-primary buttons" data-toggle="tooltip" data-animation="true"
                        data-placement="top" title="Undo"  disabled={_.isEmpty(this.state.undoStack) ? true : false}>
                        <i className="fas fa-undo"></i>Undo</button>
                    <button className="btn btn-sm btn-primary buttons" disabled={_.isEmpty(this.state.redoStack) ? true : false}>
                        <i className="fas fa-redo" data-toggle="tooltip"
                            data-delay={{ "show": 1000, "hide": 100 }} data-animation="true" data-placement="top" title="Redo"></i>Redo</button> 

            </div>
          </div>  
         );
     }
}

export default SupplyPage;