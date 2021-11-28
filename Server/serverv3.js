'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const publicIp = require('public-ip');
const { NFTStorage, File } = require('nft.storage');
const AWS = require('aws-sdk');
const fsExtra = require('fs-extra')
const execSync = require('child_process').execSync;

fsExtra.emptyDirSync('./uploads/')

const s3 = new AWS.S3({
  accessKeyId: "XXXXXXXXXXXXXXxx",
  secretAccessKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx"
});

// Constants

const PORT = 8080;
const HOST = '0.0.0.0';

// Tokens

const API_TOKEN = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXx"
const clientnft = new NFTStorage({ token: API_TOKEN })

// API Gateway Link

const APIGATEWAY = "XXXXXXXXXXXXXXXxx.execute-api.us-east-1.amazonaws.com"

// App

const app = express();

// CORS Options

app.use(cors());

// Middleware

app.use(morgan('dev'));
app.use(express.json())
app.use(fileUpload({
  createParentPath: true
}));

// Functions

function ipfsTohtml(uri) {
  let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
  let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
  return substring + substring2
}

function check(json) {
  try {
    if (json.headers.forwarded.replace("host=", "").split(";")[2] === APIGATEWAY) {
      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    return false
  }
}

function getSnapshotFromVideo(uri, name) {
  return new Promise((resolve, reject) => {
    ffmpeg(uri)
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        resolve()
      })
      .screenshots({
        count: 1,
        filename: `${name}.png`,
        folder: './uploads/',
        size: '1280x720'
      })
  })
}

// App routes

app.get('/home', (req, res) => {
  if (check(req)) {
    res.send('Hello From NFT Polygon Server');
  }
  else {
    res.status(401).send("Unauthorized");
  }
});

app.post('/upload-NFT-Storage', async (req, res) => {
  if (check(req)) {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let nft = req.files.nft;
        let my_date = Date.now();
        let dateName = my_date + `.${nft.mimetype.substring(6, nft.mimetype.length)}`;
        await nft.mv('./uploads/' + dateName)
        const file = fs.readFileSync(__dirname + '/uploads/' + dateName);
        let premetadat = {
          name: `${req.headers.name}`,
          external_url: `${req.headers.external_url}`,
          description: `${req.headers.description}`,
          image: new File([file], dateName, { type: `image/${nft.mimetype.substring(6, nft.mimetype.length)}` }),
          attributes: [
            {
              release_date: `${req.headers.release_date}`,
              state: `${req.headers.state}`,
              brand: `${req.headers.brand}`,
              category: `${req.headers.category}`,
            }
          ]
        }
        let metadata = await clientnft.store(premetadat)
        const params = {
          Bucket: 'nft-polygon', // pass your bucket name
          Key: dateName, // file will be saved as 
          Body: file,
          ACL: 'public-read',
          ContentType: `image/${nft.mimetype.substring(6, nft.mimetype.length)}`
        };
        premetadat.image = metadata.url
        s3.upload(params, function (s3Err, data) {
          if (s3Err) throw s3Err;
          fs.unlinkSync('./uploads/' + dateName)
          res.send({
            nft: ipfsTohtml(metadata.url),
            nftaws: data.Location,
            metadata: premetadat
          })
        });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }
});

app.post('*', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let rawdata = fs.readFileSync('filter.json');
  let ips = JSON.parse(rawdata);
  ips["ips"].push(ip);
  let data = JSON.stringify(ips);
  fs.writeFileSync('filter.json', data);
  res.status(401).send("Banned");
});

app.get('*', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let rawdata = fs.readFileSync('filter.json');
  let ips = JSON.parse(rawdata);
  ips["ips"].push(ip);
  let data = JSON.stringify(ips);
  fs.writeFileSync('filter.json', data);
  res.status(401).send("Banned");
});

app.listen(PORT, HOST);

async function ip() {
  const value = await publicIp.v4()
  console.log(`Running on http://${value}:${PORT}`);
}

ip();