import { blogOutput, postOutput } from "./types-db"

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