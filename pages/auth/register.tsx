import {NextPage} from "next";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import AppField from "../../components/common/field";
import {useRouter} from "next/router";
import {useState} from "react";
import {StateFetchedBatch} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {SubmitHandler, useForm} from "react-hook-form";
import {AuthRegisterRequest} from "../../infrastructure/dto/auth/register";
import {getConnection} from "../../tools/connection";
import {patternEmail, patternPassword} from "../../infrastructure/constants/patterns";
import StatusErrors from "../../components/common/status.errors";
import AppButton from "../../components/common/button";
import {HiOutlineEye, HiOutlineEyeOff} from 'react-icons/hi';
import {Instrument} from "../../infrastructure/constants/instruments";
import AppOption from "../../components/common/option";

type RegisterState = StateFetchedBatch<Record<string, never>, ClientErrorResponse>;

const Register: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [state, setState] = useState<RegisterState>({ type: 'EMPTY'});
    const [instrument, setInstrument] = useState<Instrument>(Instrument.guitar);
    const instrumentsArray = Object.values(Instrument);

    const statusToError = new Map<number, string>(
        [
            [409, t('signUp.errorUserAlreadyExists')],
        ]
    );
    const defaultError = t('errorMessages.smthGoesWrong');
    const {
        register,
        watch,
        handleSubmit,
        formState: {errors},
        getValues,
    } = useForm<AuthRegisterRequest>();

    const onSubmit: SubmitHandler<AuthRegisterRequest> = data => {
        const {client} = getConnection();
        data.instrument = instrument;
        setState({ type: 'LOADING', startedTime: new Date()});
        client.auth.signup(data).then(response => {
            if (response.type == 'SUCCESS') {
                setState({ type: 'SUCCESS', result: {}});
                router.push('/auth/login').then();
            } else {
                setState({ type: 'ERROR', error: {...response}});
            }
        });
    };

    return (
        <SidebarLayout pageMain={false} title={t('headTitles.signUp')}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <div className="pb-4 text-2xl text-black font-semibold mt-16 mb-4">{t('pageTitles.signUp')}</div>
                <form onSubmit={handleSubmit(onSubmit, (a)=>{console.error(a)})} className="w-full space-y-4" id='register_form'>
                    <AppField
                        type={'text'}
                        error={errors.firstName}
                        label={t('labels.firstName')}
                        placeholder={t('placeholders.firstName')}
                        {...register('firstName', {
                            required: t('errorMessages.fieldIsRequired'),
                            value: getValues('firstName'),
                        })}
                    />
                    <AppField
                        type={'text'}
                        error={errors.lastName}
                        label={t('labels.lastName')}
                        placeholder={t('placeholders.lastName')}
                        {...register('lastName', {
                            required: t('errorMessages.fieldIsRequired'),
                            value: getValues('lastName'),
                        })}
                    />
                    <AppOption
                        name={'instrument'}
                        list={instrumentsArray}
                        size={1}
                        label={t('labels.instrument')}
                        onChange={(e)=>setInstrument(e.target.value as Instrument) }
                    />
                    <AppField
                        type={'email'}
                        error={errors.email}
                        label={t('labels.email')}
                        placeholder={t('placeholders.email')}
                        {...register('email', {
                            required: t('errorMessages.fieldIsRequired'),
                            pattern: { value: patternEmail, message: t('errorMessages.emailNotValid') },
                            value: getValues('email'),
                        })}
                    />
                    <AppField
                        type={hidePass ? 'password' : 'text'}
                        error={errors.password}
                        label={t('labels.password')}
                        placeholder={t('placeholders.password')}
                        helpText={t('helpText.minCharacters', { value: 8 })}
                        append={hidePass ? <HiOutlineEyeOff className={'text-gray-dark'} /> : <HiOutlineEye className={'text-gray-dark'} />}
                        appendClick={_ => setHidePass(!hidePass)}
                        {...register('password', {
                            required: t('errorMessages.fieldIsRequired'),
                            maxLength: { value: 32, message: t('errorMessages.maxCharacters', { value: 32 }) },
                            pattern: { value: patternPassword, message: t('errorMessages.passwordNotValid') },
                            validate: {
                                doNotMatch: val => {
                                    if (val != watch('confirmPassword')) {
                                        return t('errorMessages.passwordsDoNotMatch');
                                    }
                                },
                            },
                            value: getValues('password'),
                        })}
                    />
                    <AppField
                        type={hidePass ? 'password' : 'text'}
                        error={errors.confirmPassword}
                        label={t('labels.confirmPassword')}
                        placeholder={t('placeholders.password')}
                        {...register('confirmPassword', {
                            required: t('errorMessages.fieldIsRequired'),
                            validate: {
                                doNotMatch: val => {
                                    if (watch('password') != val) {
                                        return t('errorMessages.passwordsDoNotMatch');
                                    } else {
                                        return true;
                                    }
                                },
                            },
                            value: getValues('confirmPassword'),
                        })}
                    />
                    {state.type == 'ERROR' &&
                        <StatusErrors
                            status={state.error.status}
                            statusToError={statusToError}
                            defaultError={defaultError}
                        />
                    }
                    <AppButton disabled={state.type == 'LOADING'} type="submit">
                        {t('button.createProfile')}
                    </AppButton>
                </form>
                <div className="text-sm text-darker-1 mt-4">
                    {t('signUp.bySigningUp')} <span className="text-primary hover:text-primary-hover underline cursor-pointer">{t('links.termOfUse1')}</span> {t('signUp.and')}{' '}
                    <span className="text-primary hover:text-primary-hover underline cursor-pointer">{t('links.privacyPolicy1')}</span>.
                </div>
                <hr className="w-full h-px bg-gray my-5" />
                <div className="text-sm">
                    <span className="text-black pr-1">{t('signUp.alreadyHaveAnAccount')}</span>
                    <Link href="/auth/login" passHref>
                        <span className="text-primary hover:text-primary-hover underline cursor-pointer">{t('links.login')}</span>
                    </Link>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Register;
