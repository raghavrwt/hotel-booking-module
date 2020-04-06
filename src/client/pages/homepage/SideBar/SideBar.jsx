import React, { useState } from 'react';
import { connect } from 'react-redux';
import ListContainer from './ListContainer';
import styles from './side-bar.scss';
import RedirectionDialog from './RedirectionDialog';
import {
    getTreePath
} from '../../../common/menuFunctions';

const SideBar = (props) => {
    const [path, setPath] = useState(() => getTreePath(props.menu.data, props.menu.selectedMenu, props.menu.selectedVertical));

    return (
        <div className={styles['side-bar']}>
            <div className={styles['main-menu']}>
                <div className={`${styles['left-icon']} icon-pagination-left`}></div>
                Main Menu
            </div>
            <ListContainer 
                list={props.menu.data.map((vertical) => {
                    return {
                        ...vertical,
                        name: vertical['vertical_name'],
                        id: -1 * vertical['vertical_id'],
                        subMenu: vertical['menu']
                    }
                })}
                verticalList={true}
                className={styles['sidemenu-list']}
                path={path}
                setPath={setPath}
                parentId={props.parentId}
            />
            <RedirectionDialog />
        </div>
    );
}

const mapStateToProps = (state, props) => ({
	...props,
    menu: state.menu
});

export default connect(mapStateToProps, null)(SideBar);