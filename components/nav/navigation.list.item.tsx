import React from "react";
import { UrlObject } from "url";
import Link from 'next/link';

type Url = string | UrlObject;
type NavigationListItemProps = {
    prepend?: React.ReactElement;
    append?: React.ReactElement;
    label: string;
    style?: 'PRIMARY' | 'BLACK';
    disabled?: boolean;
    href?: Url;
    additionalStyle?: string;
    onClick?: () => unknown;
};

const NavigationListItem: React.FC<NavigationListItemProps> = props => {
    const  { label, prepend, append, style = 'BLACK', disabled = false, href, additionalStyle, onClick } = props;

    if (!!href && !!onClick) {
        throw 'List item require link or onClick, but not both!';
    }

    const wrap = (component: React.ReactElement): React.ReactElement => {
        if (href) {
            return <Link href={href}>{component}</Link>;
        }

        return <>{component}</>;
    };

    const getContainerStyle = () => {
        const defaultStyles = 'w-full flex items-center font-medium py-2';
        let color = '';

        if (disabled) {
            color = 'text-gray';
        } else if (style == 'BLACK') {
            color = 'text-gray-black cursor-pointer';
        } else {
            color = 'text-primary cursor-pointer';
        }

        return [defaultStyles, color, additionalStyle].join(' ');
    };

    const getLabelStyle = () => {
        const defaultStyles = 'text-2xl';
        let padding = '';
        if (prepend) {
            padding = 'pl-2.5';
        }

        return [defaultStyles, padding].join(' ');
    };

    const getPrepend = () => {
        if (!prepend) {
            return <></>;
        }
        return <span className={'text-2xl'}>{prepend}</span>;
    };

    const getAppend = () => {
        if (!append) {
            return <></>;
        }

        return <span className={'text-2xl'}>{append}</span>;
    };

    return wrap(
        <div className={getContainerStyle()} onClick={onClick}>
            <div className={'flex items-center'}>
                {getPrepend()}
                <span className={getLabelStyle()}>{label}</span>
                <div>{getAppend()}</div>
            </div>
        </div>
    );
};

export default NavigationListItem;
