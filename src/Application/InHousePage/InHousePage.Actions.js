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

export const showDownloadSpinner = (data) => {
    return {
        type: InHouseConstants.SHOW_DOWNLOAD_SPINNER,
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
        dispatch(showInHouseSpinner(true));
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
                dispatch(showInHouseSpinner(false));
                throw new Error("Bad Response From Server!");
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                dispatch(getInHousePageDetailsSuccess(json));
                dispatch(showInHouseSpinner(false));
            }
        ).catch(() => {
            dispatch(showInHouseSpinner(false));
        })
    }
}
export const onErrorSearchDetails = (data) => {
    return {
        type: InHouseConstants.ERROR_MESSAGE_WHILE_SEARCHING,
        data
    }
}
export const successOnSearchDetailsByDate = (data) => {
    return {
        type: InHouseConstants.UPDATE_SEARCH_DETAILS_BY_SEARCH,
        data
    }
}
export const getSearchDetailsByDate = (url, tokenValue) => {
    return (dispatch) => {
        dispatch(showDownloadSpinner(true));
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
                dispatch(showDownloadSpinner(false));
                dispatch(onErrorSearchDetails({ message: "Bad Response From Server." }));
                throw new Error("Bad Response From Server!");
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                if (json && json.message) {
                    dispatch(onErrorSearchDetails(json));
                    dispatch(showDownloadSpinner(false));
                } else {
                    dispatch(successOnSearchDetailsByDate(json));
                    dispatch(showDownloadSpinner(false));
                }

            }
        ).catch((error) => {
            dispatch(showDownloadSpinner(false));
            dispatch(onErrorSearchDetails(error));
        })
    }
}

export const saveInHouseData = (url, postData, tokenValue) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        let myHeaders = new Headers(
            {
                'Content-Type': 'application/json',
                'authorization': tokenValue
            }
        );
        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(postData)
        };
        let myRequest = new Request(url, myInit);
        fetch(myRequest).then(res => res.json())
            .catch(error => dispatch(onErrorSearchDetails("Save failed."+ error)));
    }
}