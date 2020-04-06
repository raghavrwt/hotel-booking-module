import React from 'react';
import {useHistory} from 'react-router-dom';
import Image from './Image';
import ResourceDetails from '../ResourceDetails';
import styles from '../detail.scss';

const LeftSection = props => {
    const history = useHistory();

    return (
        <div className={`${props.className}`}>
            <div className={styles['resource-header']}>
                <span 
                    onClick={() => history.goBack()}
                    className={`${styles['header-back']} icon-key-left`} 
                />
                <div className={styles['resource-name']}>
                    {props.data.name}
                </div>
            </div>
            <Image 
                images={props.data.image}
            />
            {props.data.details.length > 1 && (
                <>
                    <div className={styles['section-header']}>Details</div>
                    <ResourceDetails 
                        details={props.data.details}
                    />
                </>    
            )}
        </div>
    );
}

LeftSection.defaultProps = {
    className: ''
}

export default LeftSection;