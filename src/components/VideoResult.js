import React, { Component } from 'react';
import _get from 'lodash/get';

class VideoResult extends Component {
  render() {
    const item = this.props.item;
    const thumbnailUrl = _get(item, 'snippet.thumbnails.default.url', null);
    return (
      <div className="video-result">
        <div className="video-result__thumbnail" style={{backgroundImage: `url(${thumbnailUrl})`}}/>
      </div>
    )
  }
}

export default VideoResult;