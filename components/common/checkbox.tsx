import { ChangeHandler } from 'react-hook-form';
import React, { forwardRef } from 'react';

export type AppCheckboxProps = {
    id?: string;
    name: string;
    label?: string;
    readOnly?: boolean;
    onChange?: ChangeHandler;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    labelLeft?: boolean;
    disabled?: boolean;
};

const AppCheckbox: React.FC<AppCheckboxProps> = forwardRef((props, ref) => {
    const { id , name, label, readOnly = false, onChange, className = '', inputClassName = '', labelClassName = '', labelLeft = false, disabled = false } = props;

    const getInputStyle = () => {
        const baseStyle = 'h-4 w-4 border-gray rounded cursor-pointer';
        if (disabled) {
            return [baseStyle, 'bg-gray-darker, text-primary-light', inputClassName].join(' ');
        }

        return [baseStyle, 'text-primary focus:ring-primary-darker-1 bg-gray-light', inputClassName].join(' ');
    };

    const renderLabel = () => {
        if (!label) {
            return null;
        }

        return (
            <label htmlFor={name} className={`ml-2 block text-base text-gray-darker ${disabled ? '' : 'cursor-pointer'} ${labelClassName}`}>
                {label}
            </label>
        );
    };

    return (
        <div className={`flex items-center ${className}`}>
            {labelLeft && renderLabel()}
            <input ref={ref as never} type="checkbox" className={getInputStyle()} name={name} id={id ?? name} onChange={onChange} disabled={disabled} readOnly={readOnly} />
            {!labelLeft && renderLabel()}
        </div>
    );
});

export default AppCheckbox;
