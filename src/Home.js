import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Header,
  Button,
  Container,
  Segment,
  Icon,
  Dimmer,
  Loader,
  Message,
  Input,
  Label
} from "semantic-ui-react";
import QS from "querystring";
import axios from "axios";
import copy from "copy-to-clipboard";
import ReactJson from "react-json-view";
import getParameterByName from "./lib/getParameterByName";

import "semantic-ui-css/semantic.min.css";
import "./Home.css";

const HOST = "http://localhost:3000";
//const API = "http://localhost:8020/fabiobaser/StreamShare";
const API = "https://fabiobaser.lib.id/streamshare@0.0.3";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copyMessage: null,
      errorMessage: null,
      inputLink: "",
      data: false,
      initial: true
    };
  }
  handleGenerate = () => {
    if (this.state.inputLink == "") {
      this.setState({ errorMessage: "No Link inserted 🤷‍" });
      return;
    }
    this.setState({ initial: false, loading: true, errorMessage: null });
    axios
      .get(
        API + "/fetch/?trackID=" + getParameterByName("i", this.state.inputLink)
      )
      .then(apiResponse => {
        console.log(apiResponse.data);
        if (apiResponse.data.success) {
          let a = apiResponse.data.payload;
          let streamLinkString = "";
          a.links.map((link, index) => {
            if (link[Object.keys(link)[0]] != null) {
              streamLinkString =
                streamLinkString +
                `&${Object.keys(link)[0]}=${link[Object.keys(link)[0]]}`;
            }
          });
          console.log(streamLinkString);
          let viewerLink = `/viewer?title=${
            a.title
          }&cover=${a.artwork.url
            .replace("{w}", "200")
            .replace("{h}", "200")}&artist=${a.artist}${streamLinkString}`;
          this.setState({
            data: apiResponse.data.payload,
            viewerLink,
            loading: false
          });
        } else {
          this.setState({
            data: false,
            loading: false,
            errorMessage: "Nothing found 🙈"
          });
        }
      })
      .catch(err => {
        this.setState({
          data: false,
          loading: false,
          errorMessage: "Oh-oh something went wrong 😱"
        });
        console.error(err);
      });
  };
  handleCopy = (e, data) => {
    let link = data.link;
    copy(data.link);
    this.setState({ copyMessage: "Copied to Clipboard 👍" });
    let timer = setTimeout(() => {
      this.setState({ copyMessage: null });
    }, "2000");
  };
  handleInputChange = (e, data) => {
    this.setState({ inputLink: data.value, errorMessage: null });
  };

  render() {
    const { data, copyMessage, errorMessage, viewerLink } = this.state;

    var Link_appleMusic;
    var Link_spotify;

    if (typeof data.links == "undefined") {
      Link_appleMusic = null;
      Link_spotify = null;
    } else {
      if (typeof data.links[0].appleMusic !== "undefined") {
        Link_appleMusic = (
          <Segment>
            <Icon name="apple" />
            AppleMusic
            <Button
              link={
                data.links != null &&
                typeof data.links[0].appleMusic !== "undefined"
                  ? data.links[0].appleMusic
                  : ""
              }
              icon
              basic
              onClick={this.handleCopy}>
              <Icon name="copy outline" color="blue" />
            </Button>
          </Segment>
        );
      }

      if (typeof data.links[1].spotify !== "undefined") {
        Link_spotify = (
          <Segment>
            <Icon name="spotify" />
            Spotify
            <Button
              link={
                data.links != null &&
                typeof data.links[1].spotify !== "undefined"
                  ? data.links[1].spotify
                  : ""
              }
              icon
              basic
              onClick={this.handleCopy}>
              <Icon name="copy outline" color="blue" />
            </Button>
          </Segment>
        );
      }
    }

    return (
      <div id="Home">
        <Header as="h1">
          StreamShare
          <span style={{ fontWeight: "bold" }}>Generator</span>
        </Header>
        <Header as="h2">
          Generate Links the most popular Streaming Service for your desired
          Track (currently only supports AppleMusic)
        </Header>
        <Container id="inputContainer">
          {/* <Input
            fluid
            label="Input Service"
            placeholder="applemusic"
            disabled
            style={{ marginBottom: "2rem" }}
          /> */}
          <Input
            style={{ boxShadow: "0 0 20px #0000001f", borderRadius: "10px" }}
            onChange={this.handleInputChange}
            icon={
              <Icon
                name="search"
                color="pink"
                inverted
                circular
                link
                onClick={this.handleGenerate}
              />
            }
            onKeyDown={e => {
              if (e.keyCode == 13) {
                this.handleGenerate();
              }
            }}
            labelPosition="left"
            label={
              <Label basic style={{ border: "none" }}>
                Track Link
              </Label>
            }
            type="text"
            placeholder="Paste Link here"
          />
        </Container>
        <Segment id="contentSegment" textAlign="center">
          <Dimmer active={this.state.loading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          {typeof data.title !== "undefined" ? (
            <Label basic>
              Title: <Label.Detail>{data.title}</Label.Detail>
            </Label>
          ) : null}
          {typeof data.artist !== "undefined" ? (
            <Label basic>
              Artist: <Label.Detail>{data.artist}</Label.Detail>
            </Label>
          ) : null}
          <Segment.Group
            style={{
              border:
                data && data.links.length !== 0
                  ? "1px solid rgba(34,36,38,.15)"
                  : "none"
            }}>
            {Link_appleMusic}
            {Link_spotify}
          </Segment.Group>
          {data ? (
            <Button
              basic
              style={{ float: "inherit" }}
              as={Link}
              to={viewerLink}>
              <Icon name="instagram" />Instagram Viewer
            </Button>
          ) : null}

          {copyMessage ? (
            <Message
              positive
              style={{
                width: "80vw",
                marginLeft: "10vw",
                marginTop: "1rem",
                marginBottom: "1rem"
              }}>
              {copyMessage}
            </Message>
          ) : null}
          {errorMessage ? (
            <Message
              negative
              style={{
                width: "80vw",
                marginLeft: "10vw",
                marginTop: "1rem",
                marginBottom: "1rem"
              }}>
              {errorMessage}
            </Message>
          ) : null}
        </Segment>
      </div>
    );
  }
}

export default Home;
