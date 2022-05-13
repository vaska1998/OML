import {NextPage, NextPageContext} from "next";
import ConditionalGuard from "./conditional.guard";
import {getConnection} from "../../../tools/connection";

export const AuthorizeGuard = (WrappedComponent: NextPage, location = '/auth/login') => {
    return ConditionalGuard({
        WrappedComponent,
        location,
        clientCondition: () => {
            const { credentials } = getConnection();
            return credentials != null;
        },
        serverCondition: (ctx: NextPageContext) => {
            const { credentials } = getConnection(ctx.req);
            return credentials != null;
        }
    });
};
