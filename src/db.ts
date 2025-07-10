import Dexie, { Table } from "dexie";

export interface User {
  uuid: string;
  first: string;
  last: string;
  email: string;
  thumbnail: string;
  page: number;
}

export class NotesDB extends Dexie {
  users!: Table<User, string>;

  constructor() {
    super("notesDB");
    this.version(2).stores({
      users: "uuid, page, email"
    });
  }
}

export const db = new NotesDB(); 