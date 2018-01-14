import React, {Component} from 'react';
import SearchInput from './components/SearchInput';
import ResultList from './components/ResultList';
import _assignIn from 'lodash/assignIn';
import _concat from 'lodash/concat';
import _debounce from 'lodash/debounce';
import _get from 'lodash/get';
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

    this.reset = this.reset.bind(this);
    this.debouncedSearch = _debounce(this.search.bind(this), 500);
    this.onResultsLoaded = this.onResultsLoaded.bind(this);
    this.onSearchError = this.onSearchError.bind(this);
    this.debouncedScroll = _debounce(this.onScroll.bind(this), 500);
    this.onQueryChange = this.onQueryChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.debouncedScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll')
  }

  reset() {
    this.setState({
      query: '',
      currentItems: null
    });
  }

  search() {
    const q = this.state.query;
    if (_isEmpty(q.trim())) {
      this.reset();
      return;
    }
    let url = `https://www.googleapis.com/youtube/v3/search?`
      + `key=${this.props.apiKey}&part=snippet&type=video&maxResults=10&q=${'surf ' + q}`;
    const tempState = {requesting: true};
    if (_has(this.state.resultsCache, q)) {
      const cache = this.state.resultsCache[q];
      if (cache.items.length >= cache.totalItems) {
        // nothing else to request, so do nothing;
        if (this.state.currentItems !== cache) {
          // ensure that we are looking it the correct list of items based on the current query
          this.setState({currentItems: cache});
        }
        return;
      }

      tempState['currentItems'] = cache;
      url += `&pageToken=${cache.nextPageToken}`
    } else {
      // brand new request, so clear the list while requesting
      tempState['currentItems'] = null;
    }
    this.setState(tempState, () => {
      fetch(url)
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
    const currentCache = _get(this.state.resultsCache, query, null);
    const result = {
      items: currentCache ? _concat(currentCache.items, results.items) : results.items,
      nextPageToken: results.nextPageToken,
      totalItems: results.pageInfo.totalResults
    };

    const newCache = _assignIn({}, this.state.resultsCache, {
      [query]: result
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
      currentItems: result,
      resultsCache: newCache
    });
  }

  onSearchError() {
    this.setState({
      requesting: false,
      errors: 'An Error occurred'
    });
  }

  onScroll() {
    const scrollPos = window.scrollY,
      docHeight = document.documentElement.scrollHeight,
      range = 300;
    if ((window.innerHeight + scrollPos) > (docHeight - range)) {
      this.debouncedSearch();
    }
  }

  onQueryChange(query) {
    this.setState({query}, this.search);
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
            items={this.state.currentItems.items}
            total={this.state.currentItems.totalItems}
          />
        ) : null}
        {this.state.requesting ? <div className="loader"/> : null }
      </div>
    );
  }
}

export default App;
