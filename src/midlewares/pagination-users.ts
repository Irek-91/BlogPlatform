export type QueryPaginationTypeUser = {
    sortBy: string
    sortDirection: 1 | -1
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
    skip: number
 }
   
 export const getPaginationFromQueryUser = (query: any): QueryPaginationTypeUser => {
   const defaultValuesUsers: QueryPaginationTypeUser = {
     sortBy: 'createdAt',
     sortDirection: -1,
     pageNumber: 1,
     pageSize: 10,
     searchLoginTerm: '',
     searchEmailTerm: '',
     skip: 0
   }
   if (query.sortBy) {defaultValuesUsers.sortBy = query.sortBy};
   if (query.sortDirection) {defaultValuesUsers.sortDirection = query.sortDirection}
   if (query.pageNumber) {defaultValuesUsers.pageNumber = +query.pageNumber}
   if (query.pageSize) {defaultValuesUsers.pageSize = +query.pageSize}
   if (query.searchLoginTerm) {defaultValuesUsers.searchLoginTerm = query.searchLoginTerm}
   if (query.searchEmailTerm) {defaultValuesUsers.searchEmailTerm = query.searchEmailTerm}
   defaultValuesUsers.skip = (defaultValuesUsers.pageNumber - 1)*defaultValuesUsers.pageSize
   
   return defaultValuesUsers
 }
