
export interface Book {
  _id: string;
  title: string;
  author: string;
  originalLanguage: string;
  reviews: string;
  pages: string[]|null;
  uuid:string;
  isbn?: string;
  isbn13?: string;
  published: number;
  versions: string[];
  description: string;
  contributors: number;
  genre: string;
  translatedLanguages?: string[];
  coverURI?: string;
  uploadURI?: string;
}

export interface BookStats extends Pick<Book, 'originalLanguage' |  'versions' | 'contributors' >{
  totalPages?: number;
}


export interface BookHeaderType extends Pick<Book, 'title' |  'author' | 'reviews'|'published' >{
  totalPages?: number;
  workspaceLink: URL;
  link: URL;
}

//Edits, Contributors and Version History can be added later