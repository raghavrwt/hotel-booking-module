import React, {useState, useCallback} from 'react';
import { connect } from 'react-redux';
import ResourceItem from './ResourceItem';
import styles from './resource-list.scss';
import {setResourceData} from '../../../actions/page';
import PageHeader from '../PageHeader';
import {
    deleteResource
} from '../../../actions/menu';

const ResourceList = props => {
    const [search, setSearch] = useState('');
    const [showLoader, toggleLoader] = useState(false);
    const selectedMenu = props.selectedMenu;

    const onEdit = (item) => {
        props.setResourceData(selectedMenu.id, item.resourceId);
    }
    
    const onDelete = (item) => {
        props.deleteResource(item.resourceId);
    }
    
    const onCreateNew = useCallback(() => {
        toggleLoader(true);
        props.setResourceData(selectedMenu.id, null)
    }, [selectedMenu]);

    return (
        <div className={styles['resource-list']}>
            <PageHeader 
                title={selectedMenu.title}
                showSearch={true}
                searchInput={{
                    placeHolder: `Search ${selectedMenu.name}`,
                    value: search,
                    onChange: e => setSearch(e.target.value)
                }}
                buttons={[{
                    children: '+ Create New',
                    showLoader,
                    clickHandler: onCreateNew,
                    className: styles['create-btn']
                }]}
            />
            {selectedMenu.data ? (
                <div className={styles['list-body']}>
                    {selectedMenu.data.filter(resource => {
                        return resource.resourceName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
                    }).map(resource => {
                        return (
                            <ResourceItem 
                                key={resource.resourceId}
                                resource={resource}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

const mapStateToProps = (state, props) => ({
    ...props,
    selectedMenu: state.menu.selectedMenu
});

export default connect(mapStateToProps, {
    setResourceData,
    deleteResource
})(ResourceList);