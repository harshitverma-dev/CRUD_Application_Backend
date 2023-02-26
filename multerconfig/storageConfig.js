const multer = require('multer');

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');
    },
    filename: (req, file, cb) => {
        const filename = `image-${Date.now()}.${file.originalname}`
        cb(null, filename);
    }
})

// filter
const filefilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('only .png .jpg and .jpeg formates are allow'));
    }
}

const upload = multer({
    storage,
    filefilter
})

module.exports = upload;