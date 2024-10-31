exports.yeu_cau_login = (req, res, next) => {
    if (req.session.staffLogin||req.session.adminLogin) {
        res.locals.nameStaff=req.session.nameStaff;
        res.locals.role = req.session.adminLogin;
  res.locals.permissions = req.session.staffLogin;
        next();
    } else {
        return res.redirect('/');
    }
}