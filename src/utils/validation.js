const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email address");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
}

const validateEditData = (req) => {
    const ALLOW_UPDATES = [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "gender",
        "photoUrl"
    ];

    const isEditAllowed = Object.keys(req.body).every(key => 
        ALLOW_UPDATES.includes(key)
    );

    return isEditAllowed;
}

module.exports = {
    validateSignupData,
    validateEditData,
}