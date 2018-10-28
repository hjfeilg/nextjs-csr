import App, { Container } from 'next/app'
import Router from '../route'
import * as React from 'react'

const checkSSR = (ctx) => {
  /*
  if (ctx && ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
    if (/token=[a-zA-Z0-9]/.test(ctx.req.headers.cookie)) {
      return false
    }
  }
  return true
  */
  return false
}

export default class MyApp extends App {

  static async getInitialProps ({ Component, ctx, ...props }) {

    let pageProps = {}
    let ssr = false

    if (!process.browser && checkSSR(ctx) && Component.getInitialProps) {
      ssr = true
      pageProps = await Component.getInitialProps(ctx)
    }

    return {
      pageProps,
      ssr
    }
  }


  render () {
    const { Component, pageProps, ssr } = this.props

    if (!ssr && !process.browser) {
      return <Container><div /></Container>
    }

    return (
      <Container>
        <Component pageContext={this.pageContext} {...pageProps} />
      </Container>
    )
  }
}
