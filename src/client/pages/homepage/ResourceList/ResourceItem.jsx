import React from 'react';
import styles from './resource-list.scss';

const ResourceItem = (props) => {
    return (
        <div className={styles['resource-item-container']}>
            <div 
                className={styles['resource-name']}
                onClick={() => props.onEdit(props.resource)}
            >
                {props.resource.resourceName}
            </div>
            <div className={styles['right-section']}>
                <div 
                    className={`${styles['resource-icon']} icon-edit`}
                    onClick={() => props.onEdit(props.resource)}
                />
                <div 
                    className={`${styles['resource-icon']} icon-trash`}
                    onClick={() => props.onDelete(props.resource)}
                />
            </div>
        </div>
    );
}

export default ResourceItem;