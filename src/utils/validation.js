import { param, body } from 'express-validator'

const validation = {
    signupVisitor: [
        body('username')
            .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
            .trim()
            .escape(),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/\d/).withMessage('Password must contain a number')
            .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
            .matches(/[@#\\[\]()]/).withMessage('Password must contain at least one of @#[]()')
            .trim()
            .escape(),
    ]
};

export default validation;