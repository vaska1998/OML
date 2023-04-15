import '../styles/globals.css'
import type {AppContext, AppProps} from 'next/app'
import {AppUserProvider, AppUserProviderProps} from "../contexts/user.context";
import {AppTranslationProvider} from "../contexts/translation.context";
import App from "next/app";
import {getConnection} from "../tools/connection";

function MyApp({ Component, pageProps, client, user }: AppProps & AppUserProviderProps) {
  return (
      <AppUserProvider user={user} client={client}>
            <AppTranslationProvider>
                <Component {...pageProps} />
            </AppTranslationProvider>
      </AppUserProvider>
  );
};

MyApp.getInitialProps = async (context: AppContext): Promise<AppUserProviderProps> => {
  const appProps = await App.getInitialProps(context);
  const {client, credentials: user} = getConnection(context.ctx?.req);

  return {
    ...appProps,
    user,
    client
  };
};

export default MyApp
