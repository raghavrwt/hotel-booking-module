import React, { useRef, useState } from 'react';
import Input from './Input';
import DatePicker from 'react-datepicker';
import styles from './date-input.scss';
import { format, parse } from 'date-fns';


const formatObj = {
    'TIME': 'HH:mm',
    'DATE': 'yyyy-MM-dd',
    'DATETIME': 'yyyy-MM-dd HH:mm'
}

const showFormat = {
    'TIME': 'hh:mm aa',
    'DATE': 'dd/MM/yyyy',
    'DATETIME': 'dd/MM/yyyy hh:mm aa'
}

const getInitialValue = (value, type) => {
    if (!value) {
        return null;
    }

    return parse(value, formatObj[type], new Date());
}

const CustomInput = ({ value, onClick }) => {
    return (
        <Input
            value={[value]}
            onClick={onClick}
        />
    );
};

const DateInput = props => {
    const [selected, setSelected] = useState(() => getInitialValue(props.value[0], props.type));

    const dateFormat = showFormat[props.type];

    const onChange = date => {
        const formatted = format(date, formatObj[props.type]);

        setSelected(date);

        props.onChange(props.attributeId, [formatted]);
    }

    return (
        <DatePicker
            dateFormat={dateFormat}
            selected={selected}
            onChange={onChange}
            customInput={<CustomInput />}
            showTimeSelect={props.type == 'TIME' || props.type == 'DATETIME'}
            showTimeSelectOnly={props.type == 'TIME'}
            timeIntervals={props.interval}
            calendarClassName={styles['custom-calendar']}
            minDate={props.min}
            maxDate={props.max}
        />
    );
}

DateInput.defaultProps = {
    interval: 60,
    min: null,
    max: null
};

export default DateInput;