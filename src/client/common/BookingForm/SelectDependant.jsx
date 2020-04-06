import React, {useMemo} from 'react';
import Attribute from '../Attributes/Attribute';

const SelectDependant = props => {
    const dependants = useMemo(() => {
        return props.dependantIndexes.map(i => ({
            id: props.dependants[i].id,
            name: props.dependants[i].name
        }));
    }, []);
    const dependantName = props.dependants[props.dependantIndexes[0]]['dropDownName'];

    return (
        <Attribute
            attr={{
                name: `Select ${dependantName}`,
                type: 'DROPDOWN',
                attributeId: props.setIndex,
                values: dependants,
                value: props.value
            }}
            onChange={props.onChange}
        />
    );
}

export default SelectDependant;