import React from 'react';
import styles from './page-header.scss';
import {Form, Button} from 'jd-library';

const PageHeader = props => {
    return (
        <div className={styles['page-header']}>
            {props.showBackBtn && (
                <div 
                    className={styles['back-btn-container']}
                    onClick={props.onBackBtnClick}
                >
                    <span className={`${styles['back-btn']} icon-key-left`}></span>
                </div>
            )}
            <div className={`${styles['page-title']} ${props.textClass}`}>
                {props.title}
            </div>
            {props.showSearch ? (
                <Form.Control 
                    {...props.searchInput}
                    className={`${styles['search-bar']}${props.searchInput.className ? ' ' + props.searchInput.className : ''}`}
                />
            ) : null}
            {props.buttons.map(({className, ...button}, index) => (
                <Button 
                    {...button}
                    className={`${className} ${styles['header-button']}`}
                    key={index}
                    size='lg'
                />
            ))}
        </div>
    );
}

PageHeader.defaultProps = {
    showBackBtn: false,
    showSearch: false,
    title: '',
    buttons: [],
    searchInput: {},
    textClass: ''
}

export default PageHeader;