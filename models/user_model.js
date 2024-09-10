import mongoose from "mongoose";
import bcrypt from "bcrypt"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{ type: mongoose.Schema.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true,
    }
)
// Hash the password before saving
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    if (this.isModified('password')) {  // hash only if password is new or modified
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})
// Method to compare passwords
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000 // 10 minute
    return resetToken

}


export default mongoose.model("user", userSchema)