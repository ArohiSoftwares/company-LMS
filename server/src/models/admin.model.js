import mongoose from 'mongoose';
import JWT from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({

    adminName: {
        type: String,
        // required: true,
    },

    adminUserName: {
        type: String,
        // required: true,
        // unique: true,
    },

    adminEmail: {
        type: String,
        // required: true,
        // unique: true,
    },

    adminPhoneNumber: {
        type: String,
        // required: true,
    },

    adminPassword: {
       type: String,
       required: true,
       select: false,
    },
    
    adminType: {
        type: String,
        enum: ["admin"],
        default: "admin",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    courses: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
    }],



    
}, {timestamps: true});


adminSchema.methods = {

    generateAdminLogin: function () {

        return JWT.sign(   
            {
                id: this._id,
                adminEmail: this.adminEmail,
                adminName: this.adminName,
                adminPhoneNumber: this.adminPhoneNumber,

            },

            process.env.JWT_SECRET,
            
            { expiresIn: '2h' }
        )

    }
}




export const Admin = mongoose.model('Admin', adminSchema);