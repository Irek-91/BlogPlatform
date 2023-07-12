import {postsCollectionsType } from "../types/types-db"

export const postsOutput = (posts :postsCollectionsType) => {
    posts.map((b) => {
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