import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide the name'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please Provide the email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ]
        },
        password: {
            type: String,
            required: [true, 'Please Provide the password'],
            minlength: 6,
            select: false
        },
        role:
        {
            type: String,
            enum: ['SuperAdmin', 'Supplier', 'WarehouseManager', 'Transporter', 'Buyer'],
            default: 'Buyer',
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true })

// Pre-save hook to hash password before saving to DB
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;