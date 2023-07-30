import { contentCommentValidation } from './../midlewares/post-validation';
import { Request, Response, Router } from "express";
import { authMiddleware } from "../midlewares/auth-middleware";
import { commentsService } from "../domain/comments-service";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id',
    async (req: Request, res: Response) => {
        let commentId = await commentsService.findCommentById(req.params.id)
        if (commentId === null) {
            res.sendStatus(404)
        }
        else {
            res.status(200).send(commentId)
        }
    }
)

commentsRouter.put('/:commentsId',
    authMiddleware,
    contentCommentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        if (!req.user) { return res.sendStatus(404) }

        const commentsId = req.params.commentsId
        const userId = req.user._id.toString()
        const content = req.body.content
        let resultContent = await commentsService.updateContent(userId, commentsId, content)
        if (resultContent === false) {
            res.sendStatus(403)
        }
        if (resultContent === true) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }

)

commentsRouter.delete('/:commentsId',
    authMiddleware,
    async (req: Request, res: Response) => {
        if (!req.user) { return res.sendStatus(404) }

        const commentsId = req.params.commentsId
        const userId = req.user._id.toString()

        const result = await commentsService.deleteCommentById(commentsId, userId)
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
)

