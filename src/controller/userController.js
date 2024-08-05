import { usernameExist, create, fetchLastUser, fetchUsers, deleteUserById, fetchAllUsers, changeUserPasswordByEmail, fetchUserById} from "../models/userModel.js";
import { getConnection, releaseConnection } from "../utils/connection.js";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { io } from '../../server.js'
import sendMail from "../utils/mailer.js";
import { generateOtp, storeOtp, verifyOtp } from "../utils/otp.js";

const userController = {
    getUserData: async (req, res, next) => {
        const { userType } = req.params;
        const table = {
            a: process.env.A,
            h: process.env.H,
            sp: process.env.SP,
            v: process.env.V,
        }

        try {
            req.conn = await getConnection();

            if (userType === 'admin') {
                const admin = await fetchUsers(table.a);
                res.status(200).json(admin);
            }else if (userType === 'homeowner') {
                const homeowner = await fetchUsers(table.h);
                res.status(200).json(homeowner);
            } else if (userType === 'security-personnel') {
                const securityPersonnel = await fetchUsers(table.sp);
                res.status(200).json(securityPersonnel);
            } else if (userType === 'visitor') {
                const visitor = await fetchUsers(table.v);
                res.status(200).json(visitor);
            } else {
                return res.status(400).json({ message: 'Invalid user type' });
            }
        } catch (error) {
            console.log(error)
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    getUserById: async (req, res, next) => {
        const {userType, id} = req.params
        const table = {
            v: process.env.V,
        }
        try {
            req.conn = await getConnection();
            if(userType === 'visitor'){
                const rows = await fetchUserById(table.v, id);
                res.status(200).json(rows)
            }else{
                return res.status(400).json({ message: 'Invalid user type and id' });
            } 
        } catch (error) {
            console.log(error)
            next(error)
        } finally {
            await releaseConnection(req);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            req.conn = await getConnection();
            const rows = await fetchAllUsers();
            res.status(200).json(rows)
        } catch (error) {
            console.log(error)
            next(error)
        } finally {
            await releaseConnection(req);
        }
    },

    postUserData: async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { userType } = req.params;

        const table = {
            a: process.env.A,
            h: process.env.H,
            sp: process.env.SP,
            v: process.env.V,
        }
        const userData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: req.body.password,
            ...(req.body.address && { address: req.body.address }),
            email: req.body.email,
            ...(req.body.contact_num && { contact_num: req.body.contact_num }),
            profile_color: req.body.profile_color
        }

        try {
            req.conn = await getConnection();

            const isExist = await usernameExist(userData.username);

            if (isExist) {
                return res.status(401).json({ status: 401, msg: "Username is already in use." });
            }

            if (userType === 'admin') {
                const hashPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashPassword;

                const [result] = await create(table.a, userData);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Admin creation failed." });
                }

                io.emit('new-user', userData);
                io.emit('last-user', await fetchLastUser(table.h));

                res.status(201).json(result);
            } else if (userType === 'homeowner') {
                const hashPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashPassword;

                const [result] = await create(table.h, userData);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Homeowner creation failed." });
                }

                io.emit('new-user', userData);
                io.emit('last-user', await fetchLastUser(table.h));

                res.status(201).json(result);
            } else if (userType === 'security-personnel') {
                const hashPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashPassword;

                const [result] = await create(table.sp, userData);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Security Personnel creation failed." });
                }

                io.emit('new-user', userData);
                io.emit('last-user', await fetchLastUser(table.sp));

                res.status(201).json(result);
            } else if (userType === 'visitor') {
                const hashPassword = await bcrypt.hash(userData.password, 10);
                userData.password = hashPassword;

                const [result] = await create(table.v, userData);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Visitor creation failed." });
                }

                io.emit('new-user', userData);
                io.emit('last-user', await fetchLastUser(table.v));

                res.status(201).json(result);
            } else {
                return res.status(400).json({ message: 'Invalid user type' });
            }
        } catch (error) {
            console.log(error)
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    postChangeUserPassword: async (req, res, next) => {

        const { email, new_password } = req.body;



        try {
            req.conn = await getConnection();

            const hashPassword = await bcrypt.hash(new_password, 10);

            const result = await changeUserPasswordByEmail(email, hashPassword);
            if (result.affectedRows === 0) {
                return res.status(400).json({ status: 400, msg: "Password change failed." });
            }
            res.status(201).json(result)
        } catch (error) {
            console.log(error)
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },

    deleteUserData: async (req, res, next) => {

        const { userType, id } = req.params;
        const userId = parseInt(id);
        const table = {
            h: process.env.H,
            sp: process.env.SP,
            v: process.env.V,
        }

        try {
            req.conn = await getConnection();

            if (isNaN(userId)) {
                return res.status(401).json({ status: 401, msg: "It's not a number, it must be integer." });
            }

            if (userType === 'homeowner') {

                const [result] = await deleteUserById(table.h, userId);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Homeowner deletion failed." });
                }

                // tobe fix
                // io.emit('new-user', userData);
                // io.emit('last-user', await fetchLastUser(table.h));

                res.status(200).json(result);
            } else if (userType === 'security-personnel') {
                const [result] = await deleteUserById(table.sp, userId);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Security Personnel deletion failed." });
                }

                // tobe fix
                // io.emit('new-user', userData);
                // io.emit('last-user', await fetchLastUser(table.h));

                res.status(200).json(result);
            } else if (userType === 'visitor') {
                const [result] = await deleteUserById(table.v, userId);

                if (result.affectedRows === 0) {
                    return res.status(400).json({ status: 400, msg: "Visitor deletion failed." });
                }
                console.log(result)

                // tobe fix
                // io.emit('new-user', userData);
                // io.emit('last-user', await fetchLastUser(table.h));

                res.status(200).json(result);
            } else {
                return res.status(400).json({ message: 'Invalid user type' });
            }
        } catch (error) {
            console.log(error)
            next(error);
        } finally {
            await releaseConnection(req);
        }
    },
    sendOtp: async (req, res, next) => {
        const { email } = req.body;

        try {
            const otp = generateOtp(); // generate OTP
            await storeOtp(email, otp); // store OTP in a temporary storage like Redis or in memory

            await sendMail(email, 'Forgot Password', `${otp} is your verification code. This code will expire in 5 minutes.`);

            res.status(200).json({ message: 'OTP sent to email' });
        } catch (error) {
            next(error);
        }
    },

    verifyOtp: async (req, res, next) => {
        const { email, otp } = req.body;
        console.log(`Received OTP verification request for email: ${email}, OTP: ${otp}`);

        try {
            const isValid = await verifyOtp(email, otp); // verify OTP

            if (isValid) {
                res.status(200).json({ message: 'OTP verified' });
            } else {
                console.log(`Invalid OTP for email: ${email}`);
                res.status(400).json({ message: 'Invalid OTP' });
            }
        } catch (error) {
            console.error(`Error verifying OTP for email: ${email}`, error);
            next(error);
        }
    },
};

export default userController;