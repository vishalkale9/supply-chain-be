import { registerUser,loginUser } from "../services/auth.service.js";

export const register = async (req,res)=>{

    try
    {
      const result= await registerUser(req.body);
      res.status(201).json({success:true,data:result});
    }catch(error)
    {
         res.status(400).json({success:false, message:error.message})
    }
};


export const login = async(req,res)=>{
    try
    {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json({ success: true, data: result });
    }catch(error)
    {
        res.status(400).json({success:false, message:error.message})
    }
}