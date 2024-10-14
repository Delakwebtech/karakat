const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        unique: false,
        required: [true, 'Please add a product name'],
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    price: {
        type: Number,
        required: true
    },
    media: {
        type: [String],
        default: 'photo.jpg',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// create bootcamp slug from the name 
ProductSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
