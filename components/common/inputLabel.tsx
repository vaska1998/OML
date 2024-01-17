import React from 'react';

interface IInputLabelProps {
    label: string;
    additionalLabel?: string;
    otherMB?: string;
}

const InputLabel = ({ label, additionalLabel, otherMB }: IInputLabelProps) => {
    return (
        <div className={`text-primary-dark font-bold ${otherMB ? otherMB : 'mb-2'}`}>
            <span className='capitalize'>{label}</span>
            {additionalLabel && <span className='text-gray font-normal'> ({additionalLabel}) </span>}
        </div>
    );
};

export default InputLabel;