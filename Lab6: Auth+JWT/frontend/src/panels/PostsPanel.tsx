import type { Post } from "../types"
import type { AxiosError } from "axios"

import { useEffect, useState } from "react"
import axios from 'axios'
import { getToken } from "../token"

import MsgBox from "../components/MsgBox"
import PostCard from "../components/PostCard"

function PostsPanel() {
    const [getPosts, setPosts] = useState<Post[] | null>(null)
    const [getCount, setCount] = useState<number>(0)
    const [getErrText, setErrText] = useState<string | null>(null)

    async function loadPosts() {
        try {
            const data = await axios.get(
                '/posts',
                {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                }
            )
            const posts: Post[] = data.data
            
            setPosts(posts)
            setCount(posts.length)
        }
        catch (e) {
            const errData = (e as AxiosError<{ error: string }, string>).response?.data?.error || `${e}`
            setErrText(errData)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    return (
        <div className="posts">
            <h1>Умные мысли Осаки!</h1>

            {!!getPosts && (
                <>
                    <h3>Количество постов: {getCount}</h3>

                    <input type="range" min={1} max={getPosts.length}
                        value={getCount} onChange={(e) => setCount(+e.target.value)}
                    />
                </>
            )}

            <div className="posts__inner">
                {
                    getPosts === null ? (
                        <MsgBox msg={{
                            variant: getErrText ? 'error' : 'regular',
                            text: getErrText ? getErrText : 'Загрузка!!! ^__^ МЯЯЯЯ',
                        }}
                        />
                    ) : (
                        [...getPosts].reverse().slice(0, getCount).map(post => (
                            <PostCard post={post} key={post.id} />
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default PostsPanel
