export type blogType = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
  }
 

export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

 
export type errorType = {
    message: string,
    field: string
    }

