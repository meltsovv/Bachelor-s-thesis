const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'app/reports',
  filename(req, file, cb) {
    cb(null, `${Date.now().toFixed()}.${file.mimetype.split('/')[1]}`);
  },
});

module.exports = multer({
  storage,
});
