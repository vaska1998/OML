import React, {PropsWithChildren} from "react";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import AsideLayoutComponent from "./aside.layout.component";

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
                      <div className={'hidden md:block md:w-40 lg:w-60 shrink-0'}>
                          <AsideLayoutComponent/>
                      </div>
                  )} 
                  <main className={`w-full border-gray ${pageMain ? '' : 'bg-page bg-cover bg-no-repeat h-screen bg-opacity-50'}`}>
                      {children}
                  </main>
              </div>
              <Footer/>
          </div>
      </div>
  );
}

export default SidebarLayout;
