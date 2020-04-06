const commonKeys = {
    maxLength: 50,
    required: 1,
    value: ['']
}

export const formatFormAttr = (attr = {}, index) => {
    let obj;

    switch (attr.type) {
        case 'LOCATION':
        case 'DROPDOWN': {
            const values = attr.data.map(item => ({
                id: item.value,
                name: item.value
            }));
            obj = {
                name: attr.name,
                attributeId: index,
                values,
                type: 'DROPDOWN',
                value: [values[0].id]
            }
        }
            break;
        case 'INT':
            obj = {
                name: attr.name,
                attributeId: index,
                placeholder: attr.name,
                type: attr.type,
                value: [attr.data.value],
                spinner: true,
                min: 0,
                readOnly: true
            };
            break;
        case 'DATE':
            obj = {
                name: attr.name,
                type: attr.type,
                attributeId: index,
                name: attr.name,
                value: [attr.data.value],
                min: new Date()
            };
            break;
    }

    return obj ? {
        ...commonKeys,
        ...obj
    } : null;
}

export const getResourceData = (resourceList) => {
    let resources = [];
    let dependants = [];

    resourceList.forEach(r => {
        if (r.dependantOn.length) {
            dependants.push(r);
        } else {
            resources.push(r);
        }
    });

    resources = resources.map(r => {
        const resourceId = r.id;

        const dependantIndexes = dependants.reduce((list, d, index) => {
            if (d.dependantOn.includes(resourceId)) {
                return list.concat(index);
            }

            return list;
        }, []);

        return {
            ...r,
            dependantIndexes
        };
    });

    return {
        resources,
        dependants
    };
}