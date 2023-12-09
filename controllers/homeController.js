exports.home = (req,res)=>{
  res.status(200).json({
    success:true,
    message:"this is dummy route"
  })
}
