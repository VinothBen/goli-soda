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
                dispatch(onErrorSearchDetails({message:response.statusText.toString(), type:"error"}));
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                if (json && json.message) {
                    // dispatch(onErrorSearchDetails(json));
                    dispatch(onErrorSearchDetails({message: json.message.toString(), type:"error"}));
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

export const saveInHouseData = (url, postData, tokenValue, rowData) => {
    return (dispatch) => {
        dispatch(showInHouseSpinner(true));
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
            .then(data => {
                if (data.errors && data.errors.error) {
                    dispatch(onErrorSearchDetails({ message: "Save failed - " + data.errors.message, type: "error" }));
                    dispatch(showInHouseSpinner(false));
                } else if (data && data.message) {
                    dispatch(onErrorSearchDetails({ message: data.message, type: "success" }));
                    dispatch(showInHouseSpinner(false));
                    dispatch(updateInHousePageGridData(rowData));
                } else {
                    dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" }));
                    dispatch(showInHouseSpinner(false));
                }
            })
            .catch(() => {
                dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" }));
                dispatch(showInHouseSpinner(false));
            });
    }
}