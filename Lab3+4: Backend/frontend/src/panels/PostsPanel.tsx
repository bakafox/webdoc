import type { Post } from "../types"

import { useEffect, useState } from "react"
import axios from 'axios'

import MsgBox from "../components/MsgBox"
import PostCard from "../components/PostCard"

function PostsPanel() {
    const [getPosts, setPosts] = useState<Post[] | null>(null)
    const [getCount, setCount] = useState<number>(0)
    const [getErrText, setErrText] = useState<string | null>(null)

    async function loadPosts() {
        try {
            const json = await fetch('http://localhost:8000/posts')
            const data = await json.json()

            setPosts(data)
        }
        catch (e) {
            setErrText(`${e}`)
        }
    }

    async function loadPostsUsingAxios() {
        try {
            const data = await axios.get('/posts')
            // console.log(data)
            setPosts(data.data)
            setCount(data.data.length)
        }
        catch (e) {
            setErrText(`${e}`)
        }
    }

    useEffect(() => {
        // loadPosts()

        // loadPostsUsingAxios()

        setPosts([{ id: 1, title: '1' },{ id: 2, title: '2', body: 'чипсы' }])
        setCount(2)
    }, [])

    return (
        <div className="posts">
            <h1 id='welcome'>Умные мысли Осаки!</h1>

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
                    getErrText !== null ? (
                        <MsgBox variant="error" text={getErrText} />
                    ) : (
                        getPosts === null ? (
                            <MsgBox variant="regular" text='Загрузка!!! ^__^ МЯЯЯЯ' />
                        ) : (
                            [...getPosts].slice(0, getCount).reverse().map(post => (
                                <PostCard post={post} key={post.id} />
                            ))
                        )
                    )
                }
            </div>
        </div>
    )
}

export default PostsPanel
