import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const passwordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);