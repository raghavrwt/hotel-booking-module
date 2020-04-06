import types from './types';
import axios from 'axios';
import {
    fetchMenu,
    fetchPageData
} from '../common/requests';
import {
    getVerticalObj,
    getMenuDetails,
    validateMenu
} from '../common/menuFunctions';


const getMenuData = async ({ menuObj, menuData, verticalId, skipCheck = false }) => {
    if (!skipCheck) {
        const verticalObj = getVerticalObj(menuData, verticalId);
        const {
            valid,
            redirectMenu
        } = validateMenu(menuObj, verticalObj);

        if (!valid) {
            return {
                success: false,
                redirectMenu
            };
        }
    }

    if (menuObj.allowMultiple) {
        return {
            success: true,
            payload: {
                menuData,
                selectedMenu: menuObj,
                selectedVertical: verticalId,
                pageData: {
                    view: 'RESOURCELIST'
                }
            }
        };
    }

    const {
        isSuccess,
        ...pageData
    } = await fetchPageData({ menuId: menuObj.id, pageType: menuObj.type });

    return {
        success: true,
        payload: {
            menuData,
            selectedMenu: menuObj,
            selectedVertical: verticalId,
            pageData: {
                data: pageData,
                view: menuObj.type
            }
        }
    };
}

export function initializeMenu() {
    return async dispatch => {
        const {
            isSuccess,
            menuData
        } = await fetchMenu();

        if (!isSuccess) {
            return;
        }

        // menuData
        const verticalObj = menuData[0];    //picking first vertical
        const menuObj = getMenuDetails({
            data: {
                subMenu: verticalObj.menu
            },
            menuId: null
        });

        const {
            success,
            redirectMenu,
            payload,
        } = await getMenuData({
            menuObj,
            menuData,
            verticalId: verticalObj['vertical_id'],
            skipCheck: true
        });

        if(!success) {
            return;
        }

        dispatch({
            type: types.INITIALIZE_MENU,
            payload: {
                data: menuData,
                ...payload
            }
        });
    }
}

export const deleteResource = (resourceId) => {
    return async dispatch => {
        axios.post('/omni_bookings/vendor/delete.ns', { id: resourceId }).then(({ status, data }) => {
            if (status !== 200 || !data.isSuccess) {
                return;
            }

            dispatch({
                type: types.DELETE_RESOURCE,
                payload: { resourceId }
            });
        });
    }
}

export function setMenu({ menuObj, verticalId, cb, skipCheck = false }) {
    return async (dispatch, getStore) => {
        dispatch({
            type: types.SET_LOADING,
            payload: true
        });

        const {
            success,
            redirectMenu,
            payload
        } = await getMenuData({ 
            menuObj, 
            menuData: getStore().menu.data,
            verticalId, 
            skipCheck 
        });

        if(!success) {
            if(redirectMenu) {
                cb(redirectMenu);
            }
            return;
        }

        dispatch({
            type: types.SET_MENU,
            payload
        });
        cb && cb(null);
    }
}

export function setMenu1({ menuObj, menuData, verticalId, cb, skipCheck = false }) {
    return async (dispatch, getStore) => {
        if (!skipCheck) {
            const verticalObj = getVerticalObj(menuData, verticalId);
            const {
                valid,
                redirectMenu
            } = validateMenu(menuObj, verticalObj);

            if (!valid) {
                return cb && cb(redirectMenu);
            }
        }

        if (menuObj.allowMultiple) {
            dispatch({
                type: types.SET_MENU,
                payload: {
                    menuData,
                    selectedMenu: menuObj,
                    selectedVertical: verticalId,
                    pageData: {
                        view: 'RESOURCELIST'
                    }
                }
            });
            return cb && cb(null);
        }

        dispatch({
            type: types.SET_LOADING,
            payload: true
        })

        const {
            isSuccess,
            ...pageData
        } = await fetchPageData({ menuId: menuObj.id, pageType: menuObj.type });

        dispatch({
            type: types.SET_MENU,
            payload: {
                menuData,
                selectedMenu: menuObj,
                selectedVertical: verticalId,
                pageData: {
                    data: pageData,
                    view: menuObj.type
                }
            }
        });
        cb && cb(null);
    }
}


export const showHideRedirectionDialog = (payload) => {
    return {
        type: types.SHOW_HIDE_REDIRECTION_DIALOG,
        payload
    }
}