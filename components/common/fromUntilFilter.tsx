import React from 'react';
import {combineDateAndTime} from "../../utils";
import InputLabel from "./inputLabel";
import useTranslation from "next-translate/useTranslation";

interface FromUntilProps {
    from: Date;
    until: Date;
    minFrom?: Date;
    maxUntil?: Date;
    onChange: (dates:{from:Date; until: Date}) => unknown;
}

const FromUntilFilter = ({ from, until, minFrom, maxUntil, onChange } : FromUntilProps) => {
    const {t} = useTranslation('common');
    const dateCreate = (rawDate:string):Date => {
        const startTime = new Date().getHours() + ':00';
        return combineDateAndTime(new Date(rawDate), startTime);
    }

    return (
        <div className='flex justify-between mx-2'>
            <div className='m-5'>
                <div className='w-60'>
                    <InputLabel label={t('labels.from')} otherMB={'mb-2 text-lg'}/>
                    <div className='md-form relative custom-date'>
                        <i className='bi bi-calendar absolute z-10 text-gray text-lg top-1.5 left-3.5'/>
                        <input
                            type='date'
                            className='custom-input transition text-base py-1.5 px-3 block rounded-lg bg-clip-padding w-full font-normal relative custom-date_input text-gray placeholder-gray-light pl-12 pr-2.5 shadow border border-solid border-black-divider focus:border-primary-hover focus:outline-none appearance-none min-h-38'
                            onChange={e => onChange({from: dateCreate(e.target.value), until})}
                            max={until.toISOString().slice(0, 10)}
                            min={minFrom?.toISOString().slice(0, 10)}
                            required
                            value={from.toISOString().slice(0, 10)}
                        />
                    </div>
                </div>
            </div>
            <div className='m-5'>
                <div className='w-60'>
                    <InputLabel label={t('labels.until')} otherMB='mb-2 text-lg'/>
                    <div className='md-form relative custom-date'>
                        <i className='bi bi-calendar absolute z-10 text-gray text-lg top-1.5 left-3.5' />
                        <input
                            type='date'
                            className='custom-input transition text-base py-1.5 px-3 block rounded-lg bg-clip-padding w-full font-normal relative custom-date_input text-gray placeholder-gray-light pl-12 pr-2.5 shadow border border-solid border-black-divider focus:border-primary-hover focus:outline-none appearance-none min-h-38'
                            onChange={e => onChange({from, until: dateCreate(e.target.value)})}
                            max={maxUntil?.toISOString().slice(0, 10)}
                            min={from.toISOString().slice(0, 10)}
                            required
                            value={until.toISOString().slice(0, 10)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FromUntilFilter;