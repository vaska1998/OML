import React from 'react';
import {StateFetchedBatch, StateNamed} from "../../infrastructure/state";
import {ClientErrorResponse} from "../../infrastructure/client/response";

type MenuLayoutComponentProps = {
    onClick?: () => unknown,
}

type State = StateFetchedBatch<ClientErrorResponse> | StateNamed<'FETCH'>;
