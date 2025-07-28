import Layout from '../components/Layout'
import '../styles/globals.css'
import Head from 'next/head'

export default function App({Component, pageProps}){
    return (<>
    <Head>
        <meta name='viewport' content="width=device-width, initial-scale=1.0"/>
        <meta charSet='UTF-8'></meta>
        <title>Matribhasha</title>
    </Head>
    <Layout>
        <Component {...pageProps}/>
    </Layout>
    </>
    )
}