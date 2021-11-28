# D-Authenticator

Hacer guia de uso--------------

# Technology stack

## IPFS/Filecoin:


Explicar cada uno de estos snippets-------------------

We use IPFS for the storage of metadata and NFT image files.
This for the process of uploading the image from the website to NFT.storage, which is our main storage service.

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
