import React, {Component} from 'react';
import VideoResult from './VideoResult';
import _get from 'lodash/get';
import _map from 'lodash/map';

class ResultList extends Component {
  render() {
    if (this.props.loading) {
      return (
        <div className="result-list--loading"/>
      );
    }

    const items = this.props.items || [];

    if (items.length === 0) {
      return (
        <div className="result-list--empty">
          <h3>No results found.</h3>
        </div>
      );
    }

    return (
      <div className="result-list">
        {_map(items, (item, i) => {
          return (
            <VideoResult
              item={item}
              key={_get(item, 'id.videoId', `video-${i}`)}
            />
          )
        })}
      </div>
    )
  }
}

export default ResultList;