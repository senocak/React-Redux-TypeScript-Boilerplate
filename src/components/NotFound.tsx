import React from 'react'
import App from "./App"

function NotFound(): React.JSX.Element {
    return <>
        <App/>
        <h1> 😕 Whoops! URL var olmayan bir şeye işaret ediyor.</h1>
    </>
}
export default NotFound