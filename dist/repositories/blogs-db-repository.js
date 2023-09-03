"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
exports.blogsRepository = {
    findBlogs(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield db_mongoos_1.BlogsModelClass.
                find({ name: { $regex: pagination.searchNameTerm, $options: 'i' } }).
                sort([[pagination.sortBy, pagination.sortDirection]]).
                skip(pagination.skip).
                limit(pagination.pageSize).
                lean();
            const totalCount = yield db_mongoos_1.BlogsModelClass.countDocuments({ name: { $regex: pagination.searchNameTerm, $options: 'i' } });
            const blogsOutput = blogs.map((b) => {
                return {
                    id: b._id.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: b.isMembership,
                };
            });
            return {
                pagesCount: Math.ceil(totalCount / pagination.pageSize),
                page: pagination.pageNumber,
                pageSize: pagination.pageSize,
                totalCount: totalCount,
                items: blogsOutput
            };
        });
    },
    getBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blog = yield db_mongoos_1.BlogsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) }).lean();
                if (!blog)
                    return false;
                return {
                    id: blog._id.toString(),
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt,
                    isMembership: false,
                };
            }
            catch (e) {
                return false;
            }
        });
    },
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_mongoos_1.BlogsModelClass.insertMany(Object.assign({}, newBlog));
        });
    },
    updateBlog(name, description, websiteUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const query = BlogsModelClass.where({_id: new ObjectId(id)})
                const blogsInstance = yield db_mongoos_1.BlogsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!blogsInstance) {
                    return false;
                }
                else {
                    blogsInstance.name = name;
                    blogsInstance.description = description;
                    blogsInstance.websiteUrl = websiteUrl;
                    yield blogsInstance.save();
                    return true;
                }
                //const blog = await BlogsModelClass.updateOne({_id: new ObjectId(id)}, {$set: {name , description, websiteUrl}})
                //return blog.matchedCount === 1
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteBlogId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogsInstance = yield db_mongoos_1.BlogsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!blogsInstance)
                    return false;
                yield blogsInstance.deleteOne();
                return true;
                //const deletResult = await BlogsModelClass.deleteOne({_id: new ObjectId(id)})
                //return deletResult.deletedCount === 1
            }
            catch (e) {
                return false;
            }
        });
    },
    deleteBlogAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogsInstance = yield db_mongoos_1.BlogsModelClass.deleteMany({});
                if (!blogsInstance)
                    return false;
                return true;
                //const deletResult = await blogsCollections.deleteMany({})
                //return true
            }
            catch (e) {
                return false;
            }
        });
    }
};
