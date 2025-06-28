import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router=Router();


router.route("/register").post(
    upload.fields([
                {
                    name:"avatar",
                    maxCount:1
                },
                {
                    name:"coverImage",
                    maxCount:1
                }        

    ])
    ,registerUser)

export default router;    // export default tb hi de skte hai jb hum khii pr mn chaha import ka name use kr rhe ho jese:-import userRoute from "user.controler"  ,vrma currly brCKET DETE HAIS