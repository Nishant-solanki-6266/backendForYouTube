import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponce} from "../utils/ApiResponce.js"
const registerUser=asyncHandler(async(req,res)=>{
     
    // form ,json se data hmesa req,body me hadle kiya jata hai , url ko alg se handle krte hai
       const {fullname,username,email,password}=req.body
       console.log("username:-",email);


       //validation
       if ([fullname,email,username,password].some((fields)=>
             fields?.trim()==="")
       ) {
        throw new ApiError(400,"All field are required")
       }

    //    exitedUser
    const exitedUser= await User.findOne({
        $or:[{username},{email}]
    })
    if (exitedUser) {
        throw new ApiError(409,"User with email or username already existed!")
    } 
         // multer se avatar lenaa
         const avatarLocalPath=req.files?.avatar[0]?.path;
         const coverImagePath=req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400,"avatar file is required")
        }
        //upload in  clodinary
       const avatar=await uploadOnCloudinary(avatarLocalPath)
       const coverImage=await uploadOnCloudinary(coverImagePath)

       if (!avatar) {
         throw new ApiError(400,"Avatar file is required")
       }    
  // database me create kiya user
      const user=  await User.create({
        avatar:avatar.url,
        coverImage:coverImage?.path||"",
        fullname,
        email,
        username:username.lowerCase(),
        password,
       })
      // full prrof user create hua hai or usi user ke password ko remove bhi kr do

      const createUser=await User.findById(user._id).select(
        "-password -refreshToken"
      )

      if (!createUser) {
       throw new ApiError(500,"something went wrong while registering the user") 
      }

       // return responce
       
       return res.status(201).json(
         new ApiResponce(200, createUser," User registerd successfully")
       )

})


export {registerUser}