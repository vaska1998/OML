import { ProxyClient } from './proxy';
import { ClientResponse } from '../response';

export class MockProxy implements ProxyClient {
    init(baseUrl: string, jwtToken: string): ProxyClient {
        throw 'NOT IMPLEMENT';
    }

    post<T, K>(url:string, model:T): Promise<ClientResponse<K>> {
        throw `NOT IMPLEMENT ${url} with model ${model}`;
    }

    get<T>(url: string): Promise<ClientResponse<T>> {
        throw `NOT IMPLEMENT ${url}`;
    }

    put<T, K>(url: string, model: T): Promise<ClientResponse<K>> {
        throw `NOT IMPLEMENT ${url} with model ${model}`;
    }

    patch<T, K>(url: string, model: T): Promise<ClientResponse<K>> {
        throw `NOT IMPLEMENT ${url} with model ${model}`;
    }

    del<T = undefined>(url: string): Promise<ClientResponse<T>> {
        throw `NOT IMPLEMENT ${url}`;
    }
}
