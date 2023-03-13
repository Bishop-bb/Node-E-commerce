const Products = require('../../models/product')
exports.Add= (req, res)=>{
    if (!req.session.user) {
        return req.session.save(() => {
          res.redirect("/login");
        });
      }
    if(req.session.user.role !== 'admin'){
        res.redirect('/')
    }
    res.render('adminProduct/add',{title: 'AdminAddProduct'})
}

exports.Postproducts= (req, res)=>{
    console.log(req.body)
    const {title, price, image, description} = req.body;
        Products.create({
            title:title,
            price: Number.parseFloat(price),
            image:image,
            description:description
        }).then(result=>{
            res.redirect('/addProduct');
        })
        
    }
    exports.Adminproducts =(req, res)=>{
        if (!req.session.user) {
            return req.session.save(() => {
              res.redirect("/login");
            });
          }
        if(req.session.user.role !== 'admin'){
            res.redirect('/')
        }
        res.render('adminProduct/products')
    }
    exports.Updateproduct=(req, res)=>{
        if (!req.session.user) {
            return req.session.save(() => {
              res.redirect("/login");
            });
          }
        
        if(req.session.user.role !== 'admin'){
            res.redirect('/')
        }
        const id = req.params.id
        Products.findByPk(id)
        .then(result =>{
            console.log(result)
         res.render('adminProduct/update', {products: result, title: 'AdminProductUpdate'})
        })
        .catch(err => console.log(err))
     }
    
    
     exports.Productupdate=(req, res)=>{
        const{id, title, price, image, description} = req.body
        console.log(req.body)
        Products.findByPk(id)
        .then(product=>{
            product.title = title,
            product.price = price,
            product.image = image,
            product.description = description
           return product.save()
           
        }).then(product=>{
            res.redirect('/adminproductHome')
        })
        .catch(err=>{
            console.log(err)
        })
     }
     
    
     exports.Deleteproduct= (req, res)=>{
        console.log(req.body)
        const {id} = req.body
        Products.findByPk(id)
        .then(result=>{
            console.log(result)
            return result.destroy()
        }).then(result=>{
            res.redirect('/adminproductHome')
        })
        .catch(err=>{
            console.log(err)
        })
     }