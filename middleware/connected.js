export default (req, res, next) => {
    req.session.token === '' ? res.render("page/login", {error: "connected"}) : next()
}