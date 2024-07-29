import { param, body } from 'express-validator'

const validation =
    [
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
            .trim(),
        body('email')
            .isEmail().withMessage('Invalid email address'),
        body('contact_num')
            .isMobilePhone('en-PH').withMessage('Invalid contact number'),
    ]



export default validation;