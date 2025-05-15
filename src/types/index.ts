export type Event = {
  id: string;
  name: string;
  end_time: string;
  start_time: string;
  location: string;
  description: string;
  is_public: boolean;
  owner_id: string;
  image_url: string;
  capacity: number;
  participants: User[];
  posts: Post[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Post = {
  content: string;
  created_at: string;
  event_id: string;
  id: string;
  title: string;
  updated_at: string;
  user_id: string;
  author: User;
  comments: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: User;
};
