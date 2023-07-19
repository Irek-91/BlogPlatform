"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationFromQueryUser = void 0;
const getPaginationFromQueryUser = (query) => {
    const defaultValuesUsers = {
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageNumber: 1,
        pageSize: 10,
        searchLoginTerm: '',
        searchEmailTerm: '',
        skip: 0
    };
    if (query.sortBy) {
        defaultValuesUsers.sortBy = query.sortBy;
    }
    ;
    if (query.sortDirection) {
        defaultValuesUsers.sortDirection = query.sortDirection;
    }
    if (query.pageNumber) {
        defaultValuesUsers.pageNumber = +query.pageNumber;
    }
    if (query.pageSize) {
        defaultValuesUsers.pageSize = +query.pageSize;
    }
    if (query.searchLoginTerm) {
        defaultValuesUsers.searchLoginTerm = query.searchLoginTerm;
    }
    if (query.searchEmailTerm) {
        defaultValuesUsers.searchEmailTerm = query.searchEmailTerm;
    }
    defaultValuesUsers.skip = (defaultValuesUsers.pageNumber - 1) * defaultValuesUsers.pageSize;
    return defaultValuesUsers;
};
exports.getPaginationFromQueryUser = getPaginationFromQueryUser;
