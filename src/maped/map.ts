import {postsCollectionsType } from "../types/types-posts"

export const postsOutput = (posts :postsCollectionsType) => {
    return posts.map((b) => {
        return {
            title: b.title,
            shortDescription: b.shortDescription,
            content: b.content,
            blogId: b.blogId,
            blogName: b.blogName,
            createdAt: b.createdAt,
        }
        }
    )
}