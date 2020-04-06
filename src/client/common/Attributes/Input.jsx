import React from 'react';
import { Form } from 'jd-library';
import styles from './input.scss';

const Input = ({
    spinner = false,
    leftSection = null,
    rightSection = null,
    className = '',
    editor = false,
    attributeId,
    allowCustomAttributes = 0,
    values,
    containerClass = '',
    ...props
}) => {

    const onSpinnerClick = (type='up') => {
        handleChange(type == 'up' ? Number(props.value) + 1 : Number(props.value) - 1);
    }

    let containerClassName = `${styles['input-container']} ${containerClass}`;

    if (leftSection) {
        containerClassName += ` ${styles['has-left-section']}`;
    }

    if (rightSection) {
        containerClassName += ` ${styles['has-right-section']}`;
    }

    let inputType = props.type;
    if (props.type == 'INT' || props.type == 'FLOAT') {
        inputType = 'number';
    }

    const onKeyPress = (e) => {
        if (props.type == 'INT' && (event.which < 48 || event.which > 57)) {
            e.preventDefault();
            e.stopPropagation();
        }

        props.onKeyPress && props.onKeyPress(e);
    }

    const handleChange = (value) => {
        if(value && (typeof props.min !=='undefined' && value < props.min || typeof props.max !=='undefined' && value > props.max)) {
            return;
        }

        props.onChange && props.onChange(attributeId, [value]);
    }

    return (
        <div className={containerClassName}>
            {leftSection ? (
                <div className={`${styles['left-section']} ${styles['side-section']}`}>{leftSection}</div>
            ) : null}
            <div className={styles['input-spinner-container']}>
                <Form.Control 
                    {...props}
                    className={`${className} ${styles['input']}`}
                    type={inputType}
                    onChange={e => handleChange(e.target.value)}
                    value={props.value[0]}
                    onKeyPress={onKeyPress}
                />
                {spinner ? (
                    <div className={styles['spinners']}>
                        <span 
                            className={`icon-pagination-down ${styles['spinner']} ${styles['up-arrow']}`} 
                            onClick={() => onSpinnerClick('up')}
                        />
                        <span 
                            className={`icon-pagination-down ${styles['spinner']} ${styles['down-arrow']}`}
                            onClick={() => onSpinnerClick('down')}
                        />
                    </div>
                ) : null}
            </div>
            {rightSection ? (
                <div className={`${styles['right-section']} ${styles['side-section']}`}>{rightSection}</div>
            ) : null}
        </div>
    );
}

Input.defaultProps = {
    value: ''
}

export default Input;