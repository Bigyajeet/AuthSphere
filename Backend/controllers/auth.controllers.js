const googleLogin = async (req, res) => {
    try{
        return res.status(200).json({
            message:"Google login successful",
            body:req.body
        });

    }catch(error){
      return  res.status(500).json({
        message:"Something went wrong while google login",
        error:error.message
    });
    }
}