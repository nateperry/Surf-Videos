import React, { Component } from 'react';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    if (this.props.onQueryChange) {
      this.props.onQueryChange(e.target.value);
    }
  }

  render() {
    return (
      <div className="search">
        <input
          type="text"
          value={this.props.query}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default SearchInput;