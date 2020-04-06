import React from 'react';
import { connect } from 'react-redux';
import styles from './menu-item.scss';
import ListContainer from './ListContainer';
import {
    setMenu,
    showHideRedirectionDialog
} from '../../../actions/menu';

const MenuItem = ({
    item,
    onClick,
    setMenu,
    verticalId,
    selectedMenu,
    path,
    setPath,
    showHideRedirectionDialog
}) => {

    const onSubItemClick = (e, item) => {
        e.stopPropagation();
        if (item.subMenu) {
            return;
        }

        setMenu({
            menuObj: item,
            verticalId,
            cb: (redirectMenu) => {
                if (!redirectMenu) {
                    return;
                }

                showHideRedirectionDialog({
                    show: true,
                    content: `Please add ${redirectMenu.name}`,
                    btnContent: 'Ok',
                    redirectMenu
                });
            }
        });
    }

    const isOpen = path.includes(item.id);

    return (
        <div
            className={`${styles['menu-item']} ${selectedMenu && selectedMenu.id === item.id ? styles['selected'] : ''} ${isOpen ? styles['show-list'] : ''}`}
            onClick={e => onClick(e, item)}
        >
            <div className={styles['menu-name']}>
                {item.name}
                {item.subMenu &&
                    <div className={`${styles['name-arrow']} icon-pagination-down`}></div>
                }
            </div>
            {item.subMenu ? (
                <ListContainer
                    list={item.subMenu}
                    onItemClick={onSubItemClick}
                    className={`${styles['sub-menu-container']}`}
                    verticalId={verticalId}
                    path={path}
                    setPath={setPath}
                    parentId={item.id}
                />
            ) : null}
        </div>
    );
};

const mapStateToProps = (state, props) => ({
    ...props,
    selectedMenu: state.menu.selectedMenu
})

export default connect(mapStateToProps, {
    setMenu,
    showHideRedirectionDialog
})(MenuItem);