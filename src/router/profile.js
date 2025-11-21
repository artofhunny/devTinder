const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditData } = require("../utils/validation");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
    
    const user = req.user;
    
    try {
        res.send(user);

    }
    catch(err){
        res.send("Error : " + err.message);
    }

});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditData(req)){
            throw new Error("Error while validation");
        }

        const signinData = req.user;

        Object.keys(req.body).forEach(key => 
            signinData[key] = req.body[key] 
        );

        await signinData.save();
        res.json({
            message: "Data edit successfully",
            data: signinData,
        });
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

module.exports = router;