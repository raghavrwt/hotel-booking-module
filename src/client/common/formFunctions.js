import {
    getMenuDetails,
    getVerticalObj
} from './menuFunctions';

const validateValue = (input, val) => {
    if(input.required === 1 && !val) {
        return {
            error: true,
            errorMsg: 'Required'
        };
    }

    let error = false;
    let errorMsg = '';

    switch (input.type) {
        case 'INT':
        case 'FLOAT':
            if (input.min && Number(val) < input.min) {
                error = true;
                errorMsg = `Min ${input.min} required`;
            } else if (input.max && Number(val) > input.max) {
                error = true;
                errorMsg = `Max ${input.max} allowed`;
            }
            break;
    }

    return {
        error,
        errorMsg
    };
}

export const validateField = (input) => {
    let valid = true;
    let errors = [];
    let msgs = [];

    if(input.required === 1 && input.value.length === 0) {
        return {
            error: [true],
            errorMsg: [['DROPDOWN', 'CHECKBOX'].indexOf(input.type) !== -1 ? 'Please select any one' : 'Required']
        };
    }
    
    input.value.forEach(val => {
        const {
            error,
            errorMsg
        } = validateValue(input, val);

        valid = valid && !error;

        errors.push(error);
        msgs.push(errorMsg);
    });

    return {
        error: errors,
        errorMsg: msgs,
        isValid: valid
    };
}

export const getDefaultValue = (attr={}, isEmpty=false) => {
    switch(attr.type) {
        case 'DROPDOWN':
            return attr.values && !isEmpty ? [attr.values[0]] : [];
        case 'CHECKBOX':
            return [];
        case 'PHOTO':
            return [];
        default:
            return isEmpty ? [] : [''];
    }
}

const getCheckboxObj = (obj) => {
    return {
        "title": obj.title,
        "attributes": [{
            "attributeId": obj.id,
            "type": "CHECKBOX",
            "required": 1,
            "values": obj.values
        }]
    };
}


export const getDependantSegment = ({ menuObj = {}, data = {}, selectedVertical, values }) => {
    let arr = [];

    const verticalData = getVerticalObj(data, selectedVertical);
    const getResourceNames = obj => obj.data.map(r => ({
        name: r.resourceName,
        id: r.resourceId
    }));
    const vals = [];

    if(menuObj.dependantOn) {
        const obj = getMenuDetails({data: verticalData, menuId: menuObj.dependantOn});
        
        arr.push(getCheckboxObj({
            title: obj.name,
            id: 'd',
            values: getResourceNames(obj)
        }));

        vals.push({
            attributeId: 'd',
            values: values.dependantOn
        });
    }

    if(menuObj.partOf) {
        const obj = getMenuDetails({data: verticalData, menuId: menuObj.partOf});

        arr.push(getCheckboxObj({
            title: obj.name,
            id: 'p',
            values: getResourceNames(obj)
        }));

        vals.push({
            attributeId: 'p',
            values: values.partOf
        });
    }


    return [arr, vals];
}

export const getAddOnSegment = () => {
    return {
        "title": "Add Ons",
        "type": 'addOn',
        "repeat": 1,
        "attributes": [
            {
                "attributeId": 'name',
                "name": "Add On Name",
                "type": "TEXT",
                "maxLength": 50,
                "required": 1,
                "sectionWidthWeb": 20,
                "sectionWidthMobile": 20,
                "error": [false],
                "errorMsg": []
            },
            {
                "attributeId": 'maxQty',
                "name": "Max Quantity",
                "type": "INT",
                "required": 1,
                "sectionWidthWeb": 20,
                "sectionWidthMobile": 20,
                "min": 1,
                "max": 999,
                "spinner": 1,
                "error": [false],
                "errorMsg": []
            },
            {
                "attributeId": 'pricePerQty',
                "name": "Price per Quantity",
                "type": "INT",
                "required": 1,
                "sectionWidthWeb": 20,
                "sectionWidthMobile": 20,
                "min": 1,
                "max": 999,
                "spinner": 1,
                "error": [false],
                "errorMsg": []
            },
            {
                "attributeId": 'priceType',
                "name": "Price Type",
                "type": "DROPDOWN",
                "required": 1,
                "sectionWidthWeb": 20,
                "sectionWidthMobile": 20,
                "values": [{
                    name: 'PER_UNIT',
                    id: 'PER_UNIT'
                }, {
                    name: 'PER_BOOKING',
                    id: 'PER_BOOKING'
                }],
                "error": [false],
                "errorMsg": []
            }
        ]
    };
}

export const getGroupSegment = ({menuObj={}, data={}, selectedVertical, values, partOfGroup}) => {
    const verticalData = getVerticalObj(data, selectedVertical);
    const result = getMenuDetails({
        data: verticalData,
        validator: (obj) => {
            return obj.isGroup;
        }
    });

    if(!result) {
        return [null];
    }
    
    const attr = {
        "title": 'Group',
        "attributes": [{
            "attributeId": 'g',
            "type": "RADIO",
            "required": 1,
            values: result.data.map(r => ({
                name: r.resourceName,
                id: r.resourceId
            })),
            sectionWidthWeb: '100',
            sectionWidthMobile: '100'
        }]
    };

    const val = {
        attributeId: 'g',
        values: partOfGroup ? [partOfGroup] : []
    };

    return [attr, val];
}