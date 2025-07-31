const express = require('express');
const {
    savePainting,
    loadPainting,
    updatePainting,
    deletePainting,
    getPaintingStatistics
} = require('../controllers/paintingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/save', auth, savePainting);

router.get('/load', auth, loadPainting);

router.put('/update', auth, updatePainting);

router.delete('/delete', auth, deletePainting);

router.get('/statistics', auth, getPaintingStatistics);

module.exports = router;
