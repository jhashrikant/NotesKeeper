const jwt = require('jsonwebtoken');
const JWT_SECRET = "shrikantisagoodboy";


const fetchuser = (req ,res,next) => {
    //get the user from the jwt token and add it to req object

    const token = req.header('auth-token');//hum token apne header se leke aare hai jaha uska naam auth-token rkha hai//
    if (!token) {
        res.status(401).send({error: "please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;//yaha hume user miljayga //
        console.log(req.user);
        next();
        
    } catch (error) {
        res.status(401).send({error: "please authenticate using a valid token"});
        
    }
}

module.exports = fetchuser;