import { refreshToken } from './../types/token-types';
import { contentCommentValidation } from './../midlewares/post-validation';
import { Request, Response, Router } from "express";
import { authMiddleware } from "../midlewares/auth-middleware";
import { CommentsService} from "../domain/comments-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { jwtService } from '../application/jwt-service';
import { likeStatusValidation, likeStatusValidation1 } from '../midlewares/like_status_validation';
import { log } from 'console';
import { ObjectId } from 'mongodb';

export const commentsRouter = Router({})

class CommentsController {
    private commentsService: CommentsService
    constructor () {
        this.commentsService = new CommentsService()
    }
    async findCommentById (req: Request, res: Response) {
    if (!req.user) { return res.sendStatus(401) }
    const userId = req.user._id.toString()

    let commentId = await this.commentsService.findCommentById(req.params.id,  userId)
        if (commentId === null) {
            return res.sendStatus(404)
        }

        else {
            res.status(200).send(commentId)
        }
    }

    async updateCommentId (req: Request, res: Response) {
        if (!req.user) { return res.sendStatus(401) }

        const commentsId = req.params.commentsId
        const userId = req.user._id.toString()
        const content = req.body.content
        let resultContent = await this.commentsService.updateContent(userId, commentsId, content)
        if (resultContent === false) {
            res.sendStatus(403)
        }
        else if (resultContent === true) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }

    async updateStatusByCommentId (req: Request, res: Response) {
        if (!req.user) { return res.sendStatus(401) }
        const commentId = req.params.commentsId
        const userId = req.user._id.toString()
        const likeStatus = req.body.likeStatus
        
        const resultUpdateLikeStatusCommen = await this.commentsService.updateLikeStatus(commentId, userId, likeStatus)
        if (resultUpdateLikeStatusCommen) {
            return res.sendStatus(204)}
        else {
            res.sendStatus(404)}
    }
    
    async deleteCommentById (req: Request, res: Response) {
        if (!req.user) { return res.sendStatus(401) }

        const commentsId = req.params.commentsId
        const userId = req.user._id.toString()

        const result = await this.commentsService.deleteCommentById(commentsId, userId)
        if (result === false) {
            res.sendStatus(403)
        }
        if (result === true) {
            res.sendStatus(204)
        }
        if (result === null) {
            res.sendStatus(404)
        }
    }

}
const commentsControllerInstance = new CommentsController()

commentsRouter.get('/:id',authMiddleware, commentsControllerInstance.findCommentById.bind(commentsControllerInstance))
commentsRouter.put('/:commentsId', authMiddleware, contentCommentValidation, inputValidationMiddleware,
                    commentsControllerInstance.updateCommentId.bind(commentsControllerInstance))
commentsRouter.put('/:commentsId/like-status', authMiddleware, likeStatusValidation1, inputValidationMiddleware,
                    commentsControllerInstance.updateStatusByCommentId.bind(commentsControllerInstance))


commentsRouter.delete('/:commentsId', authMiddleware, commentsControllerInstance.deleteCommentById.bind(commentsControllerInstance))

