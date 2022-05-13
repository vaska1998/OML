import React, {useEffect, useState} from 'react';

type StatusErrorsProps = {
    status: number;
    statusToError?: Map<number, string | React.ReactElement>;
    defaultError: string;
}
const StatusErrors = (props: StatusErrorsProps) => {
    const {
        status,
        defaultError,
        statusToError = new Map(),
    } = props;
    const [errorText, setErrorText] = useState<string>(defaultError);

    useEffect(() => {
        setErrorText(statusToError.get(status) ?? defaultError);
    }, [status]);

    return (
        <div className={'text-red text-center'}>
            {errorText}
        </div>
    );
};


export default StatusErrors;
