import React, {Component} from 'react';
import VideoResult from './VideoResult';
import _get from 'lodash/get';
import _map from 'lodash/map';

class ResultList extends Component {
  render() {
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
        <header className="result-list__header">
          <span>Showing {items.length} out of {this.props.total}</span>
        </header>
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