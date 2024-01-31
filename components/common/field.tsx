import React, {createRef, forwardRef, MouseEventHandler, useEffect, useState} from "react";
import {ChangeHandler, FieldError} from "react-hook-form";
import {HiCheckCircle, HiClipboard, HiOutlineExclamationCircle} from "react-icons/all";

export type AppFieldProps = {
    id?: string;
    name: string;
    type: 'text' | 'number' | 'password' | 'date' | 'email' | 'tel' | 'url' | 'search' | 'hidden' | 'time';
    isSuccess?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    readOnly?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    maxLength?: number;
    pattern?: string;
    textarea?: boolean;
    textareaRows?: number;
    onChange?: ChangeHandler;
    onBlur?: ChangeHandler;
    onFocus?: ChangeHandler;
    onKeyDown?: ChangeHandler;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    value?: string | number;
    helpText?: string;
    error?: FieldError;
    prepend?: JSX.Element;
    prependClick?: MouseEventHandler;
    append?: JSX.Element;
    appendClick?: MouseEventHandler;
    clear?: boolean;
    onClear?: MouseEventHandler;
    step?: string | number;
};

const AppField: React.FC<AppFieldProps> = forwardRef<HTMLInputElement | HTMLTextAreaElement, AppFieldProps>((props, ref) => {
    const  {
        id, // this will not work with SSR
        name,
        type,
        isSuccess = false,
        label = '',
        placeholder = '',
        readOnly = false,
        autoFocus = false,
        required = false,
        textarea = false,
        disabled = false,
        textareaRows = 10,
        maxLength,
        pattern,
        onChange,
        onBlur,
        onFocus,
        onKeyDown,
        className = '',
        inputClassName = '',
        labelClassName = '',
        value,
        helpText,
        error,
        prepend,
        prependClick,
        append,
        appendClick,
        clear = false,
        onClear,
        step,
    } = props;
    const containerRef = createRef<HTMLDivElement>();
    const  [isNotEmpty, setIsNotEmpty] = useState(false);

    useEffect(() =>{
        updateIsNotEmpty();
    }, [ref, value]);

    const updateIsNotEmpty = () => {
      if (containerRef.current) {
          const {current} = containerRef;
          const inputElement = current?.children?.namedItem(name);
          let component: HTMLInputElement | null = null;
          if (inputElement && (component = inputElement as HTMLInputElement) != null) {
              setIsNotEmpty(typeof  component.value != 'undefined' && component.value.length != 0);
          }
      }
    };

    const getLabelStyle = () => {
      const _defaultStyle = 'text-sm text-dark font-bold block mb-2';
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
        } else if (isSuccess) {
            border = 'border-green';
            placeholder = 'placeholder:text-green';
            outline = 'outline-green';
            text = 'text-green';
            background = 'bg-green-light';
        } else if (error && error.type) {
            border = 'border-red';
            placeholder = 'placeholder:text-red';
            outline = 'outline-red';
            text = 'text-red';
            background = 'bg-red-light';
        } else if (isNotEmpty) {
            border = 'border-gray-darker focus:border-primary-dark';
            placeholder = 'placeholder:text-gray-dark';
            outline = 'outline-primary-light';
            text = 'text-gray-darker text-gray-darker-1';
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

        return [defaultStyles, border, placeholder, outline, text, background, paddings, inputClassName].join(' ');
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

        if (isSuccess) {
            return wrapIcon(<HiCheckCircle />, 'text-green');
        }

        if (clear) {
            return wrapIcon(<HiClipboard onClick={onClear} />, 'text-gray');
        }

        return error && error.type ? wrapIcon(<HiOutlineExclamationCircle />, 'text-red') : append != null ? wrapIcon(append, '') : null;
    };

    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
        if (type == 'email' && value && !value.toString().includes('@')) {
            e.preventDefault();
        }
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
                {textarea ? (
                    <textarea
                        autoFocus={autoFocus}
                        required={required}
                        ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
                        name={name}
                        id={id ?? name}
                        rows={textareaRows}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        value={value}
                        onKeyDown={(e) => {
                            updateIsNotEmpty();
                            onKeyDown && onKeyDown(e);
                        }}
                        onChange={(e) => {
                            updateIsNotEmpty();
                            onChange && onChange(e);
                        }}
                        onBlur={(e) => {
                            updateIsNotEmpty();
                            onBlur && onBlur(e);
                        }}
                        onFocus={(e) => {
                            updateIsNotEmpty();
                            onFocus && onFocus(e);
                        }}
                        disabled={disabled}
                        className={getInputStyle()}
                    />
                ) : (
                    <input
                        autoFocus={autoFocus}
                        required={required}
                        ref={ref as React.ForwardedRef<HTMLInputElement>}
                        type={type}
                        id={id ?? name}
                        name={name}
                        pattern={pattern}
                        disabled={disabled}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        onInvalid={handleInvalid}
                        value={value}
                        step={step}
                        onKeyDown={(e) => {
                            updateIsNotEmpty();
                            onKeyDown && onKeyDown(e);
                        }}
                        onChange={(e) => {
                            updateIsNotEmpty();
                            onChange && onChange(e);
                        }}
                        onBlur={(e) => {
                            updateIsNotEmpty();
                            onBlur && onBlur(e);
                        }}
                        onFocus={(e) => {
                            updateIsNotEmpty();
                            onFocus && onFocus(e);
                        }}
                        className={getInputStyle()}
                    />
                )}
                {getAppendIcon()}
            </div>
            <div>{helpText && <span className={'block mt-2 text-sm text-gray-darker'}>{helpText}</span>}</div>
            <div>{error && error.type && <span className={'block mt-2 text-sm text-red'}>{error.message}</span>}</div>
        </div>
    );
});

export default AppField;
