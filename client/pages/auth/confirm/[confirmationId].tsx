import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import AppButton from '../../../components/common/button';
import { getConnection } from '../../../tools/connection';
import { ClientErrorResponse } from '../../../infrastructure/client/response';
import { StateFetchedBatch } from '../../../infrastructure/state';
import SidebarLayout from "../../../components/layout/sidebar";

type Status = StateFetchedBatch<Record<string, never>, ClientErrorResponse>;
const ConfirmEmail: NextPage = () => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [status, setStatus] = useState<Status>({ type: 'EMPTY' });

    useEffect(() => {
        const confirmationId = router.query.confirmationId?.toString() ?? '';
        if (!confirmationId) {
            router.push({
                pathname: '/',
            }).then();
            return;
        }

        setStatus({ type: 'LOADING', startedTime: new Date() });
        const { client } = getConnection();
        client.auth.confirm(confirmationId).then(response => {
            if (response.type == 'SUCCESS') {
                setStatus({
                    type: 'SUCCESS',
                    result: {},
                });
            } else {
                setStatus({
                    type: 'ERROR',
                    error: { ...response },
                });
            }
        });
    }, []);

    return (
        <SidebarLayout title={t('headTitles.emailConfirmation')} pageMain={false}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <div className="mb-2 text-xl text-black font-semibold">{t('pageTitles.emailConfirmation')}</div>
                {status.type == 'ERROR' ? (
                    <div className="text-base text-black text-center">{t('errorMessages.smthGoesWrong')}</div>
                ) : (
                    <>
                        <div className="mb-4 text-base text-black text-center">{t('emailConfirmation.message')}</div>
                        <AppButton onClick={() => router.push('/auth/login')}>{t('button.login')}</AppButton>
                    </>
                )}
            </div>
        </SidebarLayout>
    );
};

export default ConfirmEmail;
