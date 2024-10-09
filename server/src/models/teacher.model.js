import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TeacherSchema = new mongoose.Schema(
    {
        teacherFullName: {
            type: String
            // required: true,
        },

        teacherUserName: {
            type: String
            // required: true,
            // unique: true,
        },

        teacherProfile: {
            type: String
        },
        teacherProfileUrl:{
            public_id: {
                type: String
            },
            private_url: {
                type: String
            }
        },

        adminEmail: {
            type: String
        },
        teacherbio: {
            type: String
        },
        teacherAge: {
            type: Number
            // required: true,
        },

        teacherGender: {
            type: String
            // required: true,
        },

        teacherType: {
            type: String,
            enum: ['teacher'],
            default: 'teacher'
        },

        teacherCourseCode: [
            {
                type: String
            }
        ],

        teacherEmail: {
            type: String
        },

        teacherPassword: {
            type: String,
            select: false
        },

        teacherPhoneNumber: {
            type: String
            
        },

        teacherSubjects: [
            {
                type: String
            }
        ],
        teacherYearOfExperience: {
            type: Number
        },
        teacherQualifications: [
            {
                type: String
            }
        ],
        teacherAadharUrl: {
            public_id: {
                type: String
            },
            private_url: {
                type: String
            }
        },
        teacherPanCardUrl: {
            public_id: {
                type: String
            },
            private_url: {
                type: String
            }
        }

        // course: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Course',
        // }],
    },
    { timestamps: true }
);

TeacherSchema.methods = {
    generateTeacherLogin: function () {
        return jwt.sign(
            {
                id: this._id,
                teacherEmail: this.teacherEmail,
                role: 'teacher'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        );
    }
};


TeacherSchema.pre('save', function (next) {
    if (this.isModified("teacherPassword")) {
        this.teacherPassword = bcrypt.hash(this.teacherPassword, 10);
    }
    next();
});

export const Teacher = mongoose.model('Teacher', TeacherSchema);
