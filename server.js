/**
 * Express API for testing ESR applications
 * Using ExpressJS, MSSQL, xml2js and faker
 * Can set port in script command 'node index.js --port=5000'. Default port = 3000
 */
const express = require('express');
const bp = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const argv = require('minimist')(process.argv);
const NhiTools = require('./index.js').NhiTools
require('dotenv').config();

var PORT

// handle parsed port argument. Set 3000 as default 
if (!argv.port) {
    PORT = 5000;
} else {
    PORT = argv.port;
};

// create express api instance
var app = express();

app.set("title", "express api");

app.use(bp.json());
app.use(express.urlencoded({ extended: false }));

// api header controller
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// create swagger documentation feature
const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'Testing Data API',
                description: 'This API contains endpoints that perform a number of tasks for the testing team including fetching test data from the test database for validation and creating nhi records to opening and reading the contents of pdf files',
                version: '1.0.0'
            }
        },
        apis: ['server.js']
}

const spec = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// api listener
app.listen(PORT, () => console.log(`Express server running on port ${PORT}...`));

function getRandomNhi() {
    const nhi = new NhiTools();
    return nhi.generateNhi();
};

/**
 * @swagger
 * /api/isNhiValid:
 *  post:
 *      description: validate nhi string
 * 
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         nhi:
 *                             type: string
 *                             example: 'ZZZ0008'
 * 
 *      responses:
 *         '200':
 *             description: OK
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             valid:
 *                                 type: boolean
 *                                 example: false
 *                             nhi:
 *                                 type: string
 *                                 example: 'ZZZ0008'
      
 */
app.post('/api/isNhiValid', (req, res) => {
    var { nhi } = req.body
    const tools = new NhiTools()
    var check = tools.isNhiValid(nhi)
    res.send({ "nhi": nhi, "valid": check })
})

app.get('/api/get-nhi', (req, res) => {
    // return nhi number without MOH proxy store file creation
    res.json({"nhi": getRandomNhi()})
});