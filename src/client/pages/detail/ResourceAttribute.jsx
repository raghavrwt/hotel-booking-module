import React from 'react';
import Iframe from './Iframe';
import styles from './resource-attribute.scss';

const ResourceAttribute = props => {
    const getValueHtml = () => {
        if(props.values.length > 1) {
            return (
                <div className={styles['value-list']}>
                    {props.values.map(val => (
                        <div
                            className={styles['value-list-item']}
                            key={val}
                        >{val}</div>
                    ))}
                </div>
            );
        } else if(props.name === 'Description') {   //TODO - modify check
            return (
                <Iframe 
                    id='resourceDescription'
                    html={props.values[0]}
                />
            );
        }

        return props.values[0];
    }


    return (
        <div className={styles['resource-attribute']}>
            <div className={styles['attribute-name']}>
                {props.name}
            </div>
            <div className={styles['attribute-values']}>
                {getValueHtml()}
            </div>
        </div>
    )
}

export default ResourceAttribute;