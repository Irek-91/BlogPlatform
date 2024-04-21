import { emailValidationCustom, newPasswordValidation, passwordValidation } from '../midlewares/users_validation';
import {  Request, Response, Router } from "express";
import { loginOrEmailValidationAuth, passwordValidationAuth } from "../midlewares/aurh-validation";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { authMiddleware } from "../midlewares/auth-middleware";
import { emailValidation, loginValidation, loginValidationLength } from "../midlewares/users_validation";
import { emailAdapter } from "../application/email-adapter";
import { checkRefreshToken } from '../midlewares/chek-refreshToket';
import { filterCountIPAndURL } from '../midlewares/count-IPAndURIFilter';
import { authController } from '../composition-root';

export const authRouter = Router({});

authRouter.post('/login', filterCountIPAndURL, loginOrEmailValidationAuth, passwordValidationAuth, inputValidationMiddleware,
    authController.loginUserToTheSystem.bind(authController)
)

authRouter.post('/refresh-token', checkRefreshToken,
    authController.generateNewPairOfAccessAndRefreshTokens.bind(authController)
)

authRouter.post('/logout', checkRefreshToken,
    authController.sendCorrectRefreshTokenThatWillBeRevoked.bind(authController)
)

authRouter.get('/me', authMiddleware,
    authController.getInformationAboutCurrentUser.bind(authController)
)

authRouter.post('/registration', filterCountIPAndURL, loginValidation, emailValidationCustom, loginValidationLength,
    passwordValidation, emailValidation, inputValidationMiddleware,
    authController.codeWillBeSendToPassedEmailAddress.bind(authController)
)


authRouter.post('/registration-confirmation', filterCountIPAndURL,
    authController.confirmRegistrationCode.bind(authController)
)


authRouter.post('/registration-email-resending', filterCountIPAndURL, emailValidation, inputValidationMiddleware,
    authController.resendConfirmationRegistrationEmail.bind(authController)
)

authRouter.post('/password-recovery', filterCountIPAndURL, emailValidation, inputValidationMiddleware,
    authController.passwordRecoveryViaEmail.bind(authController)
)


authRouter.post('/new-password', filterCountIPAndURL, newPasswordValidation, inputValidationMiddleware,
    authController.confirmNewPasswordRecovery.bind(authController)
)


authRouter.post('/registration-email',
    async (req: Request, res: Response) => {
        const info = await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.code)
        res.sendStatus(204)
})
