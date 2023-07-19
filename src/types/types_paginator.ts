import { blogOutput, postOutput } from "./types-db"
import { userViewModel } from "./user"

export type paginatorBlog = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: blogOutput[]
}

export type paginatorPost = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: postOutput[]
}

export type paginatorUser = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: userViewModel[]
}