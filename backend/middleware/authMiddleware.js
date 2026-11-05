const fix = (rol) =>
  String(rol || "")
    .trim()
    .toUpperCase();

export const isAuth = (req, res, next) => {
  if (!req.session?.user) {
    return res
      .status(401)
      .json({ message: "Întai trebuie să te autentifici!" });
  }
  next();
};

export const reqRole = (...roles) => {
  const allow = roles.map(fix);
  return (req, res, next) => {
    const userRole = fix(req.session?.user?.role);

    const isAdmin = userRole === "ADMIN" && allow.includes("ADMINISTRATOR");
    if (!userRole || (!allow.includes(userRole) && !isAdmin)) {
      return res
        .status(403)
        .json({ message: "Rolul tău nu are permisiunea necesară!" });
    }
    next();
  };
};
