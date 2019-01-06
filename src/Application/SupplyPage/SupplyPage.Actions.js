import supplyConstants from "./SupplyPage.Constants";


export const supplyColumnConfig = (data) => {
    return {
        type: supplyConstants.SUPPLY_COLUMN_CONFIG_UPDATE_DATA,
        data
    };
}


export const showSupplySpinner = (data) => {
    return {
        type: supplyConstants.SHOW_SUPPLY_SPINNER,
        data
    };
}

export const showDownloadSpinner = (data) => {
    return {
        type: supplyConstants.SHOW_DOWNLOAD_SPINNER,
        data
    };
}

export const showSupplyPopUpModel = (flagStatus, message) => {
    return {
        type: supplyConstants.SHOW_SUPPLY_POPUPMODEL,
        showPopUpModel: flagStatus,
        message: message
    };
}

export const getSupplyPageDetailsSuccess = (data) => {
    let supplyData = data[0] ? data[0].supplyData : [];
    return {
        type: supplyConstants.GET_SUPPLY_DATA_SUCCESS,
        data: supplyData
    }
}
export const getSupplyPageDetailsReInitialise = (data) => {
    return {
        type: supplyConstants.GET_SUPPLY_DATA_SUCCESS,
        data
    }
}
export const getSupplyPageDetailsFailure = () => {
    return {
        type: supplyConstants.GET_SUPPLY_DATA_FAILURE,
        errorMessage: "Some Thing Went Wrong!"
    }
}

export const updateSupplyPageGridData = (data) => {
    return {
        type: supplyConstants.UPDATE_SUPPLY_GRID_DATA,
        data
    };
}

export const getSupplyPageDetails = (url, tokenValue) => {
    return (dispatch) => {
        dispatch(showSupplySpinner(true));
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
                dispatch(showSupplySpinner(false));
                dispatch(onErrorSearchDetails({ message: response.statusText.toString(), type: "error" }));
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                if (json && json.message) {
                    // dispatch(onErrorSearchDetails(json));
                    dispatch(onErrorSearchDetails({ message: json.message.toString(), type: "error" }));
                    dispatch(showSupplySpinner(false));
                } else {
                    dispatch(getSupplyPageDetailsSuccess(json));
                    dispatch(showSupplySpinner(false));
                }
            }
        ).catch(() => {
            dispatch(showSupplySpinner(false));
        })
    }
}

export const onErrorSearchDetails = (data) => {
    return {
        type: supplyConstants.ERROR_MESSAGE_WHILE_SEARCHING,
        data
    }
}

export const saveSupplyData = (url, postData, tokenValue, rowData) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        dispatch(showSupplySpinner(true));
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
                    dispatch(showSupplySpinner(false));
                } else if (data && data.message) {
                    dispatch(onErrorSearchDetails({ message: data.message, type: "success" }));
                    dispatch(showSupplySpinner(false));
                    dispatch(updateSupplyPageGridData(rowData));
                    dispatch(getSupplyPageDetailsReInitialise(rowData));
                } else {
                    dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" }));
                    dispatch(showSupplySpinner(false));
                }
            })
            .catch(() => {
                dispatch(showSupplySpinner(false));
                dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" }))
            }
            );
    }
}

