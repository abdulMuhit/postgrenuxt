const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser');
const multer = require('multer');
const sharp = require('sharp');
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()
const {
  Pool,
  Client
} = require('pg')

const upload = multer()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const connectionString = 'postgresql://test:admin@localhost:5432/recipebookdb'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

/* const {
  Client
} = require('pg')
const client = new Client()
 */

const pool = new Pool({
  connectionString: connectionString,
})


/* app.get('/test', async function (req, res) {

  try {
    client.connect()
    client.query('SELECT * FROM recipes', (err, response) => {
      console.log(err ? err.stack : response.rows[0].message) // Hello World!

      if (err) {
        console.log("error happen ", err)
        res.json({
          code: 404,
          data: err
        })
      } else {
        res.json({
          code: 200,
          data: response
        })
      }
      client.end()
    })
  } catch (error) {
    console.log("error happen 2", error)
    res.json({
      code: 404,
      data: error
    })


  }

})
 */
app.get('/test', function (req, res) {
  try {
    pool
      .connect()
      .then(client => {
        return client
          // .query('SELECT * FROM recipes WHERE id = $1', [1])
          .query('SELECT * FROM recipes')
          .then(response => {
            client.release()
            console.log(response.rows[0])
            res.json({
              code: 200,
              data: response
            })
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
            res.json({
              code: 404,
              data: err
            })
          })
      })
  } catch (error) {
    client.release()
    console.log("try error ", error)
    res.json({
      code: 404,
      data: error
    })
  }
  // promise - checkout a client
})


app.post('/getTodos', function (req, res) {
  try {
    pool
      .connect()
      .then(client => {
        return client
          // .query('SELECT * FROM recipes WHERE id = $1', [1])
          .query('SELECT * FROM recipes')
          .then(response => {
            client.release()
            console.log(response.rows[0])
            res.json({
              code: 200,
              data: response
            })
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
            res.json({
              code: 404,
              data: err
            })
          })
      })
  } catch (error) {
    client.release()
    console.log("try error ", error)
    res.json({
      code: 404,
      data: error
    })
  }
  // promise - checkout a client
})

app.post('/saveTodos',  upload.single('file'), function(req, res, next) {

  console.log(req)

  const file = req.file
  console.log("file ", file)
  console.log('Got body:', req.body);

  const query = {
    text: 'INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
    values: [req.body.name, req.body.ingredients, req.body.directions],
  }

/* 
  res.json({
    code: 200,
    data: 'test'
  })

  return

    const query = {
    text: 'INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
    values: ['brianc', 'brian.m.carlson@gmail.com', 'test'],
  }

 */


  try {
    pool
      .connect()
      .then(client => {
        return client
          .query(query)
          .then(response => {
            client.release()
            console.log(response)
            res.json({
              code: 200,
              data: response
            })
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
            res.json({
              code: 404,
              data: err
            })
          })
      })
  } catch (error) {
    client.release()
    console.log("try error insert ", error)
    res.json({
      code: 404,
      data: error
    })
  }



  
})


app.post('/delTodos', upload.none(), function(req, res, next) {
  console.log('Got body delete :', req.body);
  const query = {
    text: 'DELETE FROM recipes WHERE id = $1',
    values: [req.body.id],
  }

  try {
    pool
      .connect()
      .then(client => {
        return client
          .query(query)
          .then(response => {
            client.release()
            console.log(response)
            res.json({
              code: 200,
              data: response
            })
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
            res.json({
              code: 404,
              data: err
            })
          })
      })
  } catch (error) {
    client.release()
    console.log("try error delete ", error)
    res.json({
      code: 404,
      data: error
    })
  }



  
})

app.post('/updateTodos',  upload.single('file'), function(req, res, next) {

  console.log(req)

  const file = req.file
  console.log("file ", file)
  console.log('Got body:', req.body);

  const query = {
    text: 'UPDATE recipes SET name = $1, ingredients = $2, directions = $3 WHERE id = $4',
    values: [req.body.name, req.body.ingredients, req.body.directions, req.body.id],
  }

  try {
    pool
      .connect()
      .then(client => {
        return client
          .query(query)
          .then(response => {
            client.release()
            console.log(response)
            res.json({
              code: 200,
              data: response
            })
          })
          .catch(err => {
            client.release()
            console.log(err.stack)
            res.json({
              code: 404,
              data: err
            })
          })
      })
  } catch (error) {
    client.release()
    console.log("try error insert ", error)
    res.json({
      code: 404,
      data: error
    })
  }
})

/* 
app.get('/test2', function (req, res) {
  try {
    async function a() {
      console.log('starting async query')
      const result = await pool.query('SELECT NOW()')
      console.log('async query finished')
      console.log('starting callback query')
      pool.query('SELECT NOW()', (err, res) => {
        console.log('callback query finished')
      })
      console.log('calling end')
      await pool.end()
      console.log('pool has drained')
    }
    a().then(response => {
      res.json({
        code: 200,
        data: response
      })
    }).catch(e => {
      res.json({
        code: 404,
        data: e
      })
    })
  } catch (error) {
    console.log("try error ", error)
    res.json({
      code: 404,
      data: error
    })
  }
  // promise - checkout a client
})
 */