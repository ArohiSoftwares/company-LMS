import { Schema, model } from "mongoose";

const LectureSchema = new Schema({
	
	lectureName: {
		type: String,
	},

    lectureCode: {
        type: String,
        
    },
	
    courseCode: {
        type: String,
        
    },

	lectureDescription: {
		type: String,
	},
	
	lectureImage: {
		type: String,
		
	},

    doubts: [{
        type: String,
        default: '',
    }],

    attachments: [{
        type: String,
        default: '',
    }],

    rating: {
        type: Number,
    },

    teacherEmail: {
        type: String,
        default: '',
    },

    videoLink: {
		public_id :{
			type: String,
		},

		private_url: {
			type: String,
		}
	},


});
 
export const Lecture = model('Lecture', LectureSchema);