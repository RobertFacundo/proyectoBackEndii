import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    }
});

//Encripta la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next()
})

//Metodo para verificar la contraseña
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default mongoose.model('User', userSchema);