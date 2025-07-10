import Dexie, { Table } from "dexie";

export interface User {
  uuid: string;
  first: string;
  last: string;
  email: string;
  thumbnail: string;
  page: number;
  favorite?: boolean;
}

export class NotesDB extends Dexie {
  users!: Table<User, string>;

  constructor() {
    super("notesDB");
    this.version(3).stores({
      users: "uuid, page, email, favorite"
    });
  }
}

export const db = new NotesDB(); 