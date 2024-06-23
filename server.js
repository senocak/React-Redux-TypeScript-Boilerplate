const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./2024-06-17-18:29:17.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
    console.log("register endpoint called; request body:", req.body)
    const {email, password} = req.body;

    if (isAuthenticated({email, password}) === true) {
        const status = 401;
        const message = 'Email and Password already exist'
        res.status(status).json({status, message});
        return
    }

    fs.readFile("./users.json", (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
        }

        // Get current users data
        data = JSON.parse(data.toString())

        // Get the id of last user
        var last_item_id = data.users[data.users.length - 1].id

        //Add new user
        data.users.push({id: last_item_id + 1, email: email, password: password}); //add some data
        var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({status, message})
                return
            }
        });
    });

// Create token for new user
    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
    const {email, password} = req.body;
    if (isAuthenticated({email, password}) === false) {
        res.status(401).json({status: 401, message: 'Incorrect email or password'})
        return
    }
    res.status(200).json({access_token: createToken({email, password})})
})

server.get('/me', (req, res) => {
    let verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1])
    if (verifyTokenResult instanceof Error) {
        res.status(401).json({status: 401, message: 'Access token not provided'})
        return
    }
    res.status(200).json(userdb.users.find(user => user.email === verifyTokenResult.email && user.password === verifyTokenResult.password))
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.status(401).json({status: 401, message: 'Error in authorization format'})
        return
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

        if (verifyTokenResult instanceof Error) {
            res.status(401).json({status: 401, message: 'Access token not provided'})
            return
        }
        res.header('Access-Control-Allow-Origin', 'http://localhost:3232')
        res.header('Access-Control-Allow-Headers', '*')
        next()
    } catch (err) {
        res.status(401).json({status: 401, message: 'Error access_token is revoked'})
    }
})

server.use(router)

server.listen(8001, () => {
    console.log('http://localhost:8001')
})