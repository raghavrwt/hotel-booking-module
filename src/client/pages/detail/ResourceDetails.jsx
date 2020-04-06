import React from 'react';
import ResourceAttribute from './ResourceAttribute';
import styles from './detail.scss';

const ResourceDetails = props => {
    const list = props.details.map(data => {
        return (
            <ResourceAttribute 
                key={data.id}
                {...data}
            />
        )
    });

    return (
        <div className={styles['resource-details']}>
            {list}
        </div>
    );
}

export default ResourceDetails;