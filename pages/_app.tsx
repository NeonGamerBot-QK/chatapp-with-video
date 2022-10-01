import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp(props: AppProps) {
  const { Component, pageProps } = props
  console.debug(`component#({ Component: ${Component.displayName}, pageProps: ${JSON.stringify(pageProps)} })`)
  console.debug(props.router.asPath, "PATH")
  return <Component {...pageProps} />
}

export default MyApp
