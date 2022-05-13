import {_RootClient} from "./_root.client";
import {ProxyClient} from "./proxy/proxy";
import {AuthRegisterRequest} from "../dto/auth/register";
import {ClientResponse} from "./response";
import {AuthLoginSignInRequest, AuthLoginSignInResponse} from "../dto/auth/login";
import {ResetPasswordConfirmRequestDto, ResetPasswordRequestDto} from "../dto/auth/reset_password";

export class AuthClient extends _RootClient {
    constructor(proxy: ProxyClient) {
        super(proxy);
    }

    signup(content: AuthRegisterRequest): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.post('/auth/signup', content);
    }

    signin(content: AuthLoginSignInRequest): Promise<ClientResponse<AuthLoginSignInResponse>> {
        return this.proxy.post('/auth/signin', content);
    }

    confirm(confirmationId: string | number): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.get(`/auth/confirm/${confirmationId}`);
    }

    requestPasswordReset(content: ResetPasswordRequestDto): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.post('auth/requestpasswordreset', content);
    }

    resetPassword(content: ResetPasswordConfirmRequestDto): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.post('/auth/resetpassword', content);
    }
}
