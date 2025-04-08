const http = require('http');
const url = require('url');
const EventEmitter = require('events');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

// Create Express app
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Responds with plain text
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondText(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('hi');
}

/**
 * Responds with JSON
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3]
  });
}

/**
 * Responds with 404 Not Found
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondNotFound(req, res) {
  res.status(404).send('Not Found');
}

/**
 * Responds with echo of input in various formats
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondEcho(req, res) {
  const { input = '' } = req.query;

  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join('')
  });
}

/**
 * Handles chat messages
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondChat(req, res) {
  const { message } = req.query;
  chatEmitter.emit('message', message);
  res.end();
}

/**
 * Handles Server-Sent Events for chat
 * @param {express.Request} req
 * @param {express.Response} res
 */
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });

  const onMessage = msg => res.write(`data: ${msg}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/**
 * Serves the chat HTML page
 * @param {express.Request} req
 * @param {express.Response} res
 */
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, 'chat.html'));
}

// Set up routes
app.get('/', chatApp);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/chat', respondChat);
app.get('/sse', respondSSE);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});