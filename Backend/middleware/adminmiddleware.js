const isAdmin = (req, res, next) => {
    console.log("User:", req.user); // Debugging user object
    const user = req.user;
  
    if (user && user.role === 'admin') {
      return next();
    }
  
    res.status(403).json({ error: 'Access denied. Admins only.' });
  };
  
  export default isAdmin;
  