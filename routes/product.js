const router = require('express').Router()
const products = require('../controllers/products/pages')


router.get('/addProduct', products.Add)

// router.get('/updateProduct', products.Updateproduct)

router.get('/updateProduct/:id', products.Updateproduct)
router.post('/addProduct', products.Postproducts)
// router.get('/adminProducts', products.Adminproducts)



router.post('/updateProduct', products.Productupdate)
router.post('/deleteProduct', products.Deleteproduct)
module.exports = router