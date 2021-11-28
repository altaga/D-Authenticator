import React from 'react'
import { post } from 'axios';
import { Button, FormGroup, Input, Label } from 'reactstrap'
import { connect } from 'react-redux'
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import { set_nft_action } from '../redux/actions/syncActions/setNFTaction';
import { set_ipfslink_action } from "../redux/actions/syncActions/updateIPFSaction"
import autoBind from 'react-autobind';
import { Category } from '@material-ui/icons';

class SimpleReactFileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: "",
      description: "",
      releaseDate: "",
      state: "",
      url: "",
      external_url: "",
      brand: "",
      category: "",
    }
    autoBind(this);
    this.unirest = require('unirest');
  }

  onFormSubmit(e) {
    this.fileUpload(this.state.file).then((response) => {
      console.log(response)
      this.props.set_activetab_action(5)
      this.props.set_nft_action(response.data.metadata)
      this.props.set_ipfslink_action(response.data)
    })
  }

  onFileChange(e) {
    console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] })
  }

  fileUpload(file) {
    const url = this.props.url;
    const formData = new FormData();
    formData.append('nft', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'description': this.state.description.replace('"', "'"),
        'external_url': this.state.external_url,
        'name': this.state.name,
        'release_date': this.state.releaseDate,
        'state': this.state.state,
        'category': this.state.category,
        'brand': this.state.brand
      }
    }
    return post(url, formData, config)
  }

  render() {
    return (
      <div className="flexbox-style3" style={{ marginTop: "-100px" }}>
        <form>
          <p />
          <FormGroup>
            <Label for="">Product Name</Label>
            <Input type="text" name="name" placeholder="Your Product" onChange={(event) => {
              this.setState({ name: event.target.value })
            }} />
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Description</Label>
            <Input type="text" name="desc" placeholder="Product Description" onChange={(event) => {
              this.setState({ description: event.target.value })
            }} />
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Category</Label>
            <Input defaultValue="Select Category" type="select" name="cat" placeholder="Select Category" onChange={(event) => {
              if (event.target.value !== "Select Category") {
              this.setState({ category: event.target.value })
              }
            }}>
              <option disabled value="Select Category">Select Category</option>
              <option value="watch">Watches</option>
              <option value="collection">Collectables</option>
              <option value="sneaker">Sneakers</option>
            </Input>
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Brand</Label>
            <Input type="text" name="brand" placeholder="Vitálik Buterin" onChange={(event) => {
              this.setState({ brand: event.target.value })
            }} />
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Brand WebPage</Label>
            <Input type="text" name="brandweb" placeholder="http://example.com" onChange={(event) => {
              this.setState({ external_url: event.target.value })
            }} />
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Release Date</Label>
            <Input type="text" name="release" placeholder="http://example.com" onChange={(event) => {
              this.setState({ releaseDate: event.target.value })
            }} />
          </FormGroup>
          <p />
          <p />
          <FormGroup>
            <Label for="">State</Label>
            <Input defaultValue="Select State" type="select" name="state" placeholder="http://example.com" onChange={(event) => {
              this.setState({ state: event.target.value })
            }}>
              <option disabled value="Select State">Select State</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </Input>
          </FormGroup>
          <p />
          <FormGroup>
            <Label for="">Real Product Image</Label>
            <p />
            <Input type="file" onChange={this.onFileChange} />
            <p />
            <Button id="upload2" style={{ width: "200px", borderRadius: "25px", fontSize: "1.5rem", background: ` #000` }} color="primary" type="submit" onClick={() => {
              document.getElementById("upload2").innerHTML = "Uploading..."
              document.getElementById("upload2").disabled = true
              this.onFormSubmit()
            }}>Upload</Button>
          </FormGroup>
          <p />
        </form>
      </div>
    )
  }
}

const mapDispatchToProps =
{
  set_activetab_action,
  set_nft_action,
  set_ipfslink_action
}

export default connect(null, mapDispatchToProps)(SimpleReactFileUpload);