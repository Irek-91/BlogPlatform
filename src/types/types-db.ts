import { ObjectId } from "mongodb";

export type postInput = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type postInputModel = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
}

export type postsCollectionsType = postOutput[];
export type blogsCollectionsType = blogOutput[];

export class PostMongoDb {
  constructor(public _id: ObjectId,
              public title: string,
              public shortDescription: string,
              public content: string,
              public blogId: string,
              public blogName: string,
              public createdAt: string)
  {}

}

export type postMongoDb = {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
};
export type postOutput = {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
}

export class BlogMongoDB {
  constructor(
    public _id: ObjectId,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean) 
    {}
}

export type blogMongoDB = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
  }
  export type blogOutput = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
  }

export type blogInput = {
    name: string,
    description: string,
    websiteUrl: string,
  }


