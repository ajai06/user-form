const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// register function

exports.registerAction = (req,res)=>{
    
    const { name, email, password, password2 } = req.body;

    //check fields
    if(!name || !email || !password || !password2){
        res.status(401).json({error:'Please fill all required fileds'});
    }
    
    //password match
    if(password !== password2){
        res.status(401).json({error: 'Password not matched'})
    }

    // password length
    if(password.length <8){
        res.status(401).json({error: 'Password must be atleast 8 characters'})
    }

    else {
    User.findOne({email:email})
    .then(user=>{
        if (user) {
            res.status(401).json({error: 'Email already  exists'})
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            //hash password
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{

                    if(err) throw err;
                    //set password to hash
                    newUser.password = hash;
                    //save user
                    newUser.save()
                        res.status(200).json({message: 'You are now registered!'});
                    })
                    
                })
            }
        });
    };

};

//login function

exports.loginAction = (req, res) =>{

    const {email, password} = req.body;

    //check fields
    if (!email || !password)  {
        res.status(401).json({error:'Please fill all required fileds'});
    } else {
        User.findOne({email:email})
        .then(user => {
            if (!user) {
                res.status(404).json({error : 'email is not registered'});
            }
        
        bcrypt.compare(password, user.password, (err, isMatch) =>{
            if(err) throw err;

            if (isMatch) {

                let token = jwt.sign({user}, 'kat', { expiresIn: '1h' });
                
                res.status(200).json({message: 'Login Successful!', token})
            } else {
                res.status(401).json({error: 'Password not matched'})
            }
        })      

      })
     
    };
};


// verify token

exports.verifyToken = (req,res,next) => {

    const bearerHeader = req.headers['authorization'];

    // check bearer is undefined
    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearToken = bearer[1]; 
        req.token = bearToken;        
        next(); 
    } else {
        res.status(403).json({error: 'You are not authorized to access'}); 
    }
}; 

//get user
exports.getUser = (req,res) =>{

    jwt.verify(req.token, 'kat', (err, userData) => {
        if (err) {
            res.status(403).json({error: 'You are not authorized to access'})
        } else {
            res.status(200).json({userData})
        }
    })
};
