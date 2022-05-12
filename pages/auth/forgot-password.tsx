import {StateError, StateLoading, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {NextPage} from "next";
import useTranslation from "next-translate/useTranslation";
import {useRouter} from "next/router";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ResetPasswordRequestDto} from "../../infrastructure/dto/auth/reset_password";
import {getConnection} from "../../tools/connection";
import SidebarLayout from "../../components/layout/sidebar";
import AppField from "../../components/common/field";
import AppButton from "../../components/common/button";
import {patternEmail} from "../../infrastructure/constants/patterns";
import {NotAuthorizedGuard} from "../../components/global/guard/not_authorized.guard";

type State = StateNamed<'NOT_SEND'> | StateLoading | StateError<ClientErrorResponse> | StateNamed<'SEND'>;

const ForgotPassword: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [instructionsState, setInstructionsState] = useState<State>({ type: 'NOT_SEND'});
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ResetPasswordRequestDto>();

    const onSubmit: SubmitHandler<ResetPasswordRequestDto> = (form: ResetPasswordRequestDto) => {
        if (instructionsState.type != 'NOT_SEND') {
            return;
        }

        const { client } = getConnection();
        setInstructionsState({
            type: 'LOADING',
            startedTime: new Date(),
        });
        client.auth.requestPasswordReset(form).then(response => {
            if (response.type == 'SUCCESS') {
                setInstructionsState({
                    type: 'SEND',
                });
            } else {
                setInstructionsState({
                    type: 'ERROR',
                    error: {...response},
                });
            }
        });
    };

    return (
        <SidebarLayout title={t('headTitles.forgotPassword')} pageMain={false}>
            <div className="w-full px-3 py-4 max-w-lg mx-auto flex flex-col items-center">
                {instructionsState.type == 'SEND' ? (
                    <>
                        <div className="pb-2 text-xl text-black font-semibold">{t('pageTitles.instructionWasSent')}</div>
                        <div className="pb-0.5 text-base text-black text-center">{t('forgotPassword.instructionWasSent.firstSubtitle')}</div>
                        <div className="pb-4 text-base text-black text-center">{t('forgotPassword.instructionWasSent.lastSubtitle')}</div>
                        <AppButton style={'outlined'} onClick={() => router.push('/')}>
                            {t('buttons.goHome')}
                        </AppButton>
                    </>
                ) : (
                    <>
                        <div className="pb-2 text-xl text-black font-semibold">{t('pageTitles.forgotPassword')}</div>
                        <div className="pb-4 text-base text-black text-center">{t('forgotPassword.subtitle')}</div>
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                            <AppField
                                type={'email'}
                                error={errors.email}
                                {...register('email', {
                                    value: router.query.email?.toString() ?? '',
                                    required: {
                                        value: true,
                                        message: t('errorMessages.fieldIsRequired'),
                                    },
                                    pattern: {
                                        value: patternEmail,
                                        message: t('errorMessages.emailNotValid'),
                                    },
                                })}
                                placeholder={t('placeholders.email')}
                            />
                            <AppButton type={'submit'}>{t('button.sendInstructions')}</AppButton>
                        </form>
                    </>
                )}
            </div>
        </SidebarLayout>
    );
};

export default NotAuthorizedGuard(ForgotPassword);
