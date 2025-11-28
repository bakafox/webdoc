import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'

import App from './App'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

// StrictMode выключен, чтобы не было двойных активаций эндпоинтов в CustomPagePanel
root.render(
    <BrowserRouter>
        {/* <StrictMode> */}
            <App />
        {/* </StrictMode> */}
    </BrowserRouter>
)
