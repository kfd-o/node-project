import { param, body } from 'express-validator'

const validation = {
    visitorCredentials: [
        body('first_name')
            .notEmpty().withMessage("First name is required")
            .trim(),
        body('last_name')
            .notEmpty().withMessage("Last name is required")
            .trim(),
        body('username')
            .isLength({ min: 5, max: 30 }).withMessage('Username must be between 5-30 characters.')
            .trim(),
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/\d/).withMessage('Password must contain a number')
            .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
            .matches(/[@#\\[\]()]/).withMessage('Password must contain at least one of @#[]()')
            .trim(),
        body('email')
            .isEmail().withMessage('Invalid email address')
            .normalizeEmail(),
        body('contact_num')
            .isMobilePhone('en-PH').withMessage('Invalid contact number'),
    ]
};

export default validation;