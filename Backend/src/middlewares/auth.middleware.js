import jwt from 'jsonwebtoken';

export const authArtist = (req, res, next) =>{

    const token = req.cookies.token;

    if(!token) return res.status(401).json({
        message:" Unauthorized"
    })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist") return res.status(403).json({
        message: "You are not authorized to perform this action. Only artists can perform this action."

        })

        req.user = decoded;
        
        next();
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}



export const authUser = (req, res, next) => {

    const token = req.cookies.token;

    if(!token) return res.status(401).json({
        message:"Unauthorized"
    })

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== 'user' && decoded.role !== 'artist') return res.status(403).json({
            message: "You are not authorized to perform this action. Only users and artists can perform this action."
        })
        
        req.user = decoded;

        next();
        
    } catch (err) {

        return res.status(401).json({
            message: "Unauthorized"
        })
        
    }
    
}