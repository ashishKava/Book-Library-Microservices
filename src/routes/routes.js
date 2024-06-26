import { Router } from "express";
import { register, login } from "../contoller/authController.js";
import {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById,
  searchBooks,
  borrowBooks,
  returnBooks,
  getUserBorrowedBooks,
} from "../contoller/bookController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/books", authenticateToken, getAllBooks);

router.get("/books/:id", authenticateToken, getBookById);

router.post("/books", authenticateToken, adminOnly, addBook);

router.put("/books/:id", authenticateToken, adminOnly, updateBook);

router.delete("/books/:id", authenticateToken, adminOnly, deleteBook);

router.get("/books/search", authenticateToken, searchBooks);

router.post("/books/borrow", authenticateToken, borrowBooks);

router.post("/books/return", authenticateToken, returnBooks);

router.get("/books/borrowed", authenticateToken, getUserBorrowedBooks);

export default router;
