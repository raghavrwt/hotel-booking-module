import queryString from 'query-string';
import verticalData from './verticalData.json';

const formatStrForURL = (str = '') => str.replace(/[^a-zA-Z0-9\s]/g, '').replace(/[\s]+/g, '-').toLowerCase();

const getAttrNames = (verticalId) => {
    return verticalData.query[verticalId] ? verticalData.query[verticalId].map(attr => attr.name) : [];
}

export const paramsFromState = (state = {}, verticalId) => {
    const attrs = getAttrNames(verticalId);
    let queryObj = {};
    let serverData = [];

    attrs.forEach((attr, index) => {
        const paramId = state[attr].paramId === null ? '' : state[attr].paramId;    //to avoid storing null as string in url
        const paramValue = state[attr].paramValue;

        queryObj[`param${index + 1}`] = `${paramValue}|${paramId}`;

        console.log(queryObj);
        serverData.push({
            paramId: state[attr].paramId,
            paramValue
        });
    });

    return {
        serverData,
        queryStr: queryString.stringify(queryObj)
    };
}

export const paramsFromURL = (query = '', verticalId) => {
    const queryObj = queryString.parse(query);
    const attrs = getAttrNames(verticalId);
    let stateObj = {};
    let serverData = [];

    attrs.forEach((attr, index) => {
        const param = queryObj[`param${index + 1}`];
        if (!param) {
            return;
        }

        const [value, paramId] = param.split('|');

        stateObj[attr] = {
            paramValue: value,
            paramId: Number(paramId) || null
        };

        serverData.push(stateObj[attr]);
    });

    return {
        stateObj,
        serverData
    };
}

export const getDetailURL = ({ query, id, verticalId, name }) => {
    const locationId = query['Location'].paramId;
    const {
        queryStr
    } = paramsFromState(query, verticalId);

    return `/detail/${formatStrForURL(name)}/${verticalId}-${locationId}-${id}?${queryStr}`;
}