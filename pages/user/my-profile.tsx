import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import AppField from "../../components/common/field";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useEffect, useState} from "react";
import {getConnection} from "../../tools/connection";
import {SubmitHandler, useForm} from "react-hook-form";
import AppButton from "../../components/common/button";
import {UserUpdateRequest} from "../../infrastructure/dto/profile/user.update.request";
import {Notify} from 'notiflix';
import {patternEmail, patternPhoneNumber} from "../../infrastructure/constants/patterns";
import StatusErrors from "../../components/common/status.errors";

type State = StateFetchedBatch<UserUpdateRequest, ClientErrorResponse> | StateNamed<'FETCH'>;

const MyProfile: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [state, setState] = useState<State>({ type: 'EMPTY'});
    const { register, handleSubmit, reset, formState: { errors }, setValue} = useForm<UserUpdateRequest>();
    const statusToError = new Map<number, string>([[409, t('signUp.errorUserAlreadyExists')], [406, t('errorMessages.newEmailNotConfirm')]]);
    const defaultError = t('errorMessages.smthGoesWrong');

    useEffect(() => {
        const {client} = getConnection();
        setState({
            type: 'FETCH',
        });
        client.user.getCurrent().then(response => {
            if (response.type == 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                reset(response.result);
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
    }, []);

    const onSubmit: SubmitHandler<UserUpdateRequest> = data => {
        const {client} = getConnection();
        setState({ type: 'LOADING', startedTime: new Date()});
        client.user.updateCurrent(data).then(response => {
            if (response.type == 'SUCCESS') {
                setState({ type: 'SUCCESS', result: response.result});
                Notify.success(t('successMessages.success'));
            } else {
                setState({ type: 'ERROR', error: {...response}});
            }
        });
    };

    return (
        <SidebarLayout pageMain={false} title={t('sidebar.myProfile')} login={true}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <h2 className='text-3xl'>Профіль</h2>
                <form className="w-full space-y-4" id='register_form' onSubmit={handleSubmit(onSubmit)}>
                    <AppField
                        type={'text'}
                        label={t('labels.firstName')}
                        placeholder={t('placeholders.firstName')}
                        error={errors.firstName}
                        {...register('firstName', {
                            required: t('errorMessages.fieldIsRequired'),
                        })}
                    />
                    <AppField
                        type={'text'}
                        label={t('labels.lastName')}
                        placeholder={t('placeholders.lastName')}
                        error={errors.lastName}
                        {...register('lastName', {
                            required: t('errorMessages.fieldIsRequired'),
                        })}
                    />
                    <AppField
                        type={'email'}
                        label={t('labels.email')}
                        placeholder={t('placeholders.email')}
                        error={errors.email}
                        {...register('email', {
                            required: t('errorMessages.fieldIsRequired'),
                            pattern: { value: patternEmail, message: t('errorMessages.email.NotValid')}
                        })}
                    />
                    <AppField
                        type={'tel'}
                        label={t('labels.phoneNumber')}
                        placeholder={t('placeholders.phoneNumber')}
                        error={errors.phone}
                        {...register('phone', {
                            onBlur: (event:any) => {
                                const value = event.target.value?.trim();
                                if (!value) {
                                    return;
                                }

                                if (/^\d{10}$/.test(value)) {
                                    setValue('phone', `+38${value}`);
                                } else if (/^\d{12}$/.test(value)) {
                                    setValue('phone', `+${value}`);
                                }
                            },
                            pattern: { value: patternPhoneNumber, message: t('errorMessages.phoneNotValid')}
                        })}
                    />
                    {state.type == 'ERROR' && <div className={'mb-4'}><StatusErrors status={state.error.status} statusToError={statusToError} defaultError={defaultError}/></div>}
                    <AppButton type={'submit'} disabled={state.type == 'LOADING'}>
                        {t('button.saveChanges')}
                    </AppButton>
                </form>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(MyProfile);
