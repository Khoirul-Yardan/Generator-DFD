const express = require('express');
const multer = require('multer');
const path = require('path');
const dfdController = require('../controllers/dfdController');

const router = express.Router();

// Setup multer untuk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.sql')) {
      cb(null, true);
    } else {
      cb(new Error('Only SQL files are allowed'), false);
    }
  }
});

/**
 * POST /api/dfd/upload
 * Upload SQL file dan generate DFD otomatis
 */
router.post('/dfd/upload', upload.single('sqlFile'), (req, res) => {
  dfdController.uploadAndGenerateDFD(req, res);
});

/**
 * GET /api/dfd/history
 * Dapatkan history DFD yang pernah di-generate
 */
router.get('/dfd/history', (req, res) => {
  dfdController.getDFDHistory(req, res);
});

/**
 * GET /api/dfd/:id
 * Dapatkan DFD by ID
 */
router.get('/dfd/:id', (req, res) => {
  dfdController.getDFDById(req, res);
});

/**
 * GET /api/dfd/:id/download
 * Download semua DFD files untuk ID tertentu
 */
router.get('/dfd/:id/download', (req, res) => {
  dfdController.downloadDFD(req, res);
});

module.exports = router;