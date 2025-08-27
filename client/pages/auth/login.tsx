import { NextPage} from 'next';
import {NotAuthorizedGuard} from "../../components/global/guard/not_authorized.guard";
import {AuthLoginSignInRequest} from "../../infrastructure/dto/auth/login";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {StateFetchedBatch} from "../../infrastructure/state";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {getConnection} from "../../tools/connection";
import {useAppUser} from "../../contexts/user.context";
import SidebarLayout from "../../components/layout/sidebar";
import AppField from "../../components/common/field";
import {patternEmail} from "../../infrastructure/constants/patterns";
import {HiOutlineEye, HiOutlineEyeOff} from "react-icons/hi";
import {passwordMaxLength, passwordMinLength} from "../../infrastructure/constants/fields";
import AppCheckbox from "../../components/common/checkbox";
import Link from "next/link";
import AppButton from "../../components/common/button";
import StatusErrors from "../../components/common/status.errors";

type AuthLoginForm = AuthLoginSignInRequest & {
    rememberMe: boolean;
};

type State = StateFetchedBatch<Record<string, never>, ClientErrorResponse>;

const defaultAuthLoginForm: AuthLoginForm = {
    email: '',
    password: '',
    rememberMe: true,
};


const Login: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [state, setState] = useState<State>({type: 'EMPTY'});
    const [hidePass, setHidePass] = useState<boolean>(true);
    const {signIn} = useAppUser();
    const statusToError = new Map<number, string>(
        [
            [400, t('login.errorWrongEmailOrPassword')],
            [406, t('login.errorUserNotActivated')]
        ]
    );
    const defaultStatusError = t('errorMessages.smthGoesWrong');
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm<AuthLoginForm>({
        defaultValues: defaultAuthLoginForm,
    });

    const watchEmail = watch('email');

    const onSubmit: SubmitHandler<AuthLoginForm> = async (data) => {
        setState({type: 'LOADING', startedTime: new Date()});
        const {client} = getConnection();
        const response = await client.auth.signin(data);
        if (response.type == 'SUCCESS') {
            setState({
                type: 'SUCCESS',
                result: {}
            });
            signIn({
                accessToken: response.result.token,
                refreshToken: '',
            }, data.rememberMe);

            if (router.query.redirectTo && typeof  router.query.redirectTo == 'string') {
                const redirectTo = router.query.redirectTo as string;
                const updatedQuery = {
                    ...router.query,
                };
                delete updatedQuery.redirectTo;
                router.push({
                    pathname: redirectTo,
                    query: updatedQuery
                }).then();
            } else {
                router.push('/main').then();
            }
        } else {
            setState({
                type: 'ERROR',
                error: response
            });
        }
    };
    return (
        <SidebarLayout pageMain={false} title={t('headTitles.login')}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                <div className="pb-4 text-2xl text-black">{t('headTitles.login')}</div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <AppField
                        type={'email'}
                        error={errors.email}
                        label={t('labels.email')}
                        placeholder={t('placeholders.email')}
                        {...register('email', {
                            required: t('errorMessages.fieldIsRequired'),
                            pattern: {
                                value: patternEmail,
                                message: t('errorMessages.emailNotValid'),
                            },
                        })}
                    />
                    <AppField
                        type={hidePass ? 'password' : 'text'}
                        error={errors.password}
                        label={t('labels.password')}
                        placeholder={t('placeholders.password')}
                        append={hidePass ? <HiOutlineEyeOff/> : <HiOutlineEye/>}
                        appendClick={_ => setHidePass(!hidePass)}
                        {...register('password', {
                            required: t('errorMessages.fieldIsRequired'),
                            minLength: {
                                value: passwordMinLength,
                                message: t('errorMessages.minCharacters', {value: passwordMinLength}),
                            },
                            maxLength: {
                                value: passwordMaxLength,
                                message: t('errorMessages.maxCharacters', {value: passwordMaxLength}),
                            },
                        })}
                    />
                    <div className="flex items-center justify-between mb-5">
                        <AppCheckbox {...register('rememberMe', {})} label={t('login.rememberMe')}/>
                        <Link href={{pathname: '/auth/forgot-password', query: {email: watchEmail}}} passHref>
							<span
                                className="text-sm text-primary hover:text-primary-hover underline cursor-pointer">{t('login.forgotYourPassword')}</span>
                        </Link>
                    </div>
                    {state.type == 'ERROR' && <StatusErrors status={state.error.status} statusToError={statusToError}
                                                            defaultError={defaultStatusError}/>}
                    <AppButton type={'submit'} disabled={state.type == 'LOADING'}>
                        {t('button.login')}
                    </AppButton>
                </form>
                <hr className="w-full h-px bg-gray my-5"/>
                <div className="text-sm">
                    <span className="text-black pr-1">{t('login.newTo')}</span>
                    <Link href="/auth/register" passHref>
						<span
                            className="text-primary hover:text-primary-hover underline cursor-pointer">{t('navMenu.signUp')}</span>
                    </Link>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default NotAuthorizedGuard(Login);
