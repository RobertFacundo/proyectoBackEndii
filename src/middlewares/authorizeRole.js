const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(401).json({ message: 'Acceso denegado: No tienes permisos' })
        }
        next();
    };
};

export default authorizeRole;