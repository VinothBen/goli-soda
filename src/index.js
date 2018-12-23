"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './Style/lessImporter.less';
import Root from './Root';

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://vinothben:adminben123@ds259111.mlab.com:59111";
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mock_db");
//   dbo.collection("in-house").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result.name);
//     db.close();
//   });
// });
// import registerServiceWorker from './registerServiceWorker';

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );

render(Root);

// Webpack Hot Module Replacement API
if (module.hot) module.hot.accept('./Root', () => render(Root));

// ReactDOM.render(<Root />, document.getElementById('root'));
// registerServiceWorker();
