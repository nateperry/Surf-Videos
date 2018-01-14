import React, { Component } from 'react';
import SearchInput from './components/SearchInput';
import ResultList from './components/ResultList';
import _assignIn from 'lodash/assignIn';
import _debounce from 'lodash/debounce';
import _has from 'lodash/has';
import _isEmpty from 'lodash/isEmpty';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      requesting: false,
      currentItems: null,
      resultsCache: {}
    };

    this.debouncedSearchQuery = _debounce(this.searchQuery.bind(this), 500);
    this.onResultsLoaded = this.onResultsLoaded.bind(this);
    this.onSearchError = this.onSearchError.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
  }

  reset() {
    this.setState({
      query: '',
      currentItems: null
    });
  }

  searchQuery() {
    const q = this.state.query;
    if (_isEmpty(q.trim())) {
      this.reset();
      return;
    }

    if (_has(this.state.resultsCache, q)) {
      this.setState({
        currentItems: this.state.resultsCache[q].items
      });
      return;
    }

    this.setState({requesting: true}, () => {
      const urlBase = 'https://www.googleapis.com/youtube/v3/search';
      fetch(`${urlBase}?key=${this.props.apiKey}&part=snippet&type=video&q=${'surf ' + q}`)
        .then(response => {
          if (response.ok && response.status === 200) {
            response.json().then(results => {
              this.onResultsLoaded(results, q);
            });
          } else {
            this.onSearchError();
          }
        }, this.onSearchError);
    });
  }

  onResultsLoaded(results, query) {
    const newCache = _assignIn({}, this.state.resultsCache, {
      [query]: results
    });

    // check that this request is still the current query
    // as it may have changed while loading
    if (query !== this.state.query) {
      this.setState({
        resultsCache: newCache
      });
      return;
    }
    this.setState({
      requesting: false,
      currentItems: results.items,
      resultsCache: newCache
    });
  }

  onSearchError() {
    this.setState({
      requesting: false,
      errors: 'An Error occurred'
    });
  }

  onQueryChange(query) {
    this.setState({query}, this.debouncedSearchQuery);
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-header__title">Surf Videos</h1>
          <SearchInput
            query={this.state.query}
            onQueryChange={this.onQueryChange}
          />
        </header>
        {this.state.currentItems ? (
          <ResultList
            items={this.state.currentItems}
            loading={this.state.requesting}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
