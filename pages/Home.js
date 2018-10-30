const makeCSR = () => {
  document.cookie = 'token=123456'
  location.reload()
}

const makeSSR = () => {
  document.cookie = 'token='
  location.reload()
}

export default () => (
  <div>
    <div>Welcome to next.js! Now this is Home!!</div>
    <div>See source code for detail.</div>
    <div><a href='#' onClick={makeCSR}>CSR</a>{' '}<a href='#' onClick={makeSSR}>SSR</a></div>
  </div>
)

