import React, {memo} from 'react';
import styles from './addons.scss';
import formStyles from './booking-form.scss';
import Input from '../../common/Attributes/Input';
import {Form} from 'jd-library';

const AddOns = props => {
    const addonValues = props.addonValues;
    const listHtml = props.addons.map((addon, index) => {
        return (
            <div 
                className={styles['addon']}
                key={addon.id}
            >
                <div className={styles['addon-name']}>
                    {addon.name.toLowerCase()}
                </div>
                <Input 
                    attributeId={index}
                    value={[addonValues[index]]}
                    type='INT'
                    className={styles['addon-qty']}
                    onChange={props.onChange}
                    spinner={true}
                    readOnly={true}
                    min={0}
                />
            </div>
        );
    });

    return (
        <div className={`${styles['addons-container']} ${formStyles['separator']}`}>
            <Form.Label
                className={styles['addon-label']}
            >Add Addon</Form.Label>
            <div className={styles['addon-list']}>
                {listHtml}
            </div>
        </div>
    )
}

export default memo(AddOns);