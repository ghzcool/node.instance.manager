const http = require('http');
const server = http.createServer();
const express = require('express');
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/'});
const bodyParser = require('body-parser');
const fs = require('fs');

if(!fs.existsSync(__dirname + '/nodes')) {
	fs.mkdirSync(__dirname + '/nodes');
}
if(!fs.existsSync(__dirname + '/db')) {
	fs.mkdirSync(__dirname + '/db');
}
if(!fs.existsSync(__dirname + '/uploads')) {
	fs.mkdirSync(__dirname + '/uploads');
}
if(!fs.existsSync(__dirname + '/downloads')) {
	fs.mkdirSync(__dirname + '/downloads');
}

const NodeRESTService = require("./nodes.services.js");
const SecurityRESTService = require("./security.services.js");

//express
const app = express();
const webRoot = __dirname + '/webroot';
app.use(express.static(webRoot));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//services
const serviceConfig = {
    hasAccess: (service, request, callback) => {
        const token = (request.body || {})["token"] || (request.query || {})["token"] ||
            String(service.headers["authorization"]).split("Token ")[1];
        SecurityRESTService.checkToken(token, (expirationDate) => {
            !!callback && callback(expirationDate, true);
        });
    }
};

const userLogin = new SecurityRESTService.UserLogin(); //not secured
const userGetSelf = new SecurityRESTService.UserGetSelf(serviceConfig);
const userLogout = new SecurityRESTService.UserLogout(serviceConfig);
const userCreate = new SecurityRESTService.UserCreate(serviceConfig);
const renewToken = new SecurityRESTService.RenewToken(serviceConfig);

const systemInfo = new NodeRESTService.SystemInfo(serviceConfig);
const nodeCreate = new NodeRESTService.NodeCreate(serviceConfig);
const nodesList = new NodeRESTService.NodesList(serviceConfig);
const nodeGet = new NodeRESTService.NodeGet(serviceConfig);
const nodeUpdate = new NodeRESTService.NodeUpdate(serviceConfig);
const nodeDelete = new NodeRESTService.NodeDelete(serviceConfig);
const nodeTypesList = new NodeRESTService.NodeTypesList(serviceConfig);
const nodeStart = new NodeRESTService.NodeStart(serviceConfig);
const nodeStop = new NodeRESTService.NodeStop(serviceConfig);
const nodeUpload = new NodeRESTService.NodeUpload(serviceConfig);
const nodeDownload = new NodeRESTService.NodeDownload(serviceConfig);

app.get('/system', (req, res) => systemInfo.call(req, res));
app.get('/nodes', (req, res) => nodesList.call(req, res));
app.get('/node', (req, res) => nodeGet.call(req, res));
app.get('/node/types', (req, res) => nodeTypesList.call(req, res));
app.post('/node', (req, res) => nodeCreate.call(req, res));
app.put('/node', (req, res) => nodeUpdate.call(req, res));
app.delete('/node', (req, res) => nodeDelete.call(req, res));
app.put('/node/start', (req, res) => nodeStart.call(req, res));
app.put('/node/stop', (req, res) => nodeStop.call(req, res));
app.post('/fileupload', upload.single('upload'), (req, res) => nodeUpload.call(req, res));
app.get('/download', (req, res) => nodeDownload.call(req, res));

app.post('/login', (req, res) => userLogin.call(req, res));
app.get('/logout', (req, res) => userLogout.call(req, res));
app.post('/user', (req, res) => userCreate.call(req, res));
app.get('/me', (req, res) => userGetSelf.call(req, res));

app.get('/token/renew', (req, res) => renewToken.call(req, res));

NodeRESTService.init();

//web server
app.get('*', function (req, res) {
    const headers = req.headers;
    if (String(headers.accept).indexOf("text/html") !== -1) {
        res.sendFile(webRoot + '/index.html');
    }
    else {
        res.status(404).send("Not found");
    }
});

const errorHandler = (err) => {
    console.error(err);
};
server.on('request', app);
server.on('error', errorHandler);
server.listen(process.env.port || 3030, () => {
    console.log('Listening on ' + server.address().port);
});