# D-Authenticator

# Technology stack

## IPFS/Filecoin:

Utilizamos IPFS para el almacenamiento de la metadata y los archivos de imaganes de los NFT.

- Para el proceso de subir la imagen desde la pagina web a NFT.storage, el cual es nuestro servicio principal para almacenamiento. 

Este es el codigo en el server para subir el NFT.

Mas detalles en [Server](./Server/serverv3.js)

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

- Para acceder a estos datos utilizamos un RPC provider de Moralis, obteniendo los datos del NFT directamente desde el SmartContract.

Mas detalles [Scan](./WebPage/src/pages/scan.js)

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

- Aqui un Screen shot de nuestro servicio de NFT.Storage

<img src="https://i.ibb.co/pwxkPHC/image.png">
