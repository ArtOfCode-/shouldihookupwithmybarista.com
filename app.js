const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const layouts = require('ejs-layouts');
const createDebug = require('debug');
require('colors'); // eslint-disable-line import/no-unassigned-import

const app = express();
const appLogger = createDebug('app:base');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts.express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  appLogger(`${req.method} ${req.originalUrl} HTTP/1.1`);
  next();
});

app.get('/', (req, res) => {
  res.layout('layouts/application', {type: 'barista'}, {content: {block: 'should', data: {type: 'barista'}}});
});

app.get('/what', (req, res) => {
  res.layout('layouts/what', {title: "What's This?"}, {content: {block: 'what', data: {}}});
});

app.get('/faq', (req, res) => {
  res.layout('layouts/what', {title: "FAQ"}, {content: {block: 'faq', data: {}}});
});

app.get('/:type', (req, res) => {
  const type = req.params.type.replace(/-/g, ' ');
  res.layout('layouts/application', {type}, {content: {block: 'should', data: {type}}});
});

app.listen(10801, () => {
  appLogger('Listening on 10801'.green.bold);
});
