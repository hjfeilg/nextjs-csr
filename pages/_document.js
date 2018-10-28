import Document, { Head, Main } from 'next/document'
import NextScript from '../component/NextScript'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      clientSideScript: ctx.req ? ctx.req.clientSideScript : '',
    }
  }

  render() {
    const { clientSideScript } = this.props
    return (
      <html>
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript clientSideScript={clientSideScript} />
        </body>
      </html>
    )
  }
}
