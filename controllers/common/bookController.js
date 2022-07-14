const Book = require("../../models/admin/book");
const BookItem = require("../../models/admin/bookItem");
const responseHelper = require("../../utils/responseHandler");

exports.addBook = async (req, res, next) => {
    const newBook = new Book({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        published_on: req.body.published_on,
        isbn: req.body.isbn,
        url: req.body.url,
        is_featured: req.body.is_featured,
        image_path: req.body.image_path,
        authors: req.body.authors,
        genres: req.body.genres,
        tags: req.body.tags,
    });

    const book = await newBook.save();

    const bookItems = await Promise.all(
        req.body.items.map(async (item) => {
            let newBookItem = await new BookItem({
                book_id: book._id.toString(),
                book_code: item.book_code,
                edition: item.edition,
                format: item.format,
                status: item.status,
                location: item.location,
                price: item.price,
                publisher_id: item.publisher_id,
                language_id: item.language_id,
                file_name: item.file_name,
                book_item_status: item.book_item_status,
                e_book_url: item.e_book_url,
                last_issued_book: item.last_issued_book,
            });
            const bookItem = await newBookItem.save();
            return bookItem;
        })
    );

    const result = {
        id: book._id.toString(),
        name: book.name,
    };

    return res
        .status(200)
        .json(
            responseHelper.prepareSuccessResponse(result, "Book saved successfully")
        );
};

exports.getBook = async (req, res, next) => {
    const id = req.params.id;
    const book = await Book.findById(id).populate(["tags", "authors", "genres"]);
    if (!book) {
        const error = new Error("Could not find book.");
        error.statusCode = 404;
        throw error;
    }

    const bookItems = await BookItem.find({ book_id: book.id }).populate([
        "publisher_id",
        "language_id",
    ]);
    if (!bookItems) {
        const error = new Error("Could not find book items.");
        error.statusCode = 404;
        throw error;
    }

    const result = {
        id: book._id.toString(),
        name: book.name,
        description: book.description,
        image: book.image,
        published_on: book.published_on,
        isbn: book.isbn,
        url: book.url,
        is_featured: book.is_featured,
        image_path: book.image_path || "STATIC", // Have to work

        authors_name: book.authors
            .map((author) => {
                const authorName = author.first_name;
                return authorName;
            })
            .toString(),

        tags: book.tags.map((tag) => {
            return {
                id: tag._id.toString(),
                name: tag.name,
                pivot: {
                    book_id: book._id.toString(),
                    tag_id: tag._id.toString(),
                },
            };
        }),
        genres: book.genres.map((genre) => {
            return {
                id: genre._id.toString(),
                name: genre.name,
                description: genre.description,
                show_on_landing_page: genre.show_on_landing_page,
                pivot: {
                    book_id: book._id.toString(),
                    genre_id: genre._id.toString(),
                },
            };
        }),
        authors: book.authors.map((author) => {
            return {
                id: author._id.toString(),
                first_name: author.first_name,
                last_name: author.last_name,
                description: author.description,
                pivot: {
                    book_id: book._id.toString(),
                    author_id: author._id.toString(),
                },
            };
        }),
        items: bookItems.map((bookItem) => {
            return {
                id: bookItem._id.toString(),
                book_id: bookItem.book_id,
                book_code: bookItem.book_code,
                edition: bookItem.edition,
                format: bookItem.format,
                status: bookItem.status,
                location: bookItem.location,
                price: bookItem.price,
                publisher_id: bookItem.publisher_id._id.toString(),
                language_id: bookItem.language_id._id.toString(),
                file_name: bookItem.file_name, // Have to implement
                book_item_status: bookItem.book_item_status,
                e_book_url: bookItem.e_book_url,
                language: {
                    id: bookItem.language_id._id.toString(),
                    language_name: bookItem.language_id.language_name,
                    language_code: bookItem.language_id.language_code,
                },
                publisher: {
                    id: bookItem.publisher_id._id.toString(),
                    name: bookItem.publisher_id.name,
                },

                last_issued_book: bookItem.last_issued_book || "STATIC ARRAY CH ", // Have to implement
            };
        }),
    };

    return res
        .status(200)
        .json(
            responseHelper.prepareSuccessResponse(
                result,
                "Book retrieved successfully"
            )
        );
};

