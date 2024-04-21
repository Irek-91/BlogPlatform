import { Request, Response, Router } from "express";
import { CommentsService } from "../domain/comments-service";

export class CommentsController {
    constructor(protected commentsService: CommentsService) { }
    async findCommentById(req: Request, res: Response) {
        const { userId } = req

        let commentId = await this.commentsService.findCommentById(req.params.id, userId)
        if (commentId === null) {
            return res.sendStatus(404)
        }

        else {
            res.status(200).send(commentId)
        }
    }

    async updateCommentId(req: Request, res: Response) {
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

    async updateStatusByCommentId(req: Request, res: Response) {
        if (!req.user) { return res.sendStatus(401) }
        const commentId = req.params.commentsId
        const userId = req.user._id.toString()
        const likeStatus = req.body.likeStatus

        const resultUpdateLikeStatusCommen = await this.commentsService.updateLikeStatus(commentId, userId, likeStatus)
        if (resultUpdateLikeStatusCommen) {
            return res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }

    async deleteCommentById(req: Request, res: Response) {
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
