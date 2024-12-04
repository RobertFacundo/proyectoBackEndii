const authorizeUser = (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || userRole !== 'user') {
        return res.status(401).json({ message: 'Acceso denegado: No tienes permiso de Usuario' })
    }
    next();
};

export default authorizeUser;