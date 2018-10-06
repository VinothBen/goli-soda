import InHouseConstants from "./InHousePage.Constants";
// import axios from "axios";
// import LocalDB from "../../LocalDB"
export const inHousePageColumnConfig = (data) => {
    return {
        type: InHouseConstants.IN_HOUSE_COLUMN_CONFIG_UPDATE_DATA,
        data
    };
}

export const updateInHousePageGridData = (data) => {
    return {
        type: InHouseConstants.UPDATE_INHOUSE_GRID_DATA,
        data
    };
}

export const showInHouseSpinner = (data) => {
    return {
        type: InHouseConstants.SHOW_INHOUSE_SPINNER,
        data
    };
}

export const showInHousePopUpModel = (flagStatus, message) => {
    return {
        type: InHouseConstants.SHOW_INHOUSE_POPUPMODEL,
        showPopUpModel: flagStatus,
        message: message
    };
}

export const getInHousePageDetailsSuccess = (data) => {
    let inHouseGridData = data[0] ? data[0].inHouseData : [];
    return {
        type: InHouseConstants.GET_INHOUSE_DATA_SUCCESS,
        data: inHouseGridData
    }
}

export const getInHousePageDetailsFailure = () => {
    return {
        type: InHouseConstants.GET_INHOUSE_DATA_FAILURE,
        errorMessage: "Some Thing Went Wrong!"
    }
}

export const getInHousePageDetails = (url, tokenValue) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        let headerValue = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': tokenValue
            }
        };
        let requestURL = new Request(url, headerValue);
        fetch(requestURL).then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad Response From Server!");
                dispatch(showInHouseSpinner(false));
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                dispatch(getInHousePageDetailsSuccess(json));
                dispatch(showInHouseSpinner(false));
            }
        ).catch((error) => {
            dispatch(showInHouseSpinner(false));
        })
    }
}

export const saveInHouseData = (url, postData, tokenValue) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        var myHeaders = new Headers(
            {
                'Content-Type': 'application/json',
                'authorization': tokenValue
            }
        );
        var myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(postData)
        };

        var myRequest = new Request(url, myInit);
        fetch(myRequest).then(res => res.json())
            .then(response => console.log('Success:', JSON.stringify(response)))
            .catch(error => console.error('Error:', error));
    }
}