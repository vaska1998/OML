import {NextPage} from "next";
import SidebarLayout from "../../components/layout/sidebar";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import AppField from "../../components/common/field";
import {useRouter} from "next/router";
import {Fragment, useEffect, useState} from "react";
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
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

type RegisterState = StateFetchedBatch<Record<string, never>, ClientErrorResponse>;

const Register: NextPage = () => {
    const {t} = useTranslation('common');
    const router = useRouter();
    const [hidePass, setHidePass] = useState<boolean>(true);
    const [state, setState] = useState<RegisterState>({ type: 'EMPTY'});

    const instruments = [
        { id: 1, name: Instrument.guitar },
        { id: 2, name: Instrument.piano },
    ];

    const [selected, setSelected] = useState(instruments[0]);
    const [query, setQuery] = useState<Instrument | string>('');

    const filteredInstruments =
        query === ''
            ? instruments
            : instruments.filter((instrument) => {
                return instrument.name.toLowerCase().includes(query.toLowerCase())
            });

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
        console.log(data);
        if (query as Instrument) data.instrument = query as Instrument;
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
                <div className="pb-4 text-2xl text-black font-semibold">{t('pageTitles.signUp')}</div>
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

                    <Combobox value={selected} onChange={setSelected}>
                        <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                    className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    displayValue={(instrument:any) => instrument?.name}
                                    onChange={(event) => setQuery(event.target.value)}
                                    name={'instrument'}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <SelectorIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery('')}
                            >
                                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredInstruments.length === 0 && query !== '' ? (
                                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                            Nothing found.
                                        </div>
                                    ) : (
                                        filteredInstruments.map((instrument) => (
                                            <Combobox.Option
                                                key={instrument.id}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                    }`
                                                }
                                                value={instrument}>{({ selected, active }) => (<>
                        <span className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'}`}>{instrument.name}</span>{selected ? (
                                <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>) : null}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        ))
                                    )}
                                </Combobox.Options>
                            </Transition>
                        </div>
                    </Combobox>

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
