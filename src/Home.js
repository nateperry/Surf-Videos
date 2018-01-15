import React from 'react';
import ResultList from './components/ResultList';

function Home(props) {
  return (
    <div className="app--home">
      {props.currentItems ? (
        <ResultList
          items={props.currentItems.items}
          total={props.currentItems.totalItems}
        />
      ) : null}
      {props.requesting ? <div className="loader"/> : null}
    </div>
  );
}

export default Home;
