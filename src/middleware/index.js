exports.checkCsrfError = (err, req, res, next) => {
    if(err) {
        console.log('checkCsrfError - middlewareGlobal');
        req.flash('errors', ['Infelizmente tivemos algum problema... :(']);
        req.session.save(() => res.redirect('/'));
        return;
    };
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};

exports.loginRequired = (req, res, next) => {
    if(!req.session.user) {
        console.log('loginRequired - middlewareGlobal');
        req.flash('errors', ['Você precisa estar logado... :(']);
        req.session.save(() => res.redirect('/'));
        return;
    }
    next();
}