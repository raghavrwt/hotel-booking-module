import React, {useState} from 'react';
import axios from 'axios';
import styles from './checkbox.scss';
import commonStyles from '../common.scss';
import {Form, Button} from 'jd-library';

const saveAttr = data => {
    return axios.post('/omni_bookings/vendor/addCustomAttribute.ns', data).then(response => {
        if(response.status !== 200) {
            return {
                isSuccess: false
            }
        };

        return response.data;
    });
};

const CheckBox = props => {

    const [val, setVal] = useState('');

    const handleChange = e => {
        setVal(e.target.value);
    }

    const onChange = (item, checked) => {
        let value = [...props.value];

        if(checked) {
            value.push(item);
        } else {
            const index = value.indexOf(item);
            if(index !== -1) {
                value.splice(index, 1);
            }
        }

        props.onChange(props.attributeId, value);
    }

    const onAdd = async () => {
        const values = [...props.values];
        const value = [...props.value];

        const response = await saveAttr({
            attributeId: props.attributeId,
            attributeValue: val
        });

        if(!response.isSuccess) {
            return;
        }

        values.push({
            id: val,
            name: val
        });

        value.push(val);

        setVal('');

        props.onChange(props.attributeId, value, {values});
    }

    const listHtml = props.values.map(item => {
        return (
            <div 
                key={item.id}
                className={styles['checkbox']}
            >
                <Form.Check 
                    label={item.name}
                    checked={props.value.includes(item.id)}
                    type='circle'
                    onChange={e => onChange(item.id, e.target.checked)}

                />
            </div>
        );
    });

    if(props.allowCustomAttributes) {
        listHtml.push(
            <div 
                className={`${styles['custom-input-container']} ${val.length ? styles['has-value'] : styles['no-value']}`}
                key='custom'
            >
                <Form.Control
                    placeholder='add custom'
                    value={val}
                    onChange={handleChange}
                    className={styles['custom-input']}
                />
                <div 
                    className={`${styles['add-button']} icon-Checkmark`}
                    onClick={onAdd}
                />
                <span 
                    className={`${commonStyles['close-icon']} icon-closeLight`} 
                    onClick={() => setVal('')}
                />
            </div>
        );
    }


    return (
        <div className={styles['checkbox-list']}>
            {listHtml}
        </div>
    );
}

CheckBox.defaultProps = {
    values: [],
    addCustom: false,
    value: []
}

export default CheckBox;