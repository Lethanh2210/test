const { rejects } = require('assert');
const { resolve } = require('url');
const Connection= require('./connection.js');

class Blog {
    constructor() {
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('connect success');
            }
        })
    }

    // lấy ra danh sách blog
    getBlogs() {
        return new Promise((resolve, rejects) => {
            this.connection.query('select * from blogs', (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    // lấy ra 1 blog
    getBlog(ID) {
        console.log(ID)
        return new Promise((resolve, rejects) => {
            this.connection.query(`select * from blogs where id=${ID}`, (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    // tìm kiếm 1 blog theo tên
    getBlogWithTitle(title) {
        return new Promise((resolve, rejects) => {
            this.connection.query(`select * from blogs where blogs.title=${title}`, (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    // xem danh sách blog đã đăng của tôi
    getMyBlogs(id) {
        return new Promise((resolve, rejects) => {
            this.connection.query(`select * from blogs where blogs.user_id=${id}`, (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    // sửa blog
    editMyBlog(id, blog) {
        return new Promise(((resolve, reject) => {
            let sql = `UPDATE products 
                       SET  title = '${blog.title}',
                            content = '${blog.content}',
                            author = '${blog.author}',
                       WHERE id = '${id}'`;
            this.connection.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        }))
    }

    getBlogWithCategory(category) {
        console.log(category);
        return new Promise((resolve, rejects) => {
            this.connection.query(`SELECT * from blogs join categories on categories.id = blogs.category_id where categories.name = '${category}'`,
                                (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            })
        })
    };

    // xoa blog
    deleteBlog(id){
        let queryDelete=`delete from blogs where blogs.id=${id}`;
        this.connection.query(query,(err,data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('delete success');
            }
        })
    }

    // tạo 1 blog
    createBlog(blog, id_user) {
        let query = `insert into blogs (title,author,content,user_id) values (${blog.title},${blog.author},${blog.content},${id_user})`
        this.connection.query(query, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('create success');
            }
        })
    }

}

module.exports = Blog;