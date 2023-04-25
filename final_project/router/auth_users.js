const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const usersWithSameName = users.filter((user) => {
        return user.username === username
    });
    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    const validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const review = req.query.review;
    const isbn = req.params.isbn;

    if (books[isbn]) {
        books[isbn]["reviews"][username] = review;
        res.send("Review by " + username + " for book with ISBN " + isbn + " has been added!");
    }
    else {
        res.send("Book with ISBN " + isbn + " not found!");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const isbn = req.params.isbn;
    g
    if (books[isbn]) {
        delete books[isbn]["reviews"][username];
        res.send("Review by " + username + " has been deleted!");
    }
    else {
        res.send("Book with ISBN " + isbn + " not found!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
