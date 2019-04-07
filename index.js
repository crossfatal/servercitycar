const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({extended:false}))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .post('/db', async (req, res) => {
    try {
   	  const email = req.param("email");
   	  let pass = req.param("pass");
   	  const query = `SELECT * FROM login where '${email}' = email and '${pass}' = pass`;
      const client = await pool.connect()
      const result = await client.query(query);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
   }) 
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  /*.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  }) */ 
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
