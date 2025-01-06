export interface User {
  email: string;
  password: string;
  watchList: {
    items: {
      name: string;
      imageUrl: string;
      rating: number;
      releaseDate: string;
    }[];
  };
}
