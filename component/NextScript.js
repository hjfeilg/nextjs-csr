
import htmlescape from 'htmlescape'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'


export default class NextScript extends Component {
  static contextTypes = {
    _documentProps: PropTypes.any
  }

  static propTypes = {
    nonce: PropTypes.string
  }

  getDynamicChunks () {
    const { dynamicImports, assetPrefix } = this.context._documentProps
    return dynamicImports.map((bundle) => {
      return <script
        async
        key={bundle.file}
        src={`${assetPrefix}/_next/${bundle.file}`}
            nonce={this.props.nonce}
      />
    })
  }

  getScripts () {
    const { assetPrefix, files } = this.context._documentProps
    if(!files || files.length === 0) {
      return null
    }

    return files.map((file) => {
      // Only render .js files here
      if(!/\.js$/.exec(file)) {
        return null
      }

      return <script
        key={file}
        src={`${assetPrefix}/_next/${file}`}
        nonce={this.props.nonce}
        async
      />
    })
  }

  static getInlineScriptSource (documentProps) {
    const { __NEXT_DATA__ } = documentProps
    const { page, ssr } = __NEXT_DATA__
    if (!ssr) {
      __NEXT_DATA__.page = ''
      __NEXT_DATA__.query = ''
    }
    return `__NEXT_DATA__ = ${htmlescape(__NEXT_DATA__)};__NEXT_LOADED_PAGES__=[];__NEXT_REGISTER_PAGE=function(r,f){__NEXT_LOADED_PAGES__.push([r, f])}`
  }

  render () {
    const { staticMarkup, assetPrefix, devFiles, __NEXT_DATA__ } = this.context._documentProps
    const { page, buildId, ssr } = __NEXT_DATA__
    const pagePathname = getPagePathname(page)

    return <Fragment>
      {devFiles ? devFiles.map((file) => <script key={file} src={`${assetPrefix}/_next/${file}`} nonce={this.props.nonce} />) : null}
      {staticMarkup ? null : <script nonce={this.props.nonce} dangerouslySetInnerHTML={{
        __html: NextScript.getInlineScriptSource(this.context._documentProps)
      }} />}
      {
        ssr
        ?
          (page !== '/_error' && <script async={true} id={`__NEXT_PAGE__${page}`} src={`${assetPrefix}/_next/static/${buildId}/pages${pagePathname}`} nonce={this.props.nonce} />)
        :
          (this.props.clientSideScript && <script nonce={this.props.nonce} src={`${assetPrefix}${this.props.clientSideScript}`} />)
      }
      <script async id={`__NEXT_PAGE__/_app`} src={`${assetPrefix}/_next/static/${buildId}/pages/_app.js`} nonce={this.props.nonce} />
      <script async id={`__NEXT_PAGE__/_error`} src={`${assetPrefix}/_next/static/${buildId}/pages/_error.js`} nonce={this.props.nonce} />
      {staticMarkup ? null : this.getDynamicChunks()}
      {staticMarkup ? null : this.getScripts()}
    </Fragment>
  }
}

function getPagePathname (page) {
  if (page === '/') {
    return '/index.js'
  }

  return `${page}.js`
}
