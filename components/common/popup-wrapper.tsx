import React, {Fragment} from 'react';
import {Dialog, Transition} from "@headlessui/react";
import {IoCloseOutline} from 'react-icons/io5';

export type AppPopupWrapperProps = {
    isOpen: boolean;
    closeModal?: () => unknown;
    additionalStyle?: string;
    title: string;
    children?: string | JSX.Element;
};
const AppPopupWrapper: React.FC<AppPopupWrapperProps> = (props: AppPopupWrapperProps) => {
    const {isOpen, closeModal, additionalStyle, title, children} = props;

    const getPopupStyles = () => {
        const defaultStyles = 'fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-20 p-6 flex items-center justify-center';

        return [defaultStyles, additionalStyle].join(' ');
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className={getPopupStyles()} onClick={(e:React.MouseEvent) => e.stopPropagation()} onClose={() => closeModal && closeModal()}>
                <div className="h-screen text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0"/>
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
					</span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className="inline-block w-[310px] sm:w-96 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-primary-lighter shadow-card rounded-xl ">
                            <Dialog.Title as="div" className="flex justify-between px-6">
                                <span className="text-base font-bold text-primary-hover">{title}</span>
                                {
                                    closeModal &&
                                    <IoCloseOutline className="text-2xl font-bold text-black cursor-pointer"
                                                    onClick={closeModal}/>
                                }
                            </Dialog.Title>
                            <hr className="w-full h-px bg-gray my-5"/>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AppPopupWrapper;
