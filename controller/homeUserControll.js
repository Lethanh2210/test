const fs = require('fs');
const qs = require('qs');
const Blog = require('../model/Blog.js');
const Category = require('../model/Category.js');
const connection = require("mysql/lib/Pool");

class HomeUserController {
    constructor() {
        this.blog = new Blog();
        this.category = new Category();
    }

    showHomeUser(req, res, query) {
        // sẽ show ra các category trc
        fs.readFile('./views/home_user/home_user.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let id_user = query.id_user;
                data = data.replaceAll('{id}', id_user);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    };

    // xem danh sách các blog
    viewBlogs(req, res, query) {
        fs.readFile('./views/home_user/home_user.html', 'utf-8', async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let id_user = query.id_user;
                let blogs = await this.blog.getBlogs();
                let table = ``;
                for (let i = 0; i < blogs.length; i++) {
                    table += `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${blogs[i].title}</td>
                    <td>${blogs[i].author}</td>
                    <td><a href="/homeUser/blogs/blog?id_user=${id_user}&idBlog=${blogs[i].id}">View</a></td>
                </tr>`;
                }
                data = data.replaceAll('{id}', id_user);
                data = data.replace('{blog}', table);
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data);
                return res.end();
            }
        })
    }

    // xem chi tiết 1 blog
    viewABlog(req, res, idBlog) {
        fs.readFile('./views/home_user/blogDetail.html', 'utf-8', async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let blog = await this.blog.getBlog(idBlog);

                let blogDetail = `<ul>
                <li>time-create: ${blog[0].time_create}</li>
                <li>time-update: ${blog[0].time_update}</li>
                <li>content: ${blog[0].content}</li>
            </ul>`;
                // data = data.replaceAll('{id}', id_user);
                data = data.replace('{body}', blogDetail);
                data = data.replace('{title}', blog[0].title);
                data = data.replace('{author}', blog[0].author);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }

    // Đăng 1 blog
    showBlogFromCreate(req, res) {
        fs.readFile('./views/home_user/create_blog.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }

    CreateBlog(req, res, query) {
        let id_user = query.id_user;
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let newBlog = qs.parse(data);
            this.blog.createBlog(newBlog, id_user);
            res.writeHead(301, {
                location: `homeUser/blogs/id_user=${id_user}`
            })

        })
    }

    // tìm kiếm 1 blog

    async findBlog(req, res) {
        if (req.method === 'GET') {
            let buffer = [];

            for await (const chunk of req) {
                buffer.push(chunk);
            }
            const data = Buffer.concat(buffer).toString()
            const dataSearch = (qs.parse(data)).name;

            this.blog.getBlogs().then(blogs => {
                fs.readFile('./views/home_user/create_blog.html', 'utf-8', (err, data) => {
                    if (err) {
                        throw err
                    }
                     this.viewBlogs()
                    // data = data.replace('{tbody}', html)
                    // data = data.replace('<a href="/" hidden>Back</a>', '<a href="/" >Back</a>')
                    // res.writeHead(200, "utf8", {"Content-Type": "text/html"})
                    //
                    // res.write(data);
                    return res.end();
                })
            })

        }

    }



    // tìm kiếm theo danh mục
    findWithCategory(req,res,category) {
        this.blog.getBlogWithCategory(category).then((blogs) => {
            console.log(blogs)
            fs.readFile('./views/home_user/home_user.html', 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let table = ``;
                    for (let i = 0; i < blogs.length; i++) {
                        table += `
                    <tr>
                    <td>${i + 1}</td>
                    <td>${blogs[i].title}</td>
                    <td>${blogs[i].author}</td>
                    <td><a href="/homeUser/blogs/blog?idBlog=${blogs[i].id}">View</a></td>
                </tr>`;
                    }
                    data = data.replace('{blog}', table);
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.write(data);
                    return res.end();
                }
            })
        })

    }

    // xem danh sách blog của tôi
    viewMyBlog() {
        // this.blog.getBlogs().then((results) => {
        //     fs.readFile('./')
        // })
    }

    // sửa 1 blog đã đăng
    editMyBlog(res, req, method) {
        if (method === 'GET') {
            fs.readFile('./views/home_user/create_blog.html', 'utf-8', (err, data) => {
                if (err) {
                    throw new Error(err.message)
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', () => {
                let dataForm = qs.parse(data)

                // this.editMyBlog(dataForm.title, dataForm.content, dataForm.author).then((result) => {
                //     res.writeHead(301, )
                //     res.write(result)
                //     res.end()
                // })
            })
        }
    }

    // xóa 1 bài viết của tôi
    deleteBlogs(res, queryString) {
        const idDelete = queryString.id;
        console.log(idDelete)
        const sqlDeleteBlogById = this.blog.deleteBlog(idDelete)

        connection.query(sqlDeleteBlogById, (err, result) => {
            if (err) {
                throw err;
            } else {
                console.log("delete success");
                res.writeHead(301, {
                    Location: "http://localhost:8080"
                })
                res.end()
            }
        })

    }

    // // thêm ảnh vào blog
    // async addImage(req,res,id) {
    //     let image =
    //
    // }
};
module.exports = HomeUserController;