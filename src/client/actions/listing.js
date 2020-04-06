import types from './types';
import axios from 'axios';
import {
    paramsFromState,
    paramsFromURL
} from '../common/urlFunctions';
import {
    getResourceData
} from '../common/customer/functions';

export const initialize = (search) => {

    return async (dispatch, getStore) => {

        const {
            userData: {
                verticalId
            }
        } = getStore();

        const {
            serverData,
            stateObj
        } = paramsFromURL(search, verticalId);

        console.log(serverData);
        console.log(stateObj);
        const {
            status,
            data
        } = await axios.post('/omni_bookings/customer/getSearchForm.ns', serverData.length ? {
            verticalId,
            params: serverData
        } : { verticalId });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        let query = {};

        if (!search) {
            data.searchForm.forEach((attr, index) => {
                const data = ['DROPDOWN', 'LOCATION'].includes(attr.type) ? attr.data[0] : attr.data;
                query[attr.name] = {
                    paramId: data.id,
                    paramValue: data.value
                };
            });
            console.log(query);
        } else {
            query = stateObj;
            console.log(query);
        }

        const {
            resources,
            dependants
        } = getResourceData(data.resourceList);

        dispatch({
            type: types.INITIALIZE_LISTING,
            payload: {
                searchForm: data.searchForm,
                resourceList: resources,
                dependants,
                query,
                settingsData: data.settingsData
            }
        });
    };
}

export const postQuery = (formData, cb) => {
    return async (dispatch, getStore) => {
        const {
            userData: {
                verticalId
            },
            booking: {
                searchForm
            }
        } = getStore();

        console.log(getStore())
        let selectedParams = {};

        const saveData = formData.map((value, index) => {
            const inputData = searchForm[index].data;
            let returnObj = {};

            if (Array.isArray(inputData)) {
                const selected = inputData.find(ele => {
                    return ele.value === value
                });
                returnObj = {
                    paramId: selected.id,
                    paramValue: value
                }
            } else {
                returnObj = {
                    paramId: inputData.id,
                    paramValue: value
                }
            }

            selectedParams[searchForm[index].name] = returnObj;

            return returnObj;
        });

        //hit service
        const {
            status,
            data
        } = await axios.post('/omni_bookings/customer/getResourceBySearchParams.ns', { params: saveData });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        const {
            queryStr
        } = paramsFromState(selectedParams, verticalId);

        cb && cb(queryStr);

        const {
            resources,
            dependants
        } = getResourceData(data.resourceList);

        dispatch({
            type: types.SET_RESOURCE_LIST,
            payload: {
                resourceList: resources,
                dependants,
                query: selectedParams
            }
        });
    }
}