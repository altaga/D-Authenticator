// Basic imports
import '../assets/main.css';
import '../assets/fontawesome.min.css'
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Input, Row } from 'reactstrap';
import { Grid } from 'react-loading-icons';
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { connect } from 'react-redux';
import { abi } from '../contracts/nftContract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import maticToken from "../assets/matic-token.png"
import logoPoly from '../assets/logo-ether.png'
import Web3 from 'web3';
import nftized from '../assets/nftized.png'
import pending from '../assets/pending.png'
import QRCode from "react-qr-code";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const dataweb3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/XXXXXXXXXXXXXXXXXXXXX");

function timestampToDate(timestamp) {
    return new Date(timestamp).toLocaleString()
}

class Nft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false,
            extra_info: false,
            price: "0",
            actualAddress: false,
            increaseState: false,
            bid: "0",
            contract: "",
            account: "",
            extraData: {},
            status: true,
            image_url: "",
            youtube: "",
            long: "",
            owners: [],
            nftrev: false,
        }
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
        this.url_params = new URLSearchParams(this.props.location.search)
    }

    async componentDidMount() {
        const pub = this.props.match.params.pub;
        this.unirest('GET', 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/getDB')
            .headers({
                'pubkey': pub
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (res.body.length > 0) {
                    let temp = JSON.parse(res.body[this.url_params.get('id')].Data);
                    temp["awsimage"] = res.body[this.url_params.get('id')].Url;
                    const mint_contract = new dataweb3.eth.Contract(abi(), res.body[this.url_params.get('id')].Contract);
                    let addr = res.body[0].Contract
                    let self = this;
                    this.unirest('GET', `https://deep-index.moralis.io/api/v2/${addr}?chain=mumbai`)
                        .headers({
                            'accept': 'application/json',
                            'X-API-Key': 'm9N2QaqpjstRatg7qJFFMebq6qrggD1jSpsV0NlnelPOKd4wp3wvGNV5T7xC5kUF'
                        })
                        .end(function (res) {
                            if (res.error) throw new Error(res.error);
                            let owners = []
                            let temp = res.body.result
                            for (let i = 0; i < temp.length; i++) {
                                if (i === temp.length - 1) {
                                    temp[i].event = "Mint"
                                    owners.push(temp[i])
                                }
                                else if (temp[i].value > "0") {
                                    temp[i].event = "Transfer"
                                    owners.push(temp[i])
                                }
                            }
                            owners = owners.reverse()
                            let ownArr = []
                            for (let i = 0; i < owners.length; i++) {
                                ownArr.push(owners[i].from_address)
                            }
                            for (let i = 1; i < owners.length; i++) {
                                owners[i].from_address = ownArr[i - 1]
                                owners[i].to_address = ownArr[i]
                            }
                            owners = owners.reverse()
                            self.setState({
                                owners: owners
                            })
                        });
                    this.setState({
                        data: temp,
                        extra_info: res.body[this.url_params.get('id')],
                        contract: res.body[this.url_params.get('id')].Contract
                    });
                    mint_contract.methods.price().call().then(price => {
                        this.setState({
                            price: price,
                            bid: price
                        });
                    });
                    mint_contract.methods.revCheck().call().then(nftrev => {
                        this.setState({
                            nftrev: nftrev
                        });
                    });
                    mint_contract.methods.flag().call().then(status => {
                        this.setState({
                            status: status
                        });
                    });
                    mint_contract.methods.actualAddress().call().then(actualAddress => {
                        this.setState({
                            actualAddress: actualAddress
                        });
                    });
                }
                else {

                }
            });
        this.unirest('GET', 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/getExtraData')
            .headers({
                'pubkey': pub,
                'id': this.url_params.get('id')
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                if (this.state.extraData["extraData"] === undefined) {
                    this.setState({
                        extraData: res.body
                    });
                }
                else {
                    this.setState({
                        extraData: res.body,
                        image_url: res.body.extraData.image_url,
                        youtube: res.body.extraData.youtube,
                        long: res.body.extraData.long
                    });
                }
            });
    }

    async increaseBid() {
        if (this.props.my_pubkey.pubkey !== "") {
            const mint_contract = new this.web3.eth.Contract(abi(), this.state.contract, { from: this.props.my_pubkey.pubkey });
            mint_contract.methods.bidUp().send({ from: this.props.my_pubkey.pubkey, value: this.state.bid }).on('transactionHash', (hash) => {
            }).on('confirmation', (confirmationNumber, receipt) => {
                if (confirmationNumber === 1) {
                    window.location.reload();
                }
            })
        }
    }

    async sell() {
        if (this.props.my_pubkey.pubkey !== "") {
            const mint_contract = new this.web3.eth.Contract(abi(), this.state.contract, { from: this.props.my_pubkey.pubkey });
            mint_contract.methods.finish().send({ from: this.props.my_pubkey.pubkey }).on('transactionHash', (hash) => {
            }).on('confirmation', (confirmationNumber, receipt) => {
                if (confirmationNumber === 1) {
                    window.location.reload();
                }
            })
        }
    }

    updateDB() {
        this.unirest('GET', 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/pubExtraDataDB')
            .headers({
                'image': this.state.image_url,
                'long': this.state.long,
                'youtube': this.state.youtube,
                'id': this.url_params.get('id'),
                'pubkey': this.props.match.params.pub
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                window.location.reload();
            });
    }

    render() {
        return (
            <div className="App" style={{ overflowX: "hidden" }}>
                <Header />
                {
                    this.state.data ?
                        <div className="body-style2" id="body-style">
                            <div>
                                <Row>
                                    <Col xs={4}>
                                        <div style={{ opacity: "100%", textAlign: "center", paddingTop: "2vh" }} >
                                            <img style={{ width: "80%", borderRadius: "10px", border: "1px solid #bbb" }} src={`${this.state.data["awsimage"]}`} alt="Card images cap" />
                                        </div>
                                        <div style={{ opacity: "100%", textAlign: "center", paddingTop: "4vh" }} >
                                            {
                                                this.props.my_pubkey.pubkey !== "0x50eecbdc306c3e756effb022f8e102ae28294018" ?
                                                    <>
                                                        <h3>Review Status:</h3>
                                                        {
                                                            this.state.nftrev ?
                                                                <>
                                                                    <img width="40%" src={nftized} alt="Card images cap" />
                                                                    <p />
                                                                    <QRCode value={this.state.contract} />
                                                                </>
                                                                :
                                                                <>
                                                                    <img width="80%" src={pending} alt="Card images cap" />
                                                                </>
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        {
                                                            this.state.nftrev ?
                                                                <>
                                                                    <h3>Review Status:</h3>
                                                                    <img width="40%" src={nftized} alt="Card images cap" />
                                                                    <p />
                                                                    <QRCode value={this.state.contract} />
                                                                </>
                                                                :
                                                                <>
                                                                    <h3>NFTize it</h3>
                                                                    <Button onClick={
                                                                        () => {
                                                                            const mint_contract = new this.web3.eth.Contract(abi(), this.state.contract, { from: this.props.my_pubkey.pubkey });
                                                                            mint_contract.methods.revactivate().send().on('confirmation', (confirmationNumber, receipt) => {
                                                                                if (confirmationNumber === 1) {
                                                                                    window.location.reload();
                                                                                }
                                                                            })
                                                                        }}
                                                                        style={{ width: "200px", borderRadius: "25px", fontSize: "1.3rem", background: ` #000` }}
                                                                    >
                                                                        <div style={{ fontSize: "2rem" }}>
                                                                            Approve
                                                                        </div>
                                                                    </Button>
                                                                </>
                                                        }
                                                    </>
                                            }
                                        </div>
                                    </Col>
                                    <Col xs={7}>
                                        <div style={{ textAlign: "center", paddingTop: "20px" }}>
                                            <div>
                                                <Card style={{ fontSize: "1.5rem" }}>
                                                    <CardHeader>
                                                        Product Name: {this.state.data.name}
                                                        <p />

                                                    </CardHeader>
                                                    <CardBody>
                                                        Description: {this.state.data.description}
                                                        <p />
                                                    </CardBody>
                                                    <CardFooter>
                                                        <Row>
                                                            <Col xs="6">
                                                                Brand: {this.state.data.attributes[0].brand}
                                                            </Col>
                                                            <Col xs="6">
                                                                Year: {this.state.data.attributes[0].release_date}
                                                            </Col>
                                                        </Row>
                                                    </CardFooter>
                                                </Card>
                                                <div style={{ marginTop: "5vh", marginBottom: "5vh" }} className="myhr2" />
                                                <Row>
                                                    <Col>
                                                        {
                                                            this.props.my_pubkey.pubkey !== "" &&
                                                            <>
                                                                {
                                                                    this.props.my_pubkey.pubkey === this.props.match.params.pub ?
                                                                        <>{this.state.status ?
                                                                            <Row>
                                                                                <Col>
                                                                                    <Button id="sell-button" style={{ width: "200px", borderRadius: "25px", fontSize: "2rem", background: ` #000` }} onClick={() => {
                                                                                        if (this.state.actualAddress !== "0x0000000000000000000000000000000000000000") {
                                                                                            document.getElementById("sell-button").disabled = true;
                                                                                            document.getElementById("sell-button").innerHTML = "Selling...";
                                                                                            this.sell();
                                                                                        }
                                                                                    }}>
                                                                                        Sell
                                                                                    </Button>
                                                                                </Col>
                                                                            </Row> :
                                                                            <Row>
                                                                                <Col>
                                                                                    <Button disabled id="sell-button" style={{ width: "200px", borderRadius: "25px", fontSize: "2rem", background: ` #000` }} >
                                                                                        Sold
                                                                                    </Button>
                                                                                </Col>
                                                                            </Row>
                                                                        }
                                                                        </> :
                                                                        <>
                                                                            {
                                                                                this.state.status ?
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <div className="flexbox-style">
                                                                                                <Input type="number" value={dataweb3.utils.fromWei(this.state.bid, "ether")} onChange={(event) => {
                                                                                                    try {
                                                                                                        if ((parseFloat(event.target.value) > parseFloat(dataweb3.utils.fromWei(this.state.price, "ether"))) && (this.state.nftrev)) {
                                                                                                            this.setState({
                                                                                                                increaseState: true
                                                                                                            })
                                                                                                        }
                                                                                                        else {
                                                                                                            this.setState({
                                                                                                                increaseState: false
                                                                                                            })
                                                                                                        }
                                                                                                        this.setState({
                                                                                                            bid: dataweb3.utils.toWei(event.target.value, "ether")
                                                                                                        })
                                                                                                    }
                                                                                                    catch (e) {
                                                                                                    }
                                                                                                }} />
                                                                                                <div>
                                                                                                    &nbsp;
                                                                                                </div>
                                                                                                <img width="30px" src={maticToken}></img>
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <Button id="bid-button" disabled={!this.state.increaseState} style={{ width: "200px", borderRadius: "25px", fontSize: "1.5rem", background: ` #000` }} onClick={() => {
                                                                                                this.setState({
                                                                                                    increaseState: false
                                                                                                })
                                                                                                document.getElementById("bid-button").innerHTML = "Bidding...";
                                                                                                this.increaseBid()
                                                                                            }}>
                                                                                                Increase Bid
                                                                                            </Button>
                                                                                        </Col>
                                                                                    </Row> :
                                                                                    <Row>
                                                                                        <Col>
                                                                                            <Button disabled id="sell-button" style={{ width: "200px", borderRadius: "25px", fontSize: "2rem", background: ` #000` }} >
                                                                                                Sold
                                                                                            </Button>
                                                                                        </Col>
                                                                                    </Row>
                                                                            }
                                                                        </>
                                                                }
                                                            </>
                                                        }
                                                        <br></br>
                                                        <Card style={{ fontSize: "2rem" }}>
                                                            {
                                                                (this.state.actualAddress && this.state.actualAddress !== "0x0000000000000000000000000000000000000000") ?
                                                                    <Row>
                                                                        {
                                                                            !this.state.status ?
                                                                                <>
                                                                                    <Col>
                                                                                        {`Sold by: ${dataweb3.utils.fromWei(this.state.price, "ether")} `}
                                                                                        <img width="30px" src={maticToken}></img>
                                                                                    </Col>
                                                                                    <Col style={{ fontSize: "1.2rem" }}>
                                                                                        {`Sold to:`}
                                                                                        <a href={`https://mumbai.polygonscan.com/address/${this.state.actualAddress}`} target="_blank" rel="noopener noreferrer">
                                                                                            <div>
                                                                                                {`${this.state.actualAddress.substring(0, 21)}`}
                                                                                            </div>
                                                                                            <div>
                                                                                                {`${this.state.actualAddress.substring(21, 42)}`}
                                                                                            </div>
                                                                                        </a>
                                                                                    </Col>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <Col>
                                                                                        {`Last Bid: ${dataweb3.utils.fromWei(this.state.price, "ether")} `}
                                                                                        <img width="30px" src={maticToken}></img>
                                                                                    </Col>
                                                                                    <Col style={{ fontSize: "1.2rem" }}>
                                                                                        {`Bid from:`}
                                                                                        <a href={`https://mumbai.polygonscan.com/address/${this.state.actualAddress}`} target="_blank" rel="noopener noreferrer">
                                                                                            <div>
                                                                                                {`${this.state.actualAddress.substring(0, 21)}`}
                                                                                            </div>
                                                                                            <div>
                                                                                                {`${this.state.actualAddress.substring(21, 42)}`}
                                                                                            </div>
                                                                                        </a>
                                                                                    </Col>
                                                                                </>
                                                                        }
                                                                    </Row> :
                                                                    <Row>
                                                                        <Col>
                                                                            {`Min Bid: ${dataweb3.utils.fromWei(this.state.price, "ether")} `}
                                                                            <img width="30px" src={maticToken}></img>
                                                                        </Col>
                                                                        <Col style={{ fontSize: "1.2rem" }}>
                                                                            {`Mint from:`}
                                                                            <a href={`https://mumbai.polygonscan.com/address/${this.props.match.params.pub}`} target="_blank" rel="noopener noreferrer">
                                                                                <div>
                                                                                    {`${this.props.match.params.pub.substring(0, 21)}`}
                                                                                </div>
                                                                                <div>
                                                                                    {`${this.props.match.params.pub.substring(21, 42)}`}
                                                                                </div>
                                                                            </a>
                                                                        </Col>
                                                                    </Row>
                                                            }
                                                        </Card>
                                                    </Col>
                                                </Row>
                                                <div style={{ marginTop: "5vh", marginBottom: "2vh" }} className="myhr2" />
                                                <br />
                                                <Row>
                                                    <Col>
                                                        <Button style={{ width: "60%", height: "100%", borderWidth: "1px", borderColor: "black", borderRadius: "25px", fontSize: "1.5rem", background: `#FFF`, color: "black" }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${this.state.contract}`, "_blank")}>
                                                            <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                                                                View on
                                                            </div>
                                                            <img src={logoPoly} alt="logoPoly" width="100%" />
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button style={{ borderWidth: "1px", borderColor: "black", width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #FFF`, color: "black" }} onClick={() => window.open(this.state.data.external_url, "_blank")}>Brand URL</Button>
                                                    </Col>
                                                </Row>
                                                <p />
                                                <h3>
                                                    Owners:
                                                </h3>
                                                <p />
                                                <Card style={{ fontSize: "1rem", border: "gray 1px solid" }}>
                                                    <Row md={5}>
                                                        <Col>
                                                            Event
                                                        </Col>
                                                        <Col>
                                                            Price
                                                        </Col>
                                                        <Col>
                                                            From
                                                        </Col>
                                                        <Col>
                                                            To
                                                        </Col>
                                                        <Col>
                                                            Date
                                                        </Col>
                                                    </Row>
                                                    <p />
                                                    {
                                                        this.state.owners.map((owner, index) =>
                                                            <Row md={5} key={index}>
                                                                <Col>
                                                                    {owner.event}
                                                                </Col>
                                                                <Col>
                                                                    {owner.value / 1000000000000000000} MATIC
                                                                </Col>
                                                                <Col>
                                                                    <a href={`https://mumbai.polygonscan.com/address/${owner.from_address}`}>{owner.from_address.substring(0, 5)}...{owner.from_address.substring(owner.from_address.length - 5, owner.from_address.length)}</a>
                                                                </Col>
                                                                <Col>
                                                                    <a href={`https://mumbai.polygonscan.com/address/${owner.to_address}`}>{owner.to_address.substring(0, 5)}...{owner.to_address.substring(owner.to_address.length - 5, owner.to_address.length)}</a>
                                                                </Col>
                                                                <Col>
                                                                    {timestampToDate(Date.parse(owner.block_timestamp))}
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                </Card>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <br />
                            {
                                this.props.my_pubkey.pubkey === this.props.match.params.pub ?
                                    <>
                                        <div style={{ marginTop: "4vh" }} className="myhr2" />
                                        <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                            <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                Collectible Details
                                            </div>
                                        </div>
                                        {
                                            (this.state.extraData["extraData"] !== undefined) ?
                                                <>
                                                    {
                                                        this.state.extraData.extraData.youtube !== "" ?
                                                            <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                                                <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                                    <iframe
                                                                        width="853"
                                                                        height="480"
                                                                        src={`https://www.youtube.com/embed/${this.state.extraData.extraData.youtube.replace("https://www.youtube.com/watch?v=", "")}`}
                                                                        frameBorder="0"
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                        allowFullScreen
                                                                        title="Embedded youtube"
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            <Row md="1" style={{ padding: "1vh 0vh 1vh 0vh", width: "50vw", margin: "auto" }}>
                                                                <Col style={{ padding: "20px" }}>
                                                                    <Row>
                                                                        <Col>
                                                                            <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                                                                                <Input id="yt1" style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem" }} type="text" placeholder="YT Link" onChange={() => {
                                                                                    this.setState({
                                                                                        youtube: document.getElementById("yt1").value
                                                                                    })
                                                                                }} />
                                                                                <Button onClick={() => this.updateDB()} style={{ width: "200px", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #000` }}>Upload</Button>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                    }
                                                    {
                                                        this.state.extraData.extraData.image !== "" ?
                                                            <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                                                <Row>
                                                                    <Col>
                                                                        <div style={{ width: "100%", height: "auto" }}>
                                                                            <img width="80%" src={this.state.extraData.extraData.image} alt="imagesa" />
                                                                        </div>
                                                                    </Col>
                                                                    <Col>
                                                                        <div style={{ textAlign: "start", fontWeight: "bold", fontSize: "2rem", paddingBottom: "4vh" }}>
                                                                            {this.state.data.name}
                                                                        </div>
                                                                        <div style={{ textAlign: "start", fontWeight: "normal", fontSize: "1rem", paddingRight: "10vw" }}>
                                                                            {
                                                                                this.state.extraData.extraData.long
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </div> :
                                                            <Row md="1" style={{ padding: "1vh 0vh 1vh 0vh", width: "50vw", margin: "auto" }}>
                                                                <Col style={{ padding: "20px" }}>
                                                                    <Row>
                                                                        <Col>
                                                                            <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                                                                                <Input id="img1" style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem" }} type="text" placeholder="Image" onChange={() => {
                                                                                    this.setState({
                                                                                        image_url: document.getElementById("img1").value
                                                                                    })
                                                                                }} />
                                                                                <Button onClick={() => this.updateDB()} style={{ width: "200px", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #000` }}>Upload</Button>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                    }
                                                </>
                                                :
                                                <Row md="1" style={{ padding: "0vh 0vh 4vh 0vh", width: "50vw", margin: "auto" }}>
                                                    <Col style={{ padding: "20px" }}>
                                                        <Row>
                                                            <Col>
                                                                <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                                                                    <Input id="yt1" style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem" }} type="text" placeholder="YT Link" onChange={() => {
                                                                        this.setState({
                                                                            youtube: document.getElementById("yt1").value
                                                                        })
                                                                    }} />
                                                                    <Button onClick={() => this.updateDB()} style={{ width: "200px", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #000` }}>Upload</Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col style={{ padding: "20px" }}>
                                                        <Row>
                                                            <Col>
                                                                <div style={{ width: "90%", paddingLeft: "5%" }} className="flexbox-style">
                                                                    <Input id="img1" style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem" }} type="text" placeholder="Image" onChange={() => {
                                                                        this.setState({
                                                                            image_url: document.getElementById("img1").value
                                                                        })
                                                                    }} />
                                                                    <Button onClick={() => this.updateDB()} style={{ width: "200px", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #000` }}>Upload</Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            (this.state.extraData["extraData"] !== undefined) &&
                                            <>
                                                <div style={{ marginTop: "4vh" }} className="myhr2" />
                                                <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                                    <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                        Collectible Details
                                                    </div>
                                                </div>
                                                {
                                                    this.state.extraData.extraData.youtube !== "" &&
                                                    <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                                        <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                            <iframe
                                                                width="853"
                                                                height="480"
                                                                src={`https://www.youtube.com/embed/${this.state.extraData.extraData.youtube.replace("https://www.youtube.com/watch?v=", "")}`}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                                title="Embedded youtube"
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    this.state.extraData.extraData.image !== "" &&
                                                    <div style={{ marginTop: "4vh", marginBottom: "4vh" }}>
                                                        <Row>
                                                            <Col>
                                                                <div style={{ width: "100%", height: "auto" }}>
                                                                    <img width="80%" src={this.state.extraData.extraData.image} alt="imagesa" />
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                <div style={{ textAlign: "start", fontWeight: "bold", fontSize: "2rem", paddingBottom: "4vh" }}>
                                                                    {this.state.data.name}
                                                                </div>
                                                                <div style={{ textAlign: "start", fontWeight: "normal", fontSize: "1rem", paddingRight: "10vw" }}>
                                                                    {
                                                                        this.state.extraData.extraData.long
                                                                    }
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </>
                            }
                        </div>
                        :
                        <>
                            <div className="body-style">
                                <div style={{ paddingTop: "25vh" }}>
                                    <Grid fill="black" />
                                </div>
                            </div>
                        </>
                }
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_pubkey_action,
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nft);