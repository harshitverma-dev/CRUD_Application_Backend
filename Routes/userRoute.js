const express = require('express');
const upload = require('../multerconfig/storageConfig');
const router = express.Router();
const { userPost, usersGet, userGet, userUpdate, userDelete, userStatusUpdate, userExport } = require('./../Controller/userController')

router.post('/user/register', upload.single('user_profile'), userPost);
router.get('/user/details', usersGet);
router.get('/userprofile/:id', userGet)
router.put('/edit/:id', upload.single('user_profile'), userUpdate);
router.delete('/user/delete/:id', userDelete);
router.put('/user/status/:id', userStatusUpdate);
router.get('/userexport', userExport)


module.exports = router;