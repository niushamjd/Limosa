import mongoose from "mongoose";

const interestSchema = new mongoose.Schema({
    interestName: {
        type: String,
        required: true,
    },
    interestPhoto: {
        type: String,
        required: false,
    }
    });

export default mongoose.model("Interest", interestSchema);
