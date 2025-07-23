const service = require('./auth.service');

exports.signup = async(req , res, next)=>{
    try{
        const result = await service.signup(req.body);
        res.json(result);
    } catch (e){next(e);}
};


exports.login = async(req , res, next)=>{
    try{
        const result = await service.login(req.body);
        res.json(result);
    } catch (e){next(e);}
};

exports.me = async (req,res)=>{
    res.json(req.user);
};