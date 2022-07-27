const http = require('http');
const url = require('url');
const qs = require('qs');
const fs = require('fs');

const HomeController=require('./controller/homeControll.js');
const ErrorController=require('./controller/errorControll.js');
const RegisterController=require('./controller/registerControll');
const LoginController=require('./controller/loginControll.js');
const HomeUserController =require('./controller/homeUserControll.js')
const HomeAdminController =require('./controller/homeAdminControll.js');

const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "css": "text/css",
    "min.js": "text/javascript",
    "js.map": "text/javascript",
    "css.map": "text/css",
    "min.css": "text/css",
    "jpg": "image/jpg",
    "png": "image/png",
    "gif": "image/gif",
    "woff": "text/html",
    "ttf": "text/html",
    "woff2": "text/html",
    "eot": "text/html",
}



let homeController=new HomeController();
let errorController=new ErrorController();
let registerController=new RegisterController();
let loginController=new LoginController();
let homeUserController=new HomeUserController();
let homeAdminController=new HomeAdminController();

let server=http.createServer((req,res)=>{
    let urlParse=url.parse(req.url,true);
    let urlPath = urlParse.pathname;
    let query = qs.parse(urlParse.query);
    let method = req.method;
    let filesDefences = req.url.match(/\.js|.css|.jpg|.png|.gif|min.js|js.map|min.css|.css.map|.woff|.ttf|.woff2|.eot/);
    if (filesDefences) {
        let filePath = filesDefences[0].toString();
        let extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        if (filePath.includes('/css')){
            extension = mimeTypes[filesDefences[0].toString().split('/')[1]];
        }
        console.log(extension)
        if (extension.includes('?')){
            extension = extension.split('?')[0];
        }
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + '/template' + req.url).pipe(res);
    }else{
        switch(urlPath){
            case '/':{
                homeController.showHome(req,res);
                break;
            }
            case '/register':{
                if(method==='GET'){
                    registerController.showRegister(req,res);
                }else{
                    registerController.createUser(req,res);
                }
                break;
            }
            case '/login':{
                if(method==='GET'){
                    loginController.showLogin(req,res);
                }else{
                    loginController.login(req,res);
                }
                break;
            }
            case '/homeUser':{
                homeUserController.showHomeUser(req,res,query);
                break;
            }
            case '/homeAdmin':{
                homeAdminController.viewUsers(req,res,query);
                break;
            }
            case `/homeUser/blogs`:{
                if(urlParse.query.category){
                    homeUserController.findWithCategory(req,res,urlParse.query.category);
                }else{
                    homeUserController.viewBlogs(req,res,query);
                }
                break;
            }
            case `/homeUser/blogs/blog`:{
                let idBlog = urlParse.query.idBlog;
                homeUserController.viewABlog(req,res, idBlog);
                break;
            }
            case `/homeUser/blogs/create_blog`:{
                if(method==='GET'){
                    homeUserController.showBlogFromCreate(req,res);
                }else{
                    homeUserController.CreateBlog(req,res,query);
                }
                break;
            }
            default:{
                errorController.showError(req,res);
                break;
            }
        }
    }


})
server.listen(8080,()=>{
    console.log('server running in http://localhost:8080');
})
