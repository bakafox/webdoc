import { Navigate, Route, Routes } from 'react-router-dom'

import './styles.css'

import Layout from './layout'
import AbstractPanel from './panels/AbstractPanel'
import DescriptionPanel from './panels/DescriptionPanel'
import ConclusionPanel from './panels/ConclusionPanel'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="abstract" element={<AbstractPanel />} />
                <Route path="description" element={<DescriptionPanel />} />
                <Route path="conclusion" element={<ConclusionPanel />} />

                <Route index element={<Navigate to="/abstract" />} />
            </Route>
        </Routes>
    )
}

export default App