exports.getAllBooks = async (req, res, next) => {
    const books = await Book.find().populate("authors");
    if (!books) {
        const error = new Error("Books not found.");
        error.statusCode = 404;
        throw error;
    }

    const result = await Promise.all(
        books.map(async (book) => {
            let bookItems = await BookItem.find({ book_id: book.id }).populate([
                "publisher_id",
                "language_id",
            ]);
            return {
                id: book._id.toString(),
                name: book.name,
                description: book.description,
                image: book.image,
                published_on: book.published_on,
                isbn: book.isbn,
                url: book.url,
                is_featured: book.is_featured,
                image_path: book.image_path,
                authors_name: book.authors
                    .map((author) => {
                        const authorName = author.first_name;
                        return authorName;
                    })
                    .toString(),
                authors: book.authors.map((author) => {
                    return {
                        id: author._id.toString(),
                        first_name: author.first_name,
                        last_name: author.last_name,
                        description: author.description,
                        pivot: {
                            book_id: book._id.toString(),
                            author_id: author._id.toString(),
                        },
                    };
                }),
                items: bookItems.map((bookItem) => {
                    return {
                        id: bookItem._id.toString(),
                        book_id: bookItem.book_id,
                        book_code: bookItem.book_code,
                        edition: bookItem.edition,
                        format: bookItem.format,
                        status: bookItem.status,
                        location: bookItem.location,
                        price: bookItem.price,
                        publisher_id: bookItem.publisher_id._id.toString(),
                        language_id: bookItem.language_id._id.toString(),
                        file_name: bookItem.file_name, // Have to implement
                        book_item_status: bookItem.book_item_status,
                        e_book_url: bookItem.e_book_url,
                        language: {
                            id: bookItem.language_id._id.toString(),
                            language_name: bookItem.language_id.language_name,
                            language_code: bookItem.language_id.language_code,
                        },
                        publisher: {
                            id: bookItem.publisher_id._id.toString(),
                            name: bookItem.publisher_id.name,
                        },

                        last_issued_book: bookItem.last_issued_book || "STATIC ARRAY CH ", // Have to implement
                    };
                }),
            };
        })
    );

    return res
        .status(200)
        .json(
            responseHelper.prepareSuccessResponse(
                result,
                "Books retrieved successfully."
            )
        );
};

exports.updateBook = async (req, res, next) => {
    const id = req.params.id;
    let book = await Book.findById(id);
    if (!book) {
        const error = new Error("Could not find book.");
        error.statusCode = 404;
        throw error;
    }

    book.name = req.body.name;
    book.description = req.body.description;
    book.image = req.body.image;
    book.published_on = req.body.published_on;
    book.isbn = req.body.isbn;
    book.url = req.body.url;
    book.is_featured = req.body.is_featured;
    book.image_path = req.body.image_path;
    book.authors = req.body.authors;
    book.genres = req.body.genres;
    book.tags = req.body.tags;

    book = await book.save();

    const result = {
        id: book._id.toString(),
        name: book.name,
        description: book.description,
        image: book.image,
        published_on: book.published_on,
        isbn: book.isbn,
        url: book.url,
        image_path: book.image_path,
        authors_name: "STATIC", // IF REQUIRED, NEED TO IMPLEMENT
        is_featured: book.is_featured,
        authors: book.authors,
        genres: book.genres,
        tags: book.tags,
    };

    return res
        .status(200)
        .json(
            responseHelper.prepareSuccessResponse(
                result,
                "Book updated successfully."
            )
        );
};

exports.deleteBook = async (req, res, next) => {
    const id = req.params.id;
    let book = await Book.findByIdAndRemove(id);
    if (!book) {
        const error = new Error("Could not find book.");
        error.statusCode = 404;
        throw error;
    }
    return res
        .status(200)
        .json(
            responseHelper.prepareSuccessResponse({}, "Book deleted successfully.")
        );
};
