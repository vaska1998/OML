import {useRouter} from 'next/router';
import React from 'react';
import {NextPage, NextPageContext} from 'next';

const isBrowser = () => typeof window != 'undefined';

type GuardConditionalProps = {
    WrappedComponent: NextPage;
    clientCondition: () => boolean;
    serverCondition: (ctx: NextPageContext) => boolean;
    location: string;
};

export const GuardConditional = ({
    WrappedComponent,
    clientCondition,
    serverCondition,
    location
}: GuardConditionalProps) => {
    const WIthConditionalRedirectWrapper = (props: never) => {
        const router = useRouter();
        if (typeof window != 'undefined') {
            const redirectCondition = clientCondition();
            if (isBrowser() && !redirectCondition) {
                router.push(location).then();
                return <></>;
            }
        }

        return <WrappedComponent {...props} />;
    };

    WIthConditionalRedirectWrapper.getInitialProps = async (ctx: NextPageContext) => {
        if (!isBrowser() && ctx.res) {
            if (!serverCondition(ctx)) {
                const {query} =ctx;
                const redirectQuery = [`redirectTo=/${ctx.locale}${ctx.pathname}`];
                for (const key of Object.keys(query)) {
                    redirectQuery.push(`${key}=${query[key]}`);
                }
                ctx.res.writeHead(302, {Location: '/' + ctx.locale + '/' + location + '?' + redirectQuery.join('&')});
                ctx.res.end();
            }
        }

        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx));

        return {...componentProps};
    };

    return WIthConditionalRedirectWrapper;
};

export default GuardConditional;
