const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        published_on: {
            type: String,
        },
        isbn: {
            type: String,
        },
        url: {
            type: String,
        },
        is_featured: {
            type: Boolean,
        },
        image_path: {
            type: String,
        },
        authors_name: { type: String },
        tags: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tag",
                },
            ],
        },
        genres: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Genre",
                },
            ],
        },
        authors: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Author",
                },
            ],
        },
    },
    { timestamps: true }
);

bookSchema.pre("save", async function (next, done) {
    const errorsMsg = {
        isbn: "The isbn has already been taken.",
        name: "The name has already been taken.",
    };
    try {
        const isbnExists = await mongoose.models["Book"].findOne({
            isbn: this.isbn,
        });
        if (isbnExists) {
            if (isbnExists._id.toString() !== this._id.toString()) {
                const error = new Error(errorsMsg.isbn);
                error.statusCode = 422;
                throw error;
            }
        }
        const nameExists = await mongoose.models["Book"].findOne({
            name: this.name,
        });
        if (nameExists) {
            if (nameExists._id.toString() !== this._id.toString()) {
                const error = new Error(errorsMsg.name);
                error.statusCode = 422;
                throw error;
            }
        }
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("Book", bookSchema);
