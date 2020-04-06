import types from './types';
import axios from 'axios';
import {
    paramsFromURL
} from '../common/urlFunctions';
import {
    getResourceData
} from '../common/customer/functions';

export const initialize = ({ verticalId, resourceId, locationId, search }) => {
    return async dispatch => {
        const {
            serverData,
            stateObj
        } = paramsFromURL(search, verticalId);

        const {
            data,
            status
        } = await axios.post('/omni_bookings/customer/getSearchForm.ns', {
            verticalId,
            resourceId,
            locationId,
            params: serverData
        });

        if (status !== 200 || !data.isSuccess) {
            return;
        }

        // data.searchForm = data.searchForm.filter(attr => attr.type !== 'DATE');

        const {
            resources,
            dependants
        } = getResourceData(data.resourceList);
        const details = resources[0];

        let query = {};

        if (!search) {
            data.searchForm.forEach((attr, index) => {
                const data = ['DROPDOWN', 'LOCATION'].includes(attr.type) ? attr.data[0] : attr.data;
                query[attr.name] = {
                    paramId: data.id,
                    paramValue: data.value
                };
            });
        } else {
            query = stateObj;
        }

        dispatch({
            type: types.INITIALIZE_DETAIL,
            payload: {
                resourceDetails: details,
                dependants,
                dependantIndexes: details.dependantIndexes,
                searchForm: data.searchForm,
                query,
                price: details.price,
                addons: details.addons ? details.addons.map(addon => ({ ...addon, value: '' })) : [],
                settingsData: data.settingsData
            }
        })
    };
}