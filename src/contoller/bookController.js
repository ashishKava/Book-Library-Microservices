import Book from "../model/book.js";
import User from "../model/user.js";
import mongoose from "mongoose";

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
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  const { title, author, genre } = req.query;
  try {
    let query = {};
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
  const { bookIds } = req.body;
  try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const bookObjectIds = bookIds.map(id => new mongoose.Types.ObjectId(id));
      const books = await Book.find({ _id: { $in: bookObjectIds } });

      if (!user.borrowedBooks) {
          user.borrowedBooks = [];
      }

      user.borrowedBooks.push(...books.map(book => book._id));
      await user.save();

      res.status(200).json({ message: 'Books borrowed successfully', borrowedBooks: user.borrowedBooks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const returnBooks = async (req, res) => {
  const { bookId } = req.body;

  try {
      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user.borrowedBooks || user.borrowedBooks.length === 0) {
          return res.status(404).json({ message: 'No borrowed books found for this user' });
      }

      const index = user.borrowedBooks.indexOf(bookId);
      if (index !== -1) {
          user.borrowedBooks.splice(index, 1);
      } else {
          return res.status(404).json({ message: 'Book not found in user\'s borrowed list' });
      }

      await user.save();

      const book = await Book.findById(bookId);
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }
      book.status = 'Available';
      await book.save();

      res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserBorrowedBooks = async (req, res) => {
  try {
      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const borrowedBookIds = user.borrowedBooks || [];
      const validBookIds = borrowedBookIds.filter(id => mongoose.Types.ObjectId.isValid(id));

      const borrowedBooks = await Book.find({ _id: { $in: validBookIds.map(id => mongoose.Types.ObjectId(id)) } });

      res.status(200).json({ borrowedBooks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
