import jwt from "jsonwebtoken";
export  const verifyTokenGuard=async (req,res,next) =>{

}

export const AdminUserGuard = async (req,res,next)=>{
        next();
    }