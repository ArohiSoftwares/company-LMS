import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
    {
        adminEmail: {
            type: String
        },

        studentEmail: [
            {
                type: String
            }
        ],

        teacherEmail: [
            {
                type: String
            }
        ],

        courseName: {
            type: String
        },

        courseDescription: {
            type: String
        },

        courseThumbnail: {
            secure_url: {
                type: String
            },
            public_id: {
                type: String
            }
        },

        video: [
            {
                public_id: {
                    type: String
                },

                private_url: {
                    type: String
                },
                lectureName: {
                    type: String
                },
                lectureDescription: {
                    type: String
                },
                lectureImage: {
                    type: String
                }
            }
        ],

        courseThumbnail: {
            public_id: {
                type: String
            },
            private_url: {
                type: String
            }
        },

        coursePdf: [
            {
                public_id: {
                    type: String
                },
                private_url: {
                    type: String
                }
            }
        ],

        courseTests: [
            {
                public_id: {
                    type: String
                },
                private_url: {
                    type: String
                }
            }
        ],

        coursePrice: {
            type: Number
        },

        courseCode: {
            type: String,
            required: true
        },

        courseSubject: {
            type: String
        },

        courseTeacher: [
            {
                type: String
            }
        ],

        courseStartDate: {
            type: Date
        },

        courseEndDate: {
            type: Date
        },

        courseDuration: {
            type: String
        },

        courseTools: [
            {
                type: String
            }
        ],

        courseTopics: [
            {
                courseTodos: [
                    {
                        type: String
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

export const Course = mongoose.model('Course', CourseSchema);
