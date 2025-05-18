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
  requests: Request[];
  invitations: Invitation[];
  invitationReminder: number;
  participantReminder: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
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

export type UserWithEvents = User & {
  participatingEvents: Event[];
};

export type Request = {
  id: string;
  status: string;
  event_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: User;
};

export type Invitation = {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: User;
  status: string;
  event: {
    name: string;
    start_time: string;
  };
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  userId: string;
  created_at: string;
  updated_at: string;
  isRead: boolean;
  eventId: string;
};
