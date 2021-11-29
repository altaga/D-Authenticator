[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [<img src="https://img.shields.io/badge/View-Website-blue">](https://www.d-authenticator.online/) [<img src="https://img.shields.io/badge/View-Video-red">](https://www.youtube.com/watch?v=Q0_sihBl1NI)

#### Live: https://www.d-authenticator.online/
### Main Video!: https://www.youtube.com/watch?v=Q0_sihBl1NI

# D-Authenticator

Welcome everyone, we are D-Authenticator

A platform and Marketplace where you can NFTize offline assets such as collectibles, sneakers, watches and more.

# Introduction

The online market for luxury, clothing, sneakers, watches and electronics is huge, and will continue to grow and its assets have really appreciated. (pones una imagen de una madre que esté bien pinche cara sin ser originalmente tan cara)

But the number of problems has also grown. Although companies such as Goat and Stockx have gone to great lengths to combat the Fakes market, meaning reproductions sometimes great fake reproductions of a certain asset, they rely on legacy systems and a huge operation to do so.

<img src="https://www.consultancy.eu/illustrations/news/detail/2020-11-19-095145419-Personal-luxury-goods-market-by-generation-_-Personal-luxury-goods-market-by-channel.jpg"> 


And the buyer has also become more and more sophisticated, asking for better and better systems. 

If only we could use some kind of technology to authenticate and provide non-fungible ownership to those buyers.

Enter D-authenticator, we NFTize collectibles, sneakers, watches and more providing another layer of security and confidence in that process of buying and selling products.
speech.

# Solution 

Here is the system's Architecture:

<img src="https://i.ibb.co/pWt1KMb/esquemabueno.png">


# Technology stack

## Polygon 

Polygon is the base for Minting, buying, trading and everything Smart Contracts on our platform. It bring us great EVM compatibility.

<img src="https://i.ibb.co/wzsjPLM/polygon.png">


## Alchemy

Alchemy is used for all the smart contract interactions such as metadata and some variables are managed through it.

<img src="https://es.crypto-economy.com/wp-content/uploads/sites/2/2021/07/polygon-2-1024x576-1.jpg" width="400">


## IPFS/Filecoin:


Explicar cada uno de estos snippets-------------------

We use IPFS for the storage of metadata and NFT image files.
This for the process of uploading the image from the website to NFT.storage, which is our main storage service. Apart from that we use it to link to our smart contracts in order to Mint that off-chain real asset.

This is the code on the server to upload the NFT.More details on:

More details on: [Server](./Server/serverv3.js)

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

- To access this data we use a Moralis RPC provider, obtaining the NFT data directly from the Smart Contract.

More Details [Scan](./WebPage/src/pages/scan.js)

    this.unirest('GET', `https://deep-index.moralis.io/api/v2/nft/${addr}?chain=mumbai&format=hex&order=DESC`)
    .headers({
        'accept': 'application/json',
        'X-API-Key': 'XXXXXXXXXXXX'
    })
    .end(function (res) {
        if (res.error) throw new Error(res.error);
        self.setState({
            spaceQR: "none",
            loading: false,
            res: JSON.parse(res.body.result[0].metadata),
            address: addr
        })
    });

- Here is a Screen shot of our NFT.Storage service

<img src="https://i.ibb.co/pwxkPHC/image.png">
