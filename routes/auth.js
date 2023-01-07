const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { request } = require('express');
const { response } = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const {JWT_SECRET,MONGOURI,PORT} = require('../config/keys');
// require('dotenv').config({path:''});
// console.log(process.env.JWT_SECRET)

//below kaisa hai ki app.use('/api/auth',require('./routes/auth')); ye jo hai isme 
//diya hai ki if api/auth hoaga to below function run kro below api
//iseme ye hai ki api/auth ke bad kuch bi url ayga wo idr below api run  karvayfa
//below ye kisamko api/auth aise chode d to below run hoaga function usme dekho sirf / hai


//ROUTE 1: create a user using post /api/auth/createuser//

router.post('/createuser',
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('Password', 'Password must be atleast 5 characters long').isLength({ min: 5 }),

    async (req, res) => {
        let success = false;
        //if there aee errors return bad request

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }
        //check if the user with the same email already exists//
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).send({success, error:"Sorry a user with this Email already exists"});
            }

            //encrypting our data in hash in database 
            const saltRounds = 10;
            const generateSalt = await bcrypt.genSalt(saltRounds);
            const securedPassword = await bcrypt.hash(req.body.Password, generateSalt);

            //create a new User
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                Password: securedPassword
               
            });

            //giving token to user which contains name,email,pass to retrieve from Id 
            const data = {
                user: {
                    id: user.id
                }
            }//this is our payload wich we will give to user i.e payload ko apun body bhi bolste hai 

            const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(jwtData);//
            success = true;
            res.json({ success,authToken });
        }
        catch (err) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }

        //await krke hum uske resolve hone ka intejar krte hai kyuki uspe depend hai aage ka code //
        //asycn await mtlb ky ki hum rok dere hai execution ko mtlb hum keh rhe ki bhai ki phle ye hoga pghir ye hoga means ki bhai samjo variable
        // a , b , c hai and samjo variable d banane ke liye C ki jarurat hai to isme apun await krte hai value lete hai(mtlb promise resolve(fulfill) hota) phir hi aage badte hai uska value leke use krte hai

        //await dekte hi boleaga ruko isko reolve hone do promsie ko
        //ye isme await ky krta hai phle execution ko ruka deta hai n uska value aane deta hai sath hi sath upar ka validation code 
        //bhi chl gya hai to jaise hi usrr ka create hua turant validate hoga ki name ye sab sahi hai ky and then  return


        //above me js ky krta hai ki phle user create hoga na to create kene ke bad hi usko validate kr payge isly wo user.create await krta hai and phle khud resolve hota hai
    });


//ROUTE 2: Authenticate a user using POST /api/auth/Login
//Login API
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('Password', 'Password Cannot be blank').exists(),
],
    async (req, res) => {
        let success = false;
        //if there aee errors return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //If not we will get email and password from the user when he logs in
        const email = req.body.email;
        const Password = req.body.Password;
        try {
            const user = await User.findOne({ email });

            if (!user) {
                success = false;
                return res.status(400).json({ error: "Please enter valid Credentials to Login" });
            }
            //we are comparing the password of the user with the password which is stored in database in hash form
            const passwordCompare = await bcrypt.compare(Password, user.Password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({success, error: "Please enter valid Credentials to Login" });
            }
            //sending auth token 
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            // console.log(jwtData);//
            success = true;
            res.json({ success,authToken });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    });


//ROUTE 3 : gET logged in user details using POST /api/auth/getUser (Login required)
router.post('/getUser',fetchuser,

    async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-Password");
            res.send(user);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");

        }
        
    });

    
module.exports = router;