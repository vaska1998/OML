import React, {PropsWithChildren} from "react";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";

interface SidebarLayoutsProps {
    title?: string;
    description?: string;
    keyWords?: string;
    pageMain: boolean;
    login?: boolean;
}

const SidebarLayout: React.FunctionComponent<PropsWithChildren<SidebarLayoutsProps>> = ({
    children,
    title,
    description,
    keyWords,
    pageMain,
    login
}) => {
  return (
      <div>
          <Head>
              <title>{title}</title>
              {description && <meta name={'description'} content={description}/>}
              {keyWords && <meta name={'keywords'} content={keyWords}/>}
              <meta
                  name="viewport"
                  content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
              />
              <meta name="HandheldFriendly" content="true"/>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
          </Head>
          <div className={`w-full ${pageMain ? 'bg-main h-screen bg-cover' : ''}`}>
              <Header pageMain={pageMain}/>
              <div className={`flex flex-row min-h-aside-sm md:min-h-aside`}>
                  {login && (
                      <div className={'hidden md:block md:w-60 lg:w-80 shrink-0'}></div>
                  )}
                  <main className={'w-full md:border-l border-gray'}>
                      {children}
                  </main>
              </div>
              <Footer/>
          </div>
      </div>
  );
}

export default SidebarLayout;
