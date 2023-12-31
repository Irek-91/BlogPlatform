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
exports.PostsService = void 0;
class PostsService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    findPost(paginationQuery, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.findPost(paginationQuery, userId);
        });
    }
    findPostsBlogId(paginationQuery, blogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.findPostsBlogId(paginationQuery, blogId, userId);
        });
    }
    getPostId(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.getPostId(id, userId);
        });
    }
    deletePostId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.deletePostId(id);
        });
    }
    createdPostBlogId(title, shortDescription, content, blogId, blogName) {
        return __awaiter(this, void 0, void 0, function* () {
            const creatPost = yield this.postRepository.createdPostId(title, shortDescription, content, blogId, blogName);
            return creatPost;
        });
    }
    updatePostId(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            //100
            const post = yield this.postRepository.getPostById(id);
            if (!post) {
                throw new Error('not found');
            }
            if (!post)
                return false;
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            //post.addLike()
            yield this.postRepository.savePost(post);
            //0
            return true;
            //return await this.postRepository.updatePostId(id, title, shortDescription, content, blogId)
        });
    }
    updateLikeStatusPostId(postId, userId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.updateLikeStatusPostId(postId, userId, likeStatus);
        });
    }
    deletePostAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.deletePostAll();
        });
    }
}
exports.PostsService = PostsService;
