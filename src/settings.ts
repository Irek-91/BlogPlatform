export const settings = {
    DB_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '456',
    MAIL_URL_USER: process.env.EMAIL,
    MAIL_URL_PASS: process.env.EMAIL_PASS
}