export type NotificationType = {
  timestamp: string;
  message: string;
  seen: string;
};

export type Roles = Array<string>;

export type User = {
  _id: string;
  username: string;
  roles: { x: string };
  email: string;
  password: string;
  name: string;
  bio?: string;
  image: string;
  owedBooks?: [];
  readingHistory?: [];
  notifications?: [
    {
      timestamp: string;
      message: string;
      seen: string;
    }
  ];
  refreshToken: string;
};

export type Book = {
  _id: string;
  title: string;
  category: string;
  available: string;
  description: string;
  dueDate?: string;
  owedBy?: {
    userId: string;
    dueDate: string;
  };
  reviews?: [
    {
      userId: String;
      timestamp: String;
      review: String;
    }
  ];
  reservedBy?: any[];
  rating?: number;
  author: string;
  image: string;
  serNo: string;
};

export type Review = {
  userId: String;
  timestamp: String;
  review: String;
};
