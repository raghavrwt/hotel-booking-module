import React from 'react';
import {Form} from 'jd-library';
import styles from './radio.scss';

const Radio = props => {
    const handleChange = val => {
        props.onChange(props.attributeId, [val]);
    }

    const valueList = props.values.map(val => (
        <Form.Radio 
            className={styles['radio-item']}
            name='radiobtn' 
            label={val.name}
            key={val.id}
            checked={val.id === props.value[0]}
            onChange={() => handleChange(val.id)}
        />
    ));

    return (
        <div className={styles['radio-list']}>
            {valueList}
        </div>
    );
}

export default Radio;