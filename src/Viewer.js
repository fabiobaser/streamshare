import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Header, Button, Container, Icon } from 'semantic-ui-react';
import QS from 'querystring';
import './Viewer.css';

class Viewer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			params: QS.parse(this.props.location.search.slice(1))
		};
	}

	componentWillMount() {}
	render() {
		return (
			<div className="Viewer">
				<div
					className="coverBackground"
					style={{ backgroundImage: 'url("' + this.state.params.cover + '")' }}
				/>
				<Container id="titleContainer" style={{ height: '20vh' }}>
					<Header as="h1">{this.state4.params.title || 'Title'}</Header>
				</Container>
				<Container id="artistContainer">
					<Header as="h2">{this.state.params.artist || 'Artist'}</Header>
				</Container>
				<Container>
					<Button.Group vertical basic size="large">
						{this.state.params.appleMusic ? (
							<Button
								icon
								labelPosition="left"
								href={this.state.params.appleMusic}>
								AppleMusic
								<Icon name="apple" />
							</Button>
						) : null}
						{this.state.params.spotify ? (
							<Button
								icon
								labelPosition="left"
								href={this.state.params.spotify}>
								Spotify
								<Icon name="spotify" />
							</Button>
						) : null}
						{this.state.params.soundcloud ? (
							<Button
								icon
								labelPosition="left"
								href={this.state.params.soundcloud}>
								SoundCloud
								<Icon name="soundcloud" />
							</Button>
						) : null}
						{this.state.params.youtube ? (
							<Button
								icon
								labelPosition="left"
								href={this.state.params.youtube}>
								YouTube
								<Icon name="youtube" />
							</Button>
						) : null}
					</Button.Group>
				</Container>
				<Container id="lastContainer">
					<h3>
						<a href="/">StreamShare</a> powered with ❤️ by
						<a href="https://bitl.it/fabiobaser"> fabiobaser</a>
					</h3>
				</Container>
			</div>
		);
	}
}

export default Viewer;
