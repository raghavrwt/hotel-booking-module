import React, {useState} from 'react';
import SegmentWrapper from './SegmentWrapper';
import {Button} from 'jd-library';
import Attribute from '../../../common/Attributes/Attribute';
import styles from './add-on.scss';
import commonStyles from '../../../common/common.scss';
import {getAddOnSegment} from '../../../common/formFunctions';

const segment = getAddOnSegment();

const addOnObj = {
    addonId: null,
    name: {
        value: [''],
        error: [false],
        errorMsg: []
    },
    maxQty: {
        value: [''],
        error: [false],
        errorMsg: []
    },
    pricePerQty: {
        value: [''],
        error: [false],
        errorMsg: []
    },
    priceType: {
        value: ['PER_UNIT'],
        error: [false],
        errorMsg: []
    }
};

const AddOn = (props) => {

    const onAttrChange = (attrId, value, addOnIndex) => {
        const addOns = [...props.addOns];
        addOns[addOnIndex][attrId] = {
            value,
            error: [false]
        };
        props.setAddOn(addOns);
    }

    const onAttrDel = (addOnIndex) => {
        const addOns = [...props.addOns];
        addOns.splice(addOnIndex, 1);
        props.setAddOn(addOns);
    }

    const list = props.addOns.map((addOn, index) => {
        return (
            <div 
                className={styles['input-container']}
                key={index}
            >
                {segment.attributes.map(attr => {
                    const obj = {
                        ...attr,
                        ...addOn[attr.attributeId]
                    };
                    obj.error = obj.error[0];
                    obj.errorMsg = obj.errorMsg[0];
                    
                    return (
                        <Attribute 
                            key={attr.attributeId}
                            attr={obj}
                            className={styles['addon-attr']}
                            onChange={(attrId, value) => onAttrChange(attrId, value, index)}
                        />
                    );
                })}
                <div 
                    className={`${commonStyles['close-icon']} icon-closeLight`}
                    onClick={() => onAttrDel(index)}
                />
            </div>
        );
    });

    return (
        <SegmentWrapper
            title='Add Ons'
        >
            <div className={styles['addon-container']}>
                <Button
                    className={styles['addon-button']}
                    clickHandler={() => {
                        props.setAddOn(props.addOns.concat({...addOnObj}))
                    }}
                >
                    Add
                </Button>
                {list}
            </div>
        </SegmentWrapper>
    );
}

export default AddOn;