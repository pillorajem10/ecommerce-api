exports.userSignupValidator = (req, res, next) => {

    req.check('fname', 'First Name is required').notEmpty();
    req.check('uname', 'Username is required').notEmpty();
    req.check('lname', 'Last Name is required').notEmpty();
    req.check('email', 'Email must be between 8 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 8,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 8, max: 32 })
        .withMessage('Password must be between 8 to 32 characters')
        .matches(/^(?=.*\d)(?=.*[a-z])[a-zA-Z\d@$.!%*#?&]/)
        .withMessage('Password must contain a number and letter');
    req.checkBody('password2','Password and Confirm password didnt match.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};
