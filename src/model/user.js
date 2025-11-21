const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
            minLength: 3,
            maxLength: 50,
        },
        lastName: {
            type: String,
        },
        emailId: {
            type: String,
            unique: true,
            require: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Enter a valid email adddress");
                }
            }
        },
        password: {
            type: String,
            require: true,
            minLength: 4,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password");
                }
            },
        },
        age: {
            type: Number,
            min: 16,
        },
        gender: {
            type: String,
            validate(value){
                if(!["male", "female", "other"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Enter a valid image url");
                }
            },
        },
        skills: {
            type: [String],
        },
        about: {
            type: String,
            default: "this is the default about of the user",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);