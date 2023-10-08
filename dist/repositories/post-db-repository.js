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
exports.PostRepository = void 0;
const mongodb_1 = require("mongodb");
const db_mongoos_1 = require("../db/db-mongoos");
class PostRepository {
    findPost(paginationQuery, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_mongoos_1.PostsModelClass.find({}).
                sort([[paginationQuery.sortBy, paginationQuery.sortDirection]]).
                skip(paginationQuery.skip).
                limit(paginationQuery.pageSize);
            const totalCount = yield db_mongoos_1.PostsModelClass.countDocuments();
            const pagesCount = Math.ceil(totalCount / paginationQuery.pageSize);
            const postsOutput = yield Promise.all(posts.map((b) => __awaiter(this, void 0, void 0, function* () {
                let myStatus = 'None';
                if (userId) {
                    const status = yield db_mongoos_1.LikesPostsClass.findOne({ userId, postId: b._id.toString() });
                    if (status) {
                        myStatus = status.status;
                    }
                }
                const newestLikes = yield db_mongoos_1.LikesPostsClass.find({ postId: b.id, status: 'Like' }).sort({ createdAt: 1 }).limit(3).lean();
                const newestLikesMaped = newestLikes.map((like) => {
                    return {
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: like.login
                    };
                });
                return {
                    id: b._id.toString(),
                    title: b.title,
                    shortDescription: b.shortDescription,
                    content: b.content,
                    blogId: b.blogId,
                    blogName: b.blogName,
                    createdAt: b.createdAt,
                    extendedLikesInfo: {
                        likesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Like' }),
                        dislikesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Dislike' }),
                        myStatus: myStatus,
                        newestLikes: newestLikesMaped
                    }
                };
            })));
            return {
                pagesCount: pagesCount,
                page: paginationQuery.pageNumber,
                pageSize: paginationQuery.pageSize,
                totalCount: totalCount,
                items: postsOutput
            };
        });
    }
    findPostsBlogId(paginationQuery, blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { blogId: blogId };
                const posts = yield db_mongoos_1.PostsModelClass
                    .find(filter)
                    .sort([[paginationQuery.sortBy, paginationQuery.sortDirection]])
                    .skip(paginationQuery.skip)
                    .limit(paginationQuery.pageSize)
                    .lean();
                const totalCount = yield db_mongoos_1.PostsModelClass.countDocuments(filter);
                const pagesCount = Math.ceil(totalCount / (paginationQuery.pageSize));
                const postsOutput = yield Promise.all(posts.map((b) => __awaiter(this, void 0, void 0, function* () {
                    let myStatus = 'None';
                    if (userId) {
                        const status = yield db_mongoos_1.LikesPostsClass.findOne({ userId, postId: b._id.toString() });
                        if (status) {
                            myStatus = status.status;
                        }
                    }
                    const newestLikes = yield db_mongoos_1.LikesPostsClass.find({ postId: b._id.toString(), status: 'Like' }).sort({ createdAt: 1 }).limit(3).lean();
                    const newestLikesMaped = newestLikes.map((like) => {
                        return {
                            addedAt: like.createdAt,
                            userId: like.userId,
                            login: like.login
                        };
                    });
                    return {
                        id: b._id.toString(),
                        title: b.title,
                        shortDescription: b.shortDescription,
                        content: b.content,
                        blogId: b.blogId,
                        blogName: b.blogName,
                        createdAt: b.createdAt,
                        extendedLikesInfo: {
                            likesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Like' }),
                            dislikesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: b._id.toString(), status: 'Dislike' }),
                            myStatus: myStatus,
                            newestLikes: newestLikesMaped
                        }
                    };
                })));
                return {
                    pagesCount: pagesCount,
                    page: paginationQuery.pageNumber,
                    pageSize: paginationQuery.pageSize,
                    totalCount: totalCount,
                    items: postsOutput
                };
            }
            catch (e) {
                return false;
            }
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const post = await PostsModelClass.findOne({_id: id})
            return db_mongoos_1.PostsModelClass.findOne({ _id: id });
        });
    }
    savePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield post.save();
        });
    }
    getPostId(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) }).lean();
                if (!post) {
                    return false;
                }
                let myStatus = 'None';
                if (userId) {
                    const user = yield db_mongoos_1.UsersModelClass.findOne({ _id: new mongodb_1.ObjectId(userId) });
                    const userStatus = yield db_mongoos_1.LikesPostsClass.findOne({ postId: id, userId: userId });
                    if (userStatus) {
                        myStatus = userStatus.status;
                    }
                }
                return {
                    id: post._id.toString(),
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: id, status: 'Like' }),
                        dislikesCount: yield db_mongoos_1.LikesPostsClass.countDocuments({ postId: id, status: 'Dislike' }),
                        myStatus: myStatus,
                        newestLikes: post.extendedLikesInfo.newestLikes
                    }
                };
            }
            catch (e) {
                return false;
            }
        });
    }
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!postInstance) {
                return false;
            }
            yield postInstance.deleteOne();
            return true;
        });
    }
    createdPostId(title, shortDescription, content, blogId, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (blogName == false || blogName == true) {
                return false;
            }
            const newPostId = new mongodb_1.ObjectId();
            const createdAt = new Date().toISOString();
            const newPost = {
                _id: newPostId,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blogName,
                createdAt: createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                }
            };
            const postInstance = new db_mongoos_1.PostsModelClass(newPost);
            yield postInstance.save();
            return {
                id: postInstance._id.toString(),
                title: postInstance.title,
                shortDescription: postInstance.shortDescription,
                content: postInstance.content,
                blogId: postInstance.blogId,
                blogName: postInstance.blogName,
                createdAt: postInstance.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                }
            };
        });
    }
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            //const postInstance = await PostsModelClass.updateOne({_id: new ObjectId(id)}, {$set: {title , shortDescription, content, blogId}})    
            const postInstance = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!postInstance)
                return false;
            postInstance.title = title;
            postInstance.shortDescription = shortDescription;
            postInstance.content = content;
            postInstance.save();
            return true;
        });
    }
    updateLikeStatusPostId(postId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdAt = (new Date()).toISOString();
                const loginResult = yield db_mongoos_1.UsersModelClass.findOne({ _id: new mongodb_1.ObjectId(userId) });
                const login = loginResult.accountData.login;
                const resultLikeStatus = yield db_mongoos_1.LikesPostsClass.findOne({ userId: userId, postId: postId, status: likeStatus });
                if (resultLikeStatus) {
                    return true;
                }
                yield db_mongoos_1.LikesPostsClass.updateOne({ userId: userId, postId: postId }, { $set: { login: login, status: likeStatus, createdAt: new Date().toISOString() } }, { upsert: true });
                // const likeInstance = new LikesPostsClass()
                // likeInstance._id = new ObjectId()
                // likeInstance.userId = userId
                // likeInstance.createdAt = createdAt
                // likeInstance.login = login!.accountData.login
                // likeInstance.postId = postId
                // likeInstance.status = likeStatus
                // likeInstance.save()
                const post = yield db_mongoos_1.PostsModelClass.findOne({ _id: new mongodb_1.ObjectId(postId) });
                const newestLikes = yield db_mongoos_1.LikesPostsClass.find({ postId: postId, status: 'Like' })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .lean();
                const newestLikesMaped = newestLikes.map((like) => {
                    return {
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: like.login
                    };
                });
                post.extendedLikesInfo.newestLikes = newestLikesMaped;
                // if (likeStatus === 'Like') {
                //     const newLike = {addedAt: createdAt,
                //         userId: userId,
                //         login: login!.accountData.login}
                //     if (post!.extendedLikesInfo.newestLikes.length < 3) {
                //         post!.extendedLikesInfo.newestLikes.unshift(newLike)
                //     } else {
                //         post!.extendedLikesInfo.newestLikes.pop()
                //         post!.extendedLikesInfo.newestLikes.unshift(newLike)
                //     }
                // }
                post.save();
                return true;
            }
            catch (e) {
                return null;
            }
        });
    }
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const postInstance = yield db_mongoos_1.PostsModelClass.deleteMany({});
            if (!postInstance) {
                return false;
            }
            return true;
        });
    }
}
exports.PostRepository = PostRepository;
