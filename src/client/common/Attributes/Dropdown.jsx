import React from 'react';
import styles from './dropdown.scss';

const Dropdown = props => {
    return (
        <div className={`${styles['dropdown-wrapper']} ${props.className}`}>
            <select
                className={styles['dropdown-input']}
                value={props.value[0] ? props.value[0] : (props.defaultTag || '')}
                onChange={e => props.onChange(props.attributeId, [e.target.value])}
            >
                {props.defaultTag ? (
                    <option
                        value={props.defaultTag}
                        disabled
                    >
                        {props.defaultTag}
                    </option>
                ) : null}
                {props.values.map(item => (
                    <option
                        key={item.id}
                        className={styles['dropdown-item']}
                        value={item.id}
                    >
                        {item.name}
                    </option>
                ))}
            </select>
            <div
                className={`icon-pagination-down ${styles['dropdown-arrow']}`}
            />
        </div>
    )
}

Dropdown.defaultProps = {
    values: [],
    value: '',
    className: ''
}

export default Dropdown;