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

    if (isNaN(query.searchNameTerm)) defaultValues.searchNameTerm = query.searchNameTerm
    if (query.sortBy) defaultValues.sortBy = query.sortBy
    if (query.sortDirection) defaultValues.sortDirection = query.sortDirection
    if (Number.isInteger(+query.pageNumber) && +query.pageNumber> 0 && isNaN(query.pageNumber)) defaultValues.pageNumber = +query.pageNumber
    if (Number.isInteger(query.pageSize) && +query.pageSize > 0 && isNaN(query.pageSize)) defaultValues.pageSize = +query.pageSize
    if (query.skip) defaultValues.skip = (defaultValues.pageNumber -1)*defaultValues.pageSize
    return defaultValues
  }
