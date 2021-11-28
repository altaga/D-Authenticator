import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, CardImg, CardSubtitle, CardTitle, Col, Input, Label, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { abi } from '../contracts/nftContract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import QrReader from 'react-qr-reader'
import { isMobile } from "react-device-detect"
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import logoETH from '../assets/logo-ether.png'
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const dataweb3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/XXXXXXXXXXXXXXXXXXXXX");

function ipfsTohtml(uri) {
    let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
    let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
    return substring + substring2
}

function timestampToDate(timestamp) {
    return new Date(timestamp).toLocaleString()
}

class Scan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraId: "environment",
            spaceQR: "inline",
            devices: ["back", "frontal"],
            delay: 200,
            loading: false,
            res: "",
            address: "",
            owners: []
        }
        autoBind(this);
        this.unirest = require('unirest');
    }

    componentDidMount() {
        /*
        this.setState({
            spaceQR: "none",
            loading: true
        })
        this.checkDisplay("0x5c9711e6b5756f74b8f68ee44c34ce15a532ebb3")
        */
    }

    handleScan(data) {
        if (data !== null && data !== undefined && this.state.spaceQR !== "none") {
            this.setState({
                spaceQR: "none",
                loading: true
            })
            this.checkDisplay(data)
        }
    }

    checkDisplay(addr) {
        let self = this;
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
        this.unirest('GET', `https://deep-index.moralis.io/api/v2/${addr}?chain=mumbai`)
            .headers({
                'accept': 'application/json',
                'X-API-Key': 'XXXXXXXXXXXX'
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
    }

    handleError(err) {
        // Nothing
    }

    camSelect(event) {
        let temp = "environment"
        if (event.target.value === "frontal") {
            temp = "user"
        }
        this.setState({
            cameraId: temp
        })
    }

    render() {
        let previewStyle = {
            width: "100%"
        }
        return (
            <div className="App">
                <Header />
                <div className="body-style3" style={{ fontSize: "1.5rem" }} id="body-style">
                    <div style={{ padding: "20px" }}>
                        <Row md="2">
                            <Col xs="6">
                                {
                                    this.state.spaceQR === "inline" ?
                                        <div style={{ width: "80%" }} className="center-element">
                                            <Input style={previewStyle} onChange={this.camSelect} type="select" name="select" id="cameraSelect">
                                                {
                                                    this.state.devices.map((number, index) => <option key={index}>{number}</option>)
                                                }
                                            </Input>
                                            <QrReader
                                                delay={this.state.delay}
                                                style={previewStyle}
                                                onError={this.handleError}
                                                onScan={this.handleScan}
                                                facingMode={this.state.cameraId}
                                            />
                                        </div>
                                        :
                                        <div style={{ width: "40%" }} className="center-element">
                                            {
                                                this.state.res !== "" &&
                                                <img src={ipfsTohtml(this.state.res.image)} />
                                            }
                                        </div>
                                }
                            </Col>
                            <Col xs="6">
                                <div>
                                    {
                                        this.state.spaceQR === "inline" ?
                                            <div style={{ width: "80%" }} className="center-element">
                                            </div>
                                            :
                                            <div style={{ width: "100%" }}>
                                                {
                                                    this.state.res !== "" &&
                                                    <div>
                                                        <Card style={{border:"black 1px solid"}}>
                                                            <CardHeader>
                                                                Product Name: {this.state.res.name}
                                                                <p />

                                                            </CardHeader>
                                                            <CardBody>
                                                                Description: {this.state.res.description}
                                                                <p />
                                                            </CardBody>
                                                            <CardFooter>
                                                                <Row>
                                                                    <Col xs="6">
                                                                        Brand: {this.state.res.attributes[0].brand}
                                                                    </Col>
                                                                    <Col xs="6">
                                                                        Year: {this.state.res.attributes[0].release_date}
                                                                    </Col>
                                                                </Row>
                                                            </CardFooter>
                                                        </Card>
                                                        <p />
                                                        <hr />
                                                        <p />
                                                        <Row>
                                                            <Col>
                                                                <Button style={{ width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #000` }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${this.state.address}`, "_blank")}>
                                                                    <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                                                                        View on
                                                                    </div>
                                                                    <img src={logoETH} alt="logoeth" width="100%" />
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button style={{ width: "60%", height: "100%", borderRadius: "25px", fontSize: "1.5rem", background: ` #000` }} onClick={() => window.open(this.state.res.external_url, "_blank")}>Brand URL</Button>
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <p />
                                                        <Card style={{ fontSize: "1rem" }}>
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
                                                }
                                            </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps =
{
    set_contracturl_action,
    set_pubkey_action,
    set_activetab_action
}

const mapStateToProps = (state) => {
    return {
        my_contracturl: state.my_contracturl,
        my_pubkey: state.my_pubkey,
        my_ipfslink: state.my_ipfslink,
        my_activetab: state.my_activetab,
        my_nft: state.my_nft
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan);