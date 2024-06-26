import Book from "../model/book.js";
import User from "../model/user.js";

export const addBook = async (req, res) => {
  try {
    const { title, author, genre, publishedDate, ISBN } = req.body;
    const newBook = new Book({ title, author, genre, publishedDate, ISBN });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    console.log("check author", req.query);
    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    if (author) query.author = { $regex: author, $options: "i" };
    if (genre) query.genre = { $regex: genre, $options: "i" };
    const books = await Book.find(query);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const borrowBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookIds } = req.body;
    const user = await User.findById(userId);
    user.borrowedBooks.push(...bookIds);
    await user.save();

    res.status(200).json({ message: "Books borrowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const returnBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookIds } = req.body;

    const user = await User.findById(userId);
    user.borrowedBooks = user.borrowedBooks.filter(
      (bookId) => !bookIds.includes(bookId)
    );
    await user.save();

    res.status(200).json({ message: "Books returned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("borrowedBooks");
    res.status(200).json(user.borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
