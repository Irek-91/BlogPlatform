

export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}
export type newBlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  }

export type FieldValidationError = {
    type: 'field';
    location: Location;
    path: string;
    value: any;
    msg: any;
  };
export type errorType = {
    message: string,
    field: string
    }

