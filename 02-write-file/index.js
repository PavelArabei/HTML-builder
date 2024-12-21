const { stdout, stdin, exit } = process;
const { join } = require('node:path');
const { createWriteStream } = require('node:fs');
const { rm } = require('node:fs/promises');

const filePath = join(__dirname, 'text.txt');

async function start() {
  try {
    await rm(filePath, { force: true });
    const writeStream = createWriteStream(filePath, { flags: 'a' });

    stdout.write('Hello\nWrite something\n');

    stdin.on('data', async (chunk) => {
      const input = chunk.toString().trim();
      if (input === 'exit') end();

      writeStream.write(`${input}\n`);
    });
  } catch (err) {
    console.error(err);
  }
}

start();

process.on('SIGINT', () => {
  end();
});

function end() {
  console.log('Goodbye!');
  exit();
}
