import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { SubmitHandler, useForm } from 'react-hook-form';
import AppField from '../../../components/common/field';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import AppButton from '../../../components/common/button';
import { ResetPasswordConfirmRequestDto } from '../../../infrastructure/dto/auth/reset_password';
import { ClientErrorResponse } from '../../../infrastructure/client/response';
import { NotAuthorizedGuard } from '../../../components/global/guard/not_authorized.guard';
import { getConnection } from '../../../tools/connection';
import { StateFetchedBatch } from '../../../infrastructure/state';
import { patternPassword } from '../../../infrastructure/constants/patterns';
import SidebarLayout from "../../../components/layout/sidebar";

type ResetPasswordForm = ResetPasswordConfirmRequestDto & {
    confirmPassword: string;
};

type Status = StateFetchedBatch<Record<string, never>, ClientErrorResponse>;

const ResetPasswordPage: NextPage = () => {
    const { query, push: routerPush } = useRouter();
    const [id] = useState(query.id?.toString() ?? '');
    const { t } = useTranslation('common');
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordForm>();
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [status, setStatus] = useState<Status>({ type: 'EMPTY' });

    if (!id) {
        routerPush('/').then();
        return <></>;
    }

    const onSubmit: SubmitHandler<ResetPasswordForm> = (data: ResetPasswordForm) => {
        if (status.type == 'LOADING') {
            return;
        }

        const content = {
            ...data,
            resetPasswordId: id,
        };
        const { client } = getConnection();
        client.auth.resetPassword(content).then(response => {
            if (response.type == 'SUCCESS') {
                setStatus({
                    type: 'SUCCESS',
                    result: {},
                });

                routerPush({
                    pathname: '/auth/login',
                }).then();
            } else {
                setStatus({
                    type: 'ERROR',
                    error: { ...response },
                });
            }
        });
    };

    return (
        <SidebarLayout title={t('headTitles.resetPassword')} pageMain={false}>
            <div className="w-full px-3 py-4 flex flex-col items-center">
                <div className="pb-4 text-xl text-black font-semibold">{t('pageTitles.resetPassword')}</div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4 space-y-4">
                    <AppField
                        error={errors.password}
                        type={hidePass ? 'password' : 'text'}
                        append={hidePass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        appendClick={() => setHidePass(!hidePass)}
                        label={t('labels.newPassword')}
                        helpText={t('helpText.minCharacters', { value: 8 })}
                        {...register('password', {
                            required: t('errorMessages.fieldIsRequired'),
                            maxLength: {
                                value: 32,
                                message: t('errorMessages.maxCharacters', { value: 32 }),
                            },
                            pattern: {
                                value: patternPassword,
                                message: t('errorMessages.passwordNotValid'),
                            },
                            validate: {
                                doNotMatch: val => {
                                    if (val != watch('confirmPassword')) {
                                        return t('errorMessages.passwordsDoNotMatch');
                                    }
                                },
                            },
                        })}
                    />
                    <AppField
                        error={errors.confirmPassword}
                        type={hidePass ? 'password' : 'text'}
                        append={hidePass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        appendClick={() => setHidePass(!hidePass)}
                        label={t('labels.confirmNewPassword')}
                        {...register('confirmPassword', {
                            required: t('errorMessages.fieldIsRequired'),

                            validate: {
                                doNotMatch: val => {
                                    if (val != watch('password')) {
                                        return false;
                                    }
                                },
                            },
                        })}
                    />
                    <AppButton type={'submit'}>{t('buttons.resetPassword')}</AppButton>
                </form>
            </div>
        </SidebarLayout>
    );
};

ResetPasswordPage.getInitialProps = ({ query, res }) => {
    if (!res) {
        return {};
    }

    const id = query.id?.toString();
    if (!id) {
        res.writeHead(301, { Location: '/' });
        res.end();
    }

    return {};
};

export default NotAuthorizedGuard(ResetPasswordPage);
