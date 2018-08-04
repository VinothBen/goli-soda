import React, {Component} from "react";

class EmptyPageComponent extends Component{
    render(){
        return(<div><h2>This is {this.props.name?this.props.name:"Empty"} page!</h2></div>);
    }
}
export default EmptyPageComponent;