import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import i18nConfig from '../i18n.json';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';


const { locales } = i18nConfig;
const languages = [
    { lang: locales[0], label: 'UA' },
    { lang: locales[1], label: 'EN'},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function SelectLang() {
    const { lang } = useTranslation('common');
    const [selected, setSelected] = useState(languages.filter(item => item.lang === lang)[0]);

    useEffect(() => {
        if (selected.lang != lang) {
            setLanguage(selected.lang).then();
        }
    }, [selected]);

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <div className="relative ">
                    <Listbox.Button className="relative w-full pl-3 pr-10 py-2 text-left cursor-default sm:text-sm text-white cursor-pointer">
                        <span className="ml-2 block truncate text-2xl cursor-pointer">{selected.label}</span>
                        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none ">
                            {open ? <IoIosArrowUp className="h-5 w-5 text-white text-2xl" aria-hidden="true" />:
                                <IoIosArrowDown className="h-5 w-5 text-white text-2xl" aria-hidden="true" />}
						</span>
                    </Listbox.Button>

                    <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 w-full text-2xl max-h-56 rounded py-1 text-white overflow-auto focus:outline-none sm:text-sm ">
                            {languages.map(language => (
                                <Listbox.Option
                                    key={language.lang}
                                    className={({ active }) =>
                                        classNames(active ? `text-white bg-primary-light` : `text-white bg-primary`, `cursor-pointer select-none relative py-2 pl-3 pr-9 text-2xl bg-primary`)
                                    }
                                    value={language}
                                >
                                    {({ selected }) => <span className={classNames(selected ? 'text-2xl' : 'text-2xl', 'ml-2 block truncate cursor-pointer')}>{language.label}</span>}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
