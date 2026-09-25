// Receives GitHub webhook deliveries and accepts only those signed with WEBHOOK_SECRET.
const http = require('node:http');
const crypto = require('node:crypto');

const secret = process.env.WEBHOOK_SECRET;
const port = Number(process.env.PORT || 31080);

function signedBy(body, header = '') {
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const event = req.headers['x-github-event'];
    if (!signedBy(body, req.headers['x-hub-signature-256'])) {
      console.log(`${event}: rejected, bad signature`);
      return res.writeHead(401).end();
    }
    const p = JSON.parse(body);
    const what = p.issue ? `#${p.issue.number} "${p.issue.title}"` : p.zen;
    console.log(`${event}${p.action ? ' ' + p.action : ''}: ${what} (signature ok)`);
    res.writeHead(204).end();
  });
}).listen(port, () => console.log(`listening on http://localhost:${port}`));
