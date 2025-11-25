import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import './styles.css'

import Layout from './layout'
import WelcomePanel from './panels/WelcomePanel'
import PostsPanel from './panels/PostsPanel'
import InvertPanel from './panels/InvertPanel'
import StasPanel from './panels/StasPanel'
import CustomPagePanel from './panels/CustomPagePanel'

axios.defaults.baseURL = process.env.BACKEND_ROOT || 'http://localhost:8000'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<WelcomePanel />} />

                {/* <Route path="abstract" element={<AbstractPanel />} />
                <Route path="description" element={<DescriptionPanel />} />
                <Route path="conclusion" element={<ConclusionPanel />} />
                <Route path="api" element={<ApiPanel />} /> */}
                <Route path="posts" element={<PostsPanel />} />
                <Route path="invert" element={<InvertPanel />} />
                <Route path="stas" element={<StasPanel />} />

                <Route path=":pid" element={<CustomPagePanel />} />
            </Route>
        </Routes>
    )
}

export default App
