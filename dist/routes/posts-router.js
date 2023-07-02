"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_repository_1 = require("../repositories/post-repository");
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("../midlewares/input-validation-middleware");
exports.postsRouter = (0, express_1.Router)({});
const titleValidation = (0, express_validator_1.body)('title').trim().notEmpty().isString().isLength({ max: 30 }).withMessage('error in string length');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().notEmpty().isLength({ max: 100 }).withMessage('error in shortDescription length');
const contentValidation = (0, express_validator_1.body)('content').trim().notEmpty().isString().isLength({ max: 1000 }).withMessage("error in content length");
const blogIdValidation = (0, express_validator_1.body)('blogId').trim().notEmpty().isString().withMessage("error in the content");
exports.postsRouter.get('/', (req, res) => {
    let posts = post_repository_1.postRepository.findPost();
    res.send(posts);
});
exports.postsRouter.get('/:id', (req, res) => {
    let post = post_repository_1.postRepository.getPostId(+req.params.id);
    if (post) {
        res.send(post);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.delete('/:id', (req, res) => {
    let post = post_repository_1.postRepository.deletePostId(+req.params.id);
    if (post === true) {
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.delete('/testing/all-data', (req, res) => {
    let result = post_repository_1.postRepository.deletePostAll();
    if (result === true) {
        res.sendStatus(204);
    }
});
exports.postsRouter.post('/', titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    /*
 if (!title || typeof title !== 'string' || title.length > 30) {
  apiErrorResult.push({message: 'string title length >30', field: "title"})
}

if (!shortDescription || typeof shortDescription !== 'string' || shortDescription.length > 100) {
  apiErrorResult.push({message: 'string shortDescription length > 100', field: "shortDescription"})
}

if (!content || typeof content !== 'string' || content.length > 1000) {
  apiErrorResult.push({message: 'string content length > 1000', field: "content"})
}

if (!blogId || typeof blogId !== 'string') {
  apiErrorResult.push({message: 'string', field: "blogId"})
}

if (apiErrorResult.length !== 0) {
  res.status(400).send({ errorsMessages: apiErrorResult})
  return;
}
*/
    let post = post_repository_1.postRepository.createdPostId(title, shortDescription, content, blogId);
    res.status(201).send(post);
});
exports.postsRouter.put('/:id', titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const id = +req.params.id;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogId = req.body.blogId;
    let postResult = post_repository_1.postRepository.updatePostId(id, title, shortDescription, content, blogId);
    if (postResult === true) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
