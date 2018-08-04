import React from "react";
import _ from "lodash";
import { Carousel, Button, ButtonToolbar, DropdownButton, MenuItem,Row, Col} from "react-bootstrap";
import SlideImage1 from "../../Images/SlideImage1.jpg";
import SlideImage2 from "../../Images/SlideImage2.jpg";
import SlideImage3 from "../../Images/SlideImage3.jpg";
import { hashHistory } from "react-router";
import TilesModel1 from "../../Components/TilesModel1";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: "0",
            filterValues: {},
            location: ['Chennai', 'Bangalore', 'Andhra'],
            propertyType: ['Villa', 'Apartment']
        }
    }
    componentWillMount() {
        // this.props.actions.homePageActionCheck("Hello!!");
    }
    componentWillReceiveProps(nextProps) {
        console.log("..nextProps", nextProps);
    }
    getDropDowns = (options, key) => {
        let dropDownItems = [];
        if (!_.isEmpty(options)) {
            options.map((value, index) => {
                dropDownItems.push(<MenuItem key={index} eventKey={index} onSelect={() => { this.onChangeDropDown(value, key) }}>{value}</MenuItem>);
            });
        }
        return dropDownItems;
    }
    onClickBudgetItem = (e, keyOption) => {
        const { filterValues } = this.state;
        if (e.target.id) {
            let minValue = e.target.id && keyOption === "min-value" ? e.target.id :
                !_.isEmpty(filterValues.budgetValue) && filterValues.budgetValue.minValue ? filterValues.budgetValue.minValue : "";
            let maxValue = e.target.id && keyOption === "max-value" ? e.target.id :
                !_.isEmpty(filterValues.budgetValue) && filterValues.budgetValue.maxValue ? filterValues.budgetValue.maxValue : "";
            let budgetValue = {
                minValue: minValue,
                maxValue: maxValue
            };
            this.setState({ filterValues: { ...this.state.filterValues, budgetValue } });
        }

    }
    onClickCheckbox = (checkedValue) => {
        console.log("...onClick", checkedValue);
        if (checkedValue) {
            const { filterValues } = this.state;
            let unitsValue = "";
            if (_.has(filterValues, "unitsValue") && filterValues.unitsValue && !filterValues.unitsValue.includes(checkedValue)) {
                console.log("...if");
                unitsValue = filterValues.unitsValue + "," + checkedValue;
            } else if (_.has(filterValues, "unitsValue") && filterValues.unitsValue.includes(checkedValue)) {
                console.log("...else if");
                if (filterValues.unitsValue === checkedValue) {
                    unitsValue = filterValues.unitsValue.replace(checkedValue, "");
                } else {
                    unitsValue = filterValues.unitsValue.replace(checkedValue + ",", "");
                    unitsValue = filterValues.unitsValue.replace("," + checkedValue, "");
                }
            } else {
                console.log("...else");

                unitsValue = checkedValue;
            }
            this.setState({ filterValues: { ...this.state.filterValues, unitsValue } });
        }
    }
    getDropDownComponents = (componentMode) => {
        let comp = null;
        if (componentMode === "checkbox") {
            comp = (<div>
                <label className="checkbox-inline" ><input type="checkbox" onChange={() => this.onClickCheckbox("1BHK")} name="1BHK" />1BHK</label>
                <label className="checkbox-inline" ><input type="checkbox" onChange={() => this.onClickCheckbox("2BHK")} name="2BHK" />2BHK</label>
                <label className="checkbox-inline" ><input type="checkbox" onChange={() => this.onClickCheckbox("3BHK")} name="3BHK" />3BHK</label>
            </div>);
        } else if (componentMode === "range-selections") {
            comp = (<div className="budget-range">
                <div className="min-value">
                    <h6>Min-Value</h6>
                    <ul onClick={(e) => this.onClickBudgetItem(e, "min-value")}>
                        <li id={"10L"}>10L</li>
                        <li id={"15L"}>15L</li>
                        <li id={"20L"}>20L</li>
                        <li id={"25L"}>25L</li>
                        <li id={"30L"}>30L</li>
                        <li id={"35L"}>35L</li>
                    </ul>
                </div>
                <div className="max-value">
                    <h6>Max-Value</h6>
                    <ul onClick={(e) => this.onClickBudgetItem(e, "max-value")}>
                        <li id={"15L"}>15L</li>
                        <li id={"20L"}>20L</li>
                        <li id={"25L"}>25L</li>
                        <li id={"30L"}>30L</li>
                        <li id={"35L"}>35L</li>
                        <li id={"40L"}>40L</li>
                    </ul>
                </div>
            </div>);
        }
        return comp;
    }
    onChangeDropDown = (value, key) => {
        let filterValues = this.state.filterValues;
        filterValues[key] = value;
        this.setState({ filterValues });
    }
    onSearchClick = () => {
        if (!_.isEmpty(this.state.filterValues)) {
            let url = "http://127.0.0.1:5984/builders/_design/filter/_view/builder";
            let key = Object.keys(this.state.filterValues);
            // console.log("...OnSearch", this.state.filterValues, key);
            if (key.length === 1) {
                url = url + "?key[" + "%22" + this.state.filterValues[key[0]] + "%22" + "]";
            } else if (key.length === 2) {
                url = url + "?key=[" + "%22" + this.state.filterValues[key[0]] + "%22" + "," + "%22" + this.state.filterValues[key[1]] + "%22" + "]";
            }
            this.props.actions.getBuilderSearchDetails(url);
        }
    }
    getSearchDetails = () => {
        let comp = [];
        if (!_.isEmpty(this.props.searchData)) {
            if (!_.isEmpty(this.props.searchData.rows)) {
                this.props.searchData.rows.map((rowObjext, index) => {
                    comp.push((<div className="searchtiles" key={index}><h4>{rowObjext.value.builder}</h4><h4>{rowObjext.value.location}</h4><h4>{rowObjext.value.type}</h4></div>));
                });
            } else {
                comp.push(<div key="emptydiv" className="searchtiles"><h4>No Match Found!</h4></div>);
            }
        }
        return comp;
    }
    render() {
        console.log("...render", this.state.filterValues);
        const { filterValues, location, propertyType } = this.state;
        let content = {
            villaName: "The Address...",
            BHK: [1, 2, 4],
            flatSize: { minValue: 556, maxValue: 2623, scale: "sqft" },
            price: { curency: "rupee", value: 25.5, multiplesOf: "L", minValue: true, maxValue: false, fixedValue: false, availableCurrency: ["Rupee", "US-Dolar"] }
        };
        let budgetTitle = !_.isEmpty(filterValues) && _.has(filterValues, "budgetValue") ? filterValues.budgetValue.minValue + "-" + filterValues.budgetValue.maxValue : "Budget";
        let unitTiltle = !_.isEmpty(filterValues) && _.has(filterValues, "unitsValue") ? filterValues.unitsValue : "Units";
        return (< div className="landing-page-container">
            <div className="searchFilterDiv">
                <h2 className="searchFilterHeader">FIND YOUR DREAM HOME</h2>
                <ButtonToolbar>
                    <DropdownButton
                        title={(!_.isEmpty(this.state.filterValues) && _.has(this.state.filterValues, "location")) ? this.state.filterValues.location : "Location"}
                        key={"search-location"}
                        id={"search-location"}
                    >
                        {this.getDropDowns(location, "location")}
                    </DropdownButton>
                    <DropdownButton
                        title={(!_.isEmpty(this.state.filterValues) && _.has(this.state.filterValues, "propertyType")) ? this.state.filterValues.propertyType : "Property Type"}
                        key={"search-type"}
                        id={"search-type"}
                    >
                        {this.getDropDowns(propertyType, "propertyType")}
                    </DropdownButton>
                    <DropdownButton
                        title={budgetTitle}
                        key={"search-budget"}
                        id={"search-budget"}
                    >
                        {this.getDropDownComponents("range-selections")}
                    </DropdownButton>
                    <DropdownButton
                        title={unitTiltle}
                        key={"search-units"}
                        id={"search-units"}
                    >
                        {this.getDropDownComponents("checkbox")}
                    </DropdownButton>
                </ButtonToolbar>
                <Button bsStyle="warning" onClick={(e) => { e.preventDefault(), this.onSearchClick() }}>SEARCH</Button>
            </div>
            <div className="slideBar">
                <Carousel interval={2000} pauseOnHover={false}>
                    <Carousel.Item>
                        <img width={1370} height={400} alt="900x500" src={SlideImage1} />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1370} height={400} alt="900x500" src={SlideImage2} />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1370} height={400} alt="900x500" src={SlideImage3} />
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className="slideBar">
                <Row>
                    <Col xs={4}>
                        <TilesModel1
                            imageURL="http://www.phadke-developers.com/images/projects/girinar-residency/large/flat-apartment-under-construction-reasonable-rate.jpg"
                            placeName="Sholingallur"
                            contents={content}
                            onClickCallBack={this.onClickTilesCallBack}
                            onClickCurrencyChanges={this.onClickCallBack}
                        />
                    </Col>
                    <Col xs={4}>
                        <TilesModel1
                            imageURL="http://www.phadke-developers.com/images/projects/girinar-residency/large/flat-apartment-under-construction-reasonable-rate.jpg"
                            placeName="Sholingallur"
                            contents={content}
                            onClickCallBack={this.onClickTilesCallBack}
                            onClickCurrencyChanges={this.onClickCallBack}
                        />
                    </Col>
                    <Col xs={4}>
                        <TilesModel1
                            imageURL="http://www.phadke-developers.com/images/projects/girinar-residency/large/flat-apartment-under-construction-reasonable-rate.jpg"
                            placeName="Sholingallur"
                            contents={content}
                            onClickCallBack={this.onClickTilesCallBack}
                            onClickCurrencyChanges={this.onClickCallBack}
                        />
                    </Col>
                </Row>
            </div>
            <div className="frmaworkpage">{this.getSearchDetails()}</div>
        </div>);
    }
}
export default HomePage;