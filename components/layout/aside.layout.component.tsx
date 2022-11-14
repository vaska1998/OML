import React from 'react';
import MenuLayoutComponent from "./menu.layout.component";

const AsideLayoutComponent: React.FunctionComponent = () => {
    return (
        <aside className={'w-full min-h-aside max-h-aside overscroll-y-auto overflow-y-auto sticky top-0 bg-primary-hover'}>
            <MenuLayoutComponent/>
        </aside>
    );
};

export default AsideLayoutComponent;
