export const getMenuDetails = ({data={}, menuId, validator}) => {
    if(validator && validator(data)) {
        return data;
    }

    if(typeof menuId !== 'undefined' && (data.id === menuId || menuId === null && !data.subMenu)) { 
        return data;
    }

    if(data.subMenu) {
        const subMenu = data.subMenu;
        const len = subMenu.length;

        for(let i=0;i<len;i++) {
            const itemData = getMenuDetails({data: subMenu[i], menuId, validator});
            if(itemData) {
                return itemData;
            }
        }
    }

    return null;
}

export const getParent = (data={}, menuId) => {
    if(data.id === menuId || menuId === null && !data.subMenu) { 
        return data;
    }

    if(data.subMenu) {
        const subMenu = data.subMenu;
        const len = subMenu.length;

        for(let i=0;i<len;i++) {
            const itemData = getParent(subMenu[i], menuId);
            if(itemData) {
                return {
                    parent: data.subMenu,
                    index: i
                };
            }
        }
    }

    return null;
}

const checkParent = (data, parentId) => {
    const parent = getMenuDetails({data, menuId: parentId});

    if(parent && (!parent.data || !parent.data.length)) {
        const {
            valid, 
            redirectMenu
        } = validateMenu(parent, data);
        
        return {
            valid: false,
            redirectMenu: valid ? parent : redirectMenu
        };
    }

    return {valid: true};
}

export const validateMenu = (menu, data) => {
    let obj = {valid: true};

    if(menu.dependantOn) {
        obj = checkParent(data, menu.dependantOn);
    }

    if(obj.valid && menu.partOf) {
        obj = checkParent(data, menu.partOf);
    }

    return obj;
}

export const getVerticalObj = (data=[], verticalId) => {
    const len = data.length;

    for(let i=0;i<len;i++) {
        if(data[i]['vertical_id'] == verticalId) {
            return {
                subMenu: data[i].menu
            };
        }
    }

    return null;
}

const parseTree = (data, menuId, arr) => {
    if(data.id === menuId || menuId === null && !data.subMenu) { 
        return [data.id];
    }

    if(data.subMenu) {
        const subMenu = data.subMenu;
        const len = subMenu.length;

        for(let i=0;i<len;i++) {
            const itemData = parseTree(subMenu[i], menuId, arr);
            if(itemData) {
                return arr.concat([data.id], itemData);
            }
        }
    }

    return [];
}


export const getTreePath = (data, selectedMenu, verticalId) => {
    if(!selectedMenu) {
        return [];
    }

    const verticalObj = {
        id: -1*verticalId,
        ...getVerticalObj(data, verticalId)
    };

    return parseTree(verticalObj, selectedMenu.id, []);
}