import jwt from "jsonwebtoken";

const genToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
};

export default genToken;

