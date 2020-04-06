import React from 'react';
import styles from './segment.scss';
import commonStyles from '../../../common/common.scss';
import Attribute from '../../../common/Attributes/Attribute';
import SegmentWrapper from './SegmentWrapper';
import {getDefaultValue} from '../../../common/formFunctions';

const Segment = ({
    segment: {
        title,
        sub_title,
        attributes=[],
        repeat
    }, 
    values, 
    onChange
}) => {
    let groupCount = 1;

    if(repeat && attributes.length) {
        const firstAttr = values[attributes[0].attributeId];
        groupCount = firstAttr.value.length + 1;
    }

    let groupList = [];

    const handleChange = (attrId, value, otherAttrs, groupId) => {
        if(!repeat) {
            return onChange(attrId, value, otherAttrs);
        }

        const arr = [...values[attrId].value];
        if(typeof arr[groupId] !== 'undefined') {
            arr[groupId] = value[0];
            onChange(attrId, arr, otherAttrs);
        } else {
            //initialize all attr in the group
            attributes.forEach((attr) => {
                let val = values[attr.attributeId].value;
                val = val.concat(attr.attributeId === attrId ? value : getDefaultValue(attr));
                onChange(attr.attributeId, val, otherAttrs);
            });
        }
    }

    const handleDelete = (groupId) => {
        attributes.forEach((attr) => {
            let val = [...values[attr.attributeId].value];
            val.splice(groupId, 1);
            onChange(attr.attributeId, val);
        });
    }

    for(let i=0;i<groupCount;i++) {
        const body = attributes.map(({attributeId}, index) => {
            const attr = values[attributeId];
            const val = attr.value;
            // let list = attr.values;

            // if(repeat && list) {
            //     list = attr.values.filter(item => {
            //         return item.id == val[i] || val.indexOf(item.id) == -1;
            //     });
            // }

            return (
                <Attribute
                    key={index}
                    attr={{
                        ...attr,
                        // values: list,
                        value: repeat ? [val[i]] : val,
                        error: attr.error[i],
                        errorMsg: attr.errorMsg[i]
                    }}
                    onChange={(attrId, value, otherAttrs) => handleChange(attrId, value, otherAttrs, i)}
                />
            );
        });

        groupList.push(repeat ? (
            <div 
                className={styles['group-section']}
                key={i}
            >
                {body}
                {i < groupCount-1 ? (
                    <div 
                        className={`${commonStyles['close-icon']} icon-closeLight ${styles['group-delete']}`}
                        onClick={() => handleDelete(i)}
                    />
                ) : null}
            </div>
        ) : body);
    }

    return (
        <SegmentWrapper
            title={title}
            sub_title={sub_title}
        >
            {groupList}
        </SegmentWrapper>
    )
}

export default Segment;