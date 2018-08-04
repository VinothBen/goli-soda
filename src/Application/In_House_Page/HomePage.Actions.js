import HomePageConstants from "./HomePage.Constants";
// import axios from "axios";
// import LocalDB from "../../LocalDB"
export const homePageActionCheck = (data) =>{
    return {
        type : HomePageConstants.UPDATE_DATA,
        data
    };  
}

export const getBuilderSearchDetailsSuccess = (data) => {
    return {
        type: HomePageConstants.GET_ALL_PROPERTIES_SUCCESS,
        data
    }
}

export const getBuilderSearchDetailsFailure = () => {
    return {
        type: HomePageConstants.GET_ALL_PROPERTIES_FAILURE,
        errorMessage: "Some Thing Went Wrong!"
    }
}

export const getBuilderSearchDetails = (url) => {
    return (dispatch) => {
        url = decodeURIComponent(url);
        // axios.get(url)
        //     .then((response) => {
        //             dispatch(getBuilderSearchDetailsSuccess(response.data));
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
        fetch(url)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error("Bad Response From Server!");
                } else {
                    return response.json();
                }
            })
            .then(
                function (json) {
                    dispatch(getBuilderSearchDetailsSuccess(json));
                }
            )
    }
}