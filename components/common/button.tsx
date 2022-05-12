import React from 'react';

export type AppButtonProps = {
    type?: 'button' | 'reset' | 'submit';
    style?: 'filled' | 'outlined' | 'flat' | 'red';
    additionalStyle?: string;
    color?: string;
    size?: 'sm' | 'md' | 'lg'; // not in use now
    disabled?: boolean;
    name?: string;
    append?: JSX.Element;
    prepend?: JSX.Element;
    content?: string | React.Component;
    children?: string | JSX.Element;
    onClick?: () => unknown;
};

const AppButton: React.FC<AppButtonProps> = (props: AppButtonProps) => {
    const { type = 'button', style = 'filled', additionalStyle, disabled = false, prepend, append, name, content, children, onClick, color } = props;

    const getPrependIcon = () => {
        const wrapIcon = (icon: JSX.Element) => <span className={'flex items-center pl-2.5 text-xl'}>{icon}</span>;
        return prepend ? wrapIcon(prepend) : null;
    };

    const getAppendIcon = () => {
        const wrapIcon = (icon: JSX.Element) => <span className={'flex items-center pl-2.5 text-xl'}>{icon}</span>;
        return append ? wrapIcon(append) : null;
    };

    const renderContent = () => {
        if (children) {
            return children;
        }

        if (!prepend && !append && !content) {
            throw 'Content or icon is required to display AppButton.';
        }

        return (
            <>
                {getPrependIcon()}
                <span>{content}</span>
                {getAppendIcon()}
            </>
        );
    };

    const getButtonStyles = () => {
        const defaultStyles = 'w-full flex justify-center text-sm font-semibold rounded-xl py-2 px-3';
        let bgColor = '',
            textColor = '',
            outline = '',
            border = '';

        switch (style) {
            case 'filled':
                textColor = 'text-white';
                border = 'border border-transparent';
                if (disabled) {
                    bgColor = 'bg-gray';
                    outline = 'outline-none';
                } else {
                    bgColor = 'bg-primary hover:bg-primary-dark';
                    outline = 'focus:outline-primary-light';
                }
                break;
            case 'outlined':
                if (disabled) {
                    bgColor = 'bg-transparent';
                    textColor = 'text-gray-dark';
                    border = 'border border-gray-dark';
                    outline = 'outline-none';
                } else {
                    bgColor = 'bg-transparent hover:bg-primary-lighter focus:bg-primary-lighter';
                    textColor = 'text-primary';
                    border = 'border border-primary';
                    outline = 'focus:outline-primary-light';
                }
                break;
            case 'flat':
                bgColor = 'bg-transparent';
                outline = 'outline-none';
                border = 'border-none';
                if (disabled) {
                    textColor = 'text-gray';
                } else if (color == 'red') {
                    textColor = 'text-red';
                } else {
                    textColor = 'text-primary';
                }
                break;
            default:
                throw `Unknown button style: ${style}`;
        }

        return [defaultStyles, additionalStyle, bgColor, textColor, border, outline].join(' ');
    };

    return (
        <button className={getButtonStyles()} type={type} disabled={disabled} name={name} onClick={onClick}>
            {renderContent()}
        </button>
    );
};

export default AppButton;
