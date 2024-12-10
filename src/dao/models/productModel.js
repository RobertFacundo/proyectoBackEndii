import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    stock: {  // Agregar el campo stock
        type: Number,
        required: true,
        default: 1  // Valor por defecto en caso de no especificarse
    }
});

export default mongoose.model('Product', productSchema);