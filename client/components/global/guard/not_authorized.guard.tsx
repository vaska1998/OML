import React from 'react';
import ConditionalGuard from "./conditional.guard";
import {getConnection} from "../../../tools/connection";
import {NextPageContext} from "next";

export const NotAuthorizedGuard = (WrappedComponent: React.FunctionComponent, location = '/') => {
    return ConditionalGuard({
        WrappedComponent,
        location,
        clientCondition: () => {
            const { credentials } = getConnection();
            return credentials == null;
        },
        serverCondition: (ctx: NextPageContext) => {
            const { credentials } = getConnection(ctx.req);
            return credentials == null;
        },
    });
};
