
export interface Book {
  _id: string;
  title: string;
  author: string;
  originalLanguage: string;
  reviews: string;
  pages: string[]|null;
  totalPages?: number;
  uuid:string;
  isbn?: string;
  isbn13?: string;
  published: number;
  versions: string[];
  description: string;
  contributors: number;
  genre: string;
  rating?: number;
  reviewsCount?: number;
  editions?: {
    language: string;
    authorId?: string;
    authorName?: string;
    authorUsername?: string;
    translatedPages: number;
    completionPercent: number;
    lastUpdated?: string;
  }[];
  translatedLanguages?: string[];
  coverURI?: string;
  uploadURI?: string;
}

export interface BookStats extends Pick<Book, 'originalLanguage' | 'contributors' >{
  totalPages?: number;
  versions?: number;
}


export interface BookHeaderType extends Pick<Book, 'title' |  'author' | 'reviews'|'published' >{
  totalPages?: number;
  workspaceLink: URL;
  link: URL;
  coverURI?: string;
  genre?: string;
  description?: string;
  originalLanguage?: string;
}

//Edits, Contributors and Version History can be added later
