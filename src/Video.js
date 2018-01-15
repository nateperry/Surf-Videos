import React, {Component} from 'react';
import moment from 'moment';

class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      video: null
    };

    this.requestVideo = this.requestVideo.bind(this);
    this.onVideoLoaded = this.onVideoLoaded.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    this.setState({loading: true}, this.requestVideo)
  }

  requestVideo() {
    const parts = ['contentDetails', 'player', 'snippet'].join(',');



    let url = `https://www.googleapis.com/youtube/v3/videos?key=${this.props.apiKey}&id=${this.props.videoId}&part=${parts}`;
    fetch(url).then(response => {
        if (response.ok && response.status === 200) {
          response.json().then(results => {
            this.onVideoLoaded(results);
          });
        } else {
          this.onError();
        }
      }, this.onError);
  }

  onVideoLoaded(response) {
    this.setState({
      loading: false,
      video: response.items[0]
    });
  }

  onError() {
    // TODO
  }

  render() {
    return (
      <div className="video">
        {this.state.loading || !this.state.video ? (
          <div className="loader"/>
        ) : (
          <div>
            <div className="video__player" dangerouslySetInnerHTML={{__html: this.state.video.player.embedHtml}}/>
            <h3 className="video__title">{this.state.video.snippet.title}</h3>
            <span className="video__meta">Posted by {this.state.video.snippet.channelTitle} on {moment(this.state.video.snippet.publishedAt).format('MMMM D, YYYY')}</span>
            <p>{this.state.video.snippet.description}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Video;