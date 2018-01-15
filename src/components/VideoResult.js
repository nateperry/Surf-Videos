import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import _get from 'lodash/get';

class VideoResult extends Component {
  render() {
    const item = this.props.item;
    if (!item) {
      return (
        <div className="video-result--placeholder"/>
      );
    }


    const thumbnailUrl = _get(item, 'snippet.thumbnails.default.url', null);
    const title = _get(item, 'snippet.title', '');
    const desc = _get(item, 'snippet.description', '');
    return (
      <Link className="video-result" to={`/watch/${item.id.videoId}`}>
        <div className="video-result__thumbnail" style={{backgroundImage: `url(${thumbnailUrl})`}}/>
        <div className="video-result__details">
          <h4 className="video-result__title">{title}</h4>
          <p className="video-result__description">{desc}</p>
        </div>
      </Link>
    );
  }
}

export default VideoResult;