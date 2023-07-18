const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'newtonSchool';

/*
You need to implement the getCurrentUser controller which takes the authorization token of the user as input, decode the JWT token using the JWT_SECRET, and find the user with the decoded userId from the database.

Instructions:

The controller expects an HTTP GET request with the authorization token in the request headers.

If the request headers are missing the authorization token, the controller should respond with a 401 Unauthorized status and a JSON object containing a 'message' field with value 'Unauthorized' and a 'status' field with value 'Error'.

If the JWT token cannot be decoded using the JWT_SECRET, the controller should respond with a 401 Unauthorized status and a JSON object containing a 'message' field with value 'Unauthorized' and a 'status' field with value 'Error'.

If the user with the decoded userId doesn't exist in the database, the controller should respond with a 404 Not Found status and a JSON object containing a 'message' field with value 'User not found' and a 'status' field with value 'Error'.

If the user is successfully found in the database, the controller should respond with a 200 OK status and a JSON object containing the found user's data in the 'user' field and a 'status' field with value 'Success'.

If there is an error during the JWT decoding or database query process, the controller should respond with a 401 Unauthorized status and a JSON object containing a 'message' field with value 'Unauthorized', a 'status' field with value 'Error', and an 'error' field with the error object.

Input:
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDEwM2IzOTEyNWVjN2RhMmVlMzc0NjMiLCJpYXQiOjE2Nzg3ODUzNTEsImV4cCI6MTY3ODc4ODk1MX0.BWN0VdqXlE54nq4XZYMHC491LTy_P-QD_oXFweljwNo

Output:
{
    "user":  <user object>
    "status": "Success"
}
*/
const getCurrentUser = async (req, res) => {
    //Write your Code Here
};

// Fetches all Users data [Paginated]
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;

        const users = await User.find()
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await User.countDocuments(User.find());
        res.status(200).json({
            status: "success",
            data: {
                count,
                users,
            },
        });
    } catch (err) {
        res.status(404).json({
            message: "Users Not Found",
            status: "Error",
            error: err,
        });
    }
};

// Fetches the user details with the given ID.
const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: "Error",
                message: "User Not Found"
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                user: user
            }
        })

    } catch (err) {
        res.status(400).json({
            message: "User Fetching Failed",
            status: "Error",
            error: err,
        });
    }
};

// Creates a new User
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username) {
            return res.status(400).json({
                message: "Username Missing",
                status: "Error",
            });
        }
        if (!email) {
            return res.status(400).json({
                message: "Email Missing",
                status: "Error",
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "Password Missing",
                status: "Error",
            });
        }

        const newUser = await User.create({
            username,
            email,
            password,
        });

        res.status(201).json({
            status: "success",
            message: "User Created Successfully",
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "User Creation failed",
            status: "Error",
            error: err,
        });
    }
};

// Updates user's details
const updateUser = async (req, res) => {
    try {
        const { updatedData } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData }
        );

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
                status: "Error",
            });
        }

        const updatedUser = await User.findById(req.params.id);
        res.status(200).json({
            status: "success",
            message: "User Updated Successfully",
            data: {
                updatedUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "User Updation Failed",
            status: "Error",
            error: err,
        });
    }
};

// Deletes the user with the given ID.
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ status: "Error", message: "User not Found" });
        }
        res.status(201).json({
            status: "success",
            message: "User Deleted Successfully",
            data: {
                user: deletedUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "User Deletion Failed",
            status: "Error",
            error: err,
        });
    }
};


module.exports = {getAllUsers, getUserByID, createUser, updateUser, deleteUser, getCurrentUser};

