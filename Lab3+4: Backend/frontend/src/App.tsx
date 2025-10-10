import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import './styles.css'

import Layout from './layout'
import AbstractPanel from './panels/AbstractPanel'
import DescriptionPanel from './panels/DescriptionPanel'
import ConclusionPanel from './panels/ConclusionPanel'
import PostsPanel from './panels/PostsPanel'
import InvertPanel from './panels/InvertPanel'
import ApiPanel from './panels/ApiPanel'

axios.defaults.baseURL = 'http://localhost:8000'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="abstract" element={<AbstractPanel />} />
                <Route path="description" element={<DescriptionPanel />} />
                <Route path="conclusion" element={<ConclusionPanel />} />
                <Route path="posts" element={<PostsPanel />} />
                <Route path="invert" element={<InvertPanel />} />
                <Route path="api" element={<ApiPanel />} />

                <Route index element={<Navigate to="/abstract" />} />
            </Route>
        </Routes>
    )
}

export default App
