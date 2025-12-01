import type { Post } from "../types"

function PostCard({ post }: { post : Post }) {
    return (
        <div className="post-card">
            <section className="post-card__title">
                <h3>{ post.title }</h3> <small>#{ post.id }</small>
            </section>

            { !!post.body && (
                <section className="post-card__body">
                    <hr />
                    <p>{ post.body }</p>
                </section>
            )}
        </div>
    )
}

export default PostCard
