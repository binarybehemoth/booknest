// A dependency-free JavaScript action: inputs arrive as INPUT_<NAME> environment variables.
const fs = require('node:fs');

const genre = process.env.INPUT_GENRE;
const { books } = JSON.parse(fs.readFileSync('db/seed.json', 'utf8'));
const count = books.filter((book) => book.genre === genre).length;

fs.appendFileSync(process.env.GITHUB_OUTPUT, `count=${count}\n`);
console.log(`::notice title=count-books::${count} ${genre} book(s) in the seed data`);
