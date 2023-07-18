export type QueryPaginationType = {
     searchNameTerm: string
     sortBy: string
     sortDirection: 'asc' | 'desc'
     pageNumber: number
     pageSize: number
     skip: number
  }
    
  export const getPaginationFromQuery = (query: any): QueryPaginationType => {
    const defaultValues: QueryPaginationType = {
      searchNameTerm: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
      skip: 0
    }

    if (query.searchNameTerm) {defaultValues.searchNameTerm = query.searchNameTerm};
    if (query.sortBy) {defaultValues.sortBy = query.sortBy};
    if (query.sortDirection) {defaultValues.sortDirection = query.sortDirection}
    if (query.pageNumber) {defaultValues.pageNumber = +query.pageNumber}
    if (query.pageSize) {defaultValues.pageSize = +query.pageSize}
    defaultValues.skip = (defaultValues.pageNumber - 1)*defaultValues.pageSize
    return defaultValues
  }
