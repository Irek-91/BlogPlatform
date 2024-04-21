import {likePostInfoShema, newestLikes} from "../types/types-posts"
import {likesTypeDB} from "../types/type-likes";

export const newestLikesMapped = (newestLikes: likesTypeDB[]) => {
    return newestLikes.map((like) => {
        return {
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login
        }
    })
}