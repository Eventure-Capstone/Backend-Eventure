import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost', //Endpoint
    user: 'root', //Isi semua sesuai dengan database anda
    password: '',
    database: 'dev_capstone' 
})

export { db };