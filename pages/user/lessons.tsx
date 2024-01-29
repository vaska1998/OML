import {NextPage} from "next";
import {AuthorizeGuard} from "../../components/global/guard/authorize.guard";
import SidebarLayout from "../../components/layout/sidebar";

import useTranslation from "next-translate/useTranslation";
import {useAppUser} from "../../contexts/user.context";
import Button from "../../components/common/button";
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {UserUpdateRequest} from "../../infrastructure/dto/profile/user.update.request";
import {ClientErrorResponse} from "../../infrastructure/client/response";
import {useEffect, useState} from "react";
import {getConnection} from "../../tools/connection";
import {LessonResDto} from "../../infrastructure/dto/lesson/lesson.res.dto";
import {CreateLessonDto} from "../../infrastructure/dto/lesson/create.lesson.dto";

type State = StateFetchedBatch<UserUpdateRequest, ClientErrorResponse> | StateNamed<'FETCH'>;
const MyLessons: NextPage = () => {
    const {t} = useTranslation('common');
    const {  user } = useAppUser();
    const [state, setState] = useState<State>({ type: 'EMPTY'});
    const [lessons, setLessons] = useState<LessonResDto[]>([]);

    useEffect(() => {
        const { client } = getConnection();
        setState({
            type: 'FETCH',
        });
        client.lesson.getMyLessons().then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
                setLessons(response.result);
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
    }, []);

    const createLesson = (content: CreateLessonDto) => {
        const { client } = getConnection();
        setState({
            type: 'FETCH',
        });
        client.lesson.create(content).then(response => {
            if (response.type === 'SUCCESS') {
                setState({
                    type: 'EMPTY',
                });
            } else {
                setState({
                    type: 'ERROR',
                    error: response,
                });
            }
        });
    }


    return (
        <SidebarLayout pageMain={false} title={t('sidebar.myLessons')} login={true}>
            <div className='w-full pt-4 px-3 flex justify-end'>
                <div><Button>{t('button.create')}</Button></div>
            </div>
            <div className="w-full px-3 py-4 mx-auto flex flex-col justify-center items-center">
                <table className='table-fixed w-full bg-white px-4'>
                    <thead>
                    <tr className='font-bold bg-primary-lighter border border-solid border-gray-lighter'>
                        <td className='text-primary py-4 pl-4'>{t('table.time')}</td>
                        <td className='text-primary py-4'>{t('table.status')}</td>
                        <td className='text-primary py-4'>{t('table.teacher')}</td>
                        <td className='text-primary py-4'>{t('table.student')}</td>
                        <td className='text-primary py-4'>{t('table.instrument')}</td>
                        <td className='text-primary py-4'>{t('table.action')}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {lessons.map((lesson: LessonResDto, index: number) => {
                        return (
                            <tr className='border border-solid border-black' key={lesson.id}>
                                <td className='text-primary-hover py-4 pl-4'>{t('table.time')}</td>
                                <td className='text-primary-hover py-4'>{t('table.status')}</td>
                                <td className='text-primary-hover py-4'>{t('table.teacher')}</td>
                                <td className='text-primary-hover py-4'>{t('table.student')}</td>
                                <td className='text-primary-hover py-4'>{t('table.instrument')}</td>
                                <td className='text-primary-hover py-4 flex justify-around'>
                                    <Button>{t('button.cancel')}</Button>
                                    <Button additionalStyle='mx-4'>{t('button.details')}</Button>
                                </td>
                            </tr>
                        );
                    })}

                    </tbody>
                </table>
            </div>
        </SidebarLayout>
    )
}

export default AuthorizeGuard(MyLessons);
