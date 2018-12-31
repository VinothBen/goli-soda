import bottleReturnsConstants from "./BottleReturnsPage.Constants";


export const bottleReturnsColumnConfig = (data) => {
    return {
        type: bottleReturnsConstants.BOTTLE_RETURNS_COLUMN_CONFIG_UPDATE_DATA,
        data
    };
}


export const showBottleReturnsSpinner = (data) => {
    return {
        type: bottleReturnsConstants.SHOW_BOTTLE_RETURNS_SPINNER,
        data
    };
}

export const showDownloadSpinner = (data) => {
    return {
        type: bottleReturnsConstants.SHOW_DOWNLOAD_SPINNER,
        data
    };
}

export const showBottleReturnsPopUpModel = (flagStatus, message) => {
    return {
        type: bottleReturnsConstants.SHOW_BOTTLE_RETURNS_POPUPMODEL,
        showPopUpModel: flagStatus,
        message: message
    };
}

export const getBottleReturnsDetailsSuccess = (data) => {
    let bottleReturnsData = data[0] ? data[0].BottleReturnsData : [];
    return {
        type: bottleReturnsConstants.GET_BOTTLE_RETURNS_DATA_SUCCESS,
        data: bottleReturnsData
    }
}

export const getBottleReturnsDetailsFailure = () => {
    return {
        type: bottleReturnsConstants.GET_BOTTLE_RETURNS_DATA_FAILURE,
        errorMessage: "Some Thing Went Wrong!"
    }
}

export const updateBottleReturnsGridData = (data) => {
    return {
        type: bottleReturnsConstants.UPDATE_BOTTLE_RETURNS_GRID_DATA,
        data
    };
}

export const getBottleReturnsDetails = (url, tokenValue) => {
    return (dispatch) => {
        dispatch(showBottleReturnsSpinner(true));
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
                dispatch(showBottleReturnsSpinner(false));
                dispatch(onErrorSearchDetails({ message: response.statusText.toString(), type: "error" }));
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                if (json && json.message) {
                    // dispatch(onErrorSearchDetails(json));
                    dispatch(onErrorSearchDetails({ message: json.message.toString(), type: "error" }));
                    dispatch(showBottleReturnsSpinner(false));
                } else {
                    dispatch(getBottleReturnsDetailsSuccess(json));
                    dispatch(showBottleReturnsSpinner(false));
                }
            }
        ).catch(() => {
            dispatch(showBottleReturnsSpinner(false));
        })
    }
}

export const onErrorSearchDetails = (data) => {
    return {
        type: bottleReturnsConstants.ERROR_MESSAGE_WHILE_SEARCHING,
        data
    }
}

export const saveBottleReturnsData = (url, postData, tokenValue) => {
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
            .then(data => {
                if (data.errors && data.errors.error && data.errors.error.status >= 400) {
                    dispatch(onErrorSearchDetails({ message: "Save failed - " + data.errors.message, type: "error" }));
                } else if (data && data.message) {
                    dispatch(onErrorSearchDetails({ message: data.message, type: "success" }));
                } else {
                    dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" }));
                }
            })
            .catch(() => dispatch(onErrorSearchDetails({ message: "Save failed.", type: "error" })));
    }
}
