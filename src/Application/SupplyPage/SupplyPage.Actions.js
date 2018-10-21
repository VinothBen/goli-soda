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

export const getSupplyPageDetails = (url) => {
    console.log("Am I Called.....")
    return (dispatch) => {
        dispatch(showSupplySpinner(true));
        url = decodeURIComponent(url);
        let headerValue = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let requestURL = new Request(url, headerValue);
        fetch(requestURL).then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad Response From Server!");
                dispatch(showSupplySpinner(false));
            } else {
                return response.json();
            }
        }).then(
            function (json) {
                dispatch(getSupplyPageDetailsSuccess(json));
                dispatch(showSupplySpinner(false));
            }
        ).catch((error) => {
            dispatch(showInHouseSpinner(false));
        })
    }
}


