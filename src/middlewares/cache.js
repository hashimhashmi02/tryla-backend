const IOredis = require('ioredis');
const redis   = new IOredis(process.env.REDIS_URL);

module.exports = async function cache(req,res,next){
    if(req.methid !== 'GET') return next ();
    const key = req.originalUrl;
    try{
        const cached = await redis.get(key);
        if(cached){
            return res,json(JSON.parse(cached));
        }
    } catch (err){
        console.error('Redis GET error',err);
    }


 // Monkey‑patched res.json to cache the outgoing response
 
    const originalJson = res.json.bind(res);
  res.json = (body) => {
    try {
      redis.setex(key, 60, JSON.stringify(body)); // TTL 60s
    } catch (err) {
      console.error('Redis SETEX error', err);
    }
    return originalJson(body);
  };

  next();

}