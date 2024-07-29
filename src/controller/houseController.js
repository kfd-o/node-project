import { addHouse, addHouseImages } from '../models/userModel.js';
import { getConnection, releaseConnection } from '../utils/connection.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Use 'path.extname' to get file extension
    }
});
const upload = multer({ storage: storage });
const uploadMultiple = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'internal_images', maxCount: 10 }]);

const houseController = {
    uploadHouse: async (req, res, next) => {
        const { model, description, bedroom, bathroom, carport, floor_area, lot_area, price } = req.body;
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
        try {
            req.conn = await getConnection();
            const [result] = await addHouse(model, description, parseInt(bedroom), parseInt(bathroom), parseInt(carport), parseInt(floor_area), parseInt(lot_area), parseInt(price), imageUrl);
            const houseId = result.insertId;

            const internalImageUrls = req.files.internal_images.map(file =>
                `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
            );
            await addHouseImages(houseId, internalImageUrls);

            res.status(201).json(result);
        } catch (error) {
            console.log(error)
            next(error)
        } finally {
            await releaseConnection(req);
        }
    },
    getHouses: async (req, res, next) => {
        try {
            req.conn = await getConnection();
            const [rows] = await req.conn.query('SELECT * FROM house');
            res.status(200).json(rows);
        } catch (error) {
            console.log(error)
            next(error)
        } finally {
            await releaseConnection(req);
        }
    },
    getHouseImages: async (req, res, next) => {
        const houseId = req.params.id;
        try {
            req.conn = await getConnection();
            const [rows] = await req.conn.execute('SELECT * FROM house_images WHERE house_id = ?', [houseId]);

            res.status(200).json(rows);
        } catch (error) {
            next(error)
        } finally {
            await releaseConnection(req);
        }
    },
};

export const uploadMiddleware = uploadMultiple;
export default houseController;
