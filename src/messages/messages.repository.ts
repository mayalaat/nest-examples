import { readFile, writeFile } from 'fs/promises';

export class MessagesRepository {
  async finOne(id: String): Promise<any> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);

    return messages[1];
  }

  async findAll(): Promise<any> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);

    return messages;
  }

  async create(content: string): Promise<void> {
    const contents = await readFile('messages.json', 'utf-8');
    const messages = JSON.parse(contents);

    const id = Math.floor(Math.random() * 999);

    messages[id] = { id, content };
    // messages[id] = {id: id, content: content}

    await writeFile('messages.json', JSON.stringify(messages));
  }
}
