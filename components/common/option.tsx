import {ChangeHandler, FieldError} from "react-hook-form";
import React, {createRef, forwardRef, MouseEventHandler, useEffect, useState} from "react";
import { HiOutlineExclamationCircle} from "react-icons/all";

export interface AppOptionProps {
    id?: string;
    name: string;
    label?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: ChangeHandler;
    onFocus?: ChangeHandler;
    onKeyDown?: ChangeHandler;
    className?: string;
    optionClassName?: string;
    labelClassName?: string;
    list: string[] | number[];
    helpText?: string;
    multiple?: boolean;
    size?: number;
    prepend?: JSX.Element;
    prependClick?: MouseEventHandler;
    append?: JSX.Element;
    appendClick?: MouseEventHandler;
    clear?: boolean;
    readOnly?: boolean;
    error?: FieldError;
}

const AppOption: React.FC<AppOptionProps> = forwardRef<HTMLSelectElement, AppOptionProps>((props, ref) => {
    const {
        id,
        name,
        label = '',
        append,
        appendClick,
        clear = false,
        disabled = false,
        optionClassName = '',
        labelClassName = '',
        list = [],
        multiple = false,
        autoFocus = false,
        onChange,
        onBlur,
        onFocus,
        onKeyDown,
        className = '',
        size = 5,
        helpText,
        prepend,
        prependClick,
        required = false,
        readOnly = false,
        error,
    } = props;
    const containerRef = createRef<HTMLDivElement>();
    const [isNotEmpty, setIsNotEmpty] = useState<boolean>(false);
    const [value, setValue] = useState<string | number | string[]>();

    useEffect(() => {
        updateIsNotEmpty();
    }, [ref]);

    const updateIsNotEmpty = () => {
        if (containerRef.current) {
            const {current} = containerRef;
            const inputElement = current?.children?.namedItem(name);
            let component: HTMLSelectElement | null = null;
            if (inputElement && (component = inputElement as HTMLSelectElement) != null) {
                setIsNotEmpty(typeof component.value != 'undefined' && component.value.length !=0);
            }
        }
    };

    const getLabelStyle = () => {
        const _defaultStyle = 'text-sm text-gray-darker-1 block mb-2';
        return [_defaultStyle, labelClassName ?? ''].join(' ');
    };

    const getInputStyle = () => {
        const defaultStyles = 'rounded-lg block w-full px-5 py-2.5 border text-base';
        let border = '',
            placeholder = '',
            outline = '',
            text = '',
            background = '',
            paddings = '';

        if (readOnly) {
            border = 'border-gray';
            placeholder = 'placeholder:text-gray-darker';
            outline = 'outline-none';
            text = 'text-gray-darker';
            background = 'bg-gray-light';
        } else {
            border = 'border-gray focus:border-primary-dark';
            placeholder = 'placeholder:text-gray-dark';
            outline = 'outline-primary-light';
            text = 'text-gray-darker text-gray-darker-1';
            background = 'bg-gray-light';
        }

        paddings += error || clear || append ? ' pr-9' : ' pr-5';
        paddings += prepend ? ' pl-9' : ' pl-5';

        return [defaultStyles, border, placeholder, outline, text, background, paddings].join(' ');
    };

    const getPrependIcon = () => {
        const pointerStyle = prependClick ? 'cursor-pointer' : '';
        const wrapIcon = (icon: JSX.Element, additionalStyle: string) => (
            <span onClick={e => prependClick && prependClick(e)} className={`absolute left-0 inset-y-0 flex items-center px-4 text-xl ${pointerStyle} ${additionalStyle}`}>
				{icon}
			</span>
        );
        return prepend ? wrapIcon(prepend, '') : null;
    };

    const getAppendIcon = () => {
        const pointerStyle = appendClick ? 'cursor-pointer' : '';
        const wrapIcon = (icon: JSX.Element, additionalStyle: string) => (
            <span onClick={e => appendClick && appendClick(e)} className={`absolute right-0 inset-y-0 flex items-center px-4 text-xl ${pointerStyle} ${additionalStyle}`}>
				{icon}
			</span>
        );

        return error && error.type ? wrapIcon(<HiOutlineExclamationCircle />, 'text-red') : append != null ? wrapIcon(append, '') : null;
    };

    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className={getLabelStyle()}>
                    {label}
                </label>
            )}
            <div className={`relative ${label ? 'mt-2' : ''}`} ref={containerRef}>
                {getPrependIcon()}
                {getAppendIcon()}
            </div>
            <select
                disabled={disabled}
                required={required}
                size={size}
                id={id ?? name}
                multiple={multiple}
                className={getInputStyle()}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                ref={ref}
                defaultValue={value}
            >
                {list.map((item, index) => (
                    <option
                        key={`${name}-${index}`}
                        tabIndex={index+1}
                        className={getInputStyle()}
                        value={item}
                    >{item}</option>
                ))}
            </select>
            <div>{helpText && <span className={'block mt-2 text-sm text-gray-darker'}>{helpText}</span>}</div>
            <div>{error && error.type && <span className={'block mt-2 text-sm text-red'}>{error.message}</span>}</div>
        </div>
    );
});

export default AppOption;
