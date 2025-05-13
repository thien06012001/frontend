import { useState } from 'react';

type Thread = {
  id: number;
  author: string;
  title: string;
  content: string;
  postedAt: string;
  replies: Reply[];
};

type Reply = {
  id: number;
  author: string;
  content: string;
  postedAt: string;
};

const initialThreads: Thread[] = [
  {
    id: 1,
    author: 'Attendee 1',
    title: 'What time should we arrive?',
    content: 'Just wondering when we should be at the venue.',
    postedAt: '2025-05-01 10:00',
    replies: [
      {
        id: 1,
        author: 'Organizer',
        content: 'Please arrive 15 minutes before start time.',
        postedAt: '2025-05-01 11:00',
      },
    ],
  },
  {
    id: 2,
    author: 'Attendee 2',
    title: 'Will food be provided?',
    content: 'Will there be snacks or a meal included in the event?',
    postedAt: '2025-05-02 09:30',
    replies: [
      {
        id: 1,
        author: 'Organizer',
        content: 'Yes! Light refreshments will be available during the break.',
        postedAt: '2025-05-02 10:15',
      },
    ],
  },
  {
    id: 3,
    author: 'Attendee 3',
    title: 'Can I bring a guest?',
    content: 'I’d love to bring a friend. Is that allowed for this event?',
    postedAt: '2025-05-03 13:45',
    replies: [
      {
        id: 1,
        author: 'Organizer',
        content: 'This event is limited to registered attendees only.',
        postedAt: '2025-05-03 14:05',
      },
    ],
  },
  {
    id: 4,
    author: 'Attendee 4',
    title: 'Is parking available at the venue?',
    content: 'Just checking if I need to book parking in advance.',
    postedAt: '2025-05-04 08:00',
    replies: [
      {
        id: 1,
        author: 'Organizer',
        content: 'Free parking is available on-site for all attendees.',
        postedAt: '2025-05-04 08:45',
      },
    ],
  },
  {
    id: 5,
    author: 'Attendee 5',
    title: 'Can we get a copy of the presentation slides?',
    content:
      'I want to take notes, but a copy of the slides would be helpful too.',
    postedAt: '2025-05-05 12:10',
    replies: [
      {
        id: 1,
        author: 'Organizer',
        content:
          'Yes, slides will be emailed to all participants after the event.',
        postedAt: '2025-05-05 12:40',
      },
    ],
  },
];

function Discussion() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<number, string>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<number, boolean>>({});
  const [currentUserRole] = useState<'organizer' | 'attendee'>('organizer');
  const [currentUserName] = useState('You');
  const [showReplies, setShowReplies] = useState<Record<number, boolean>>({});

  const handleCreateThread = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThread: Thread = {
      id: Date.now(),
      author: currentUserName,
      title: newTitle.trim(),
      content: newContent.trim(),
      postedAt: new Date().toLocaleString(),
      replies: [],
    };

    setThreads(prev => [newThread, ...prev]);
    setNewTitle('');
    setNewContent('');
  };

  const handleReply = (threadId: number) => {
    const replyText = replyInputs[threadId]?.trim();
    if (!replyText) return;

    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              replies: [
                ...thread.replies,
                {
                  id: Date.now(),
                  author: currentUserName,
                  content: replyText,
                  postedAt: new Date().toLocaleString(),
                },
              ],
            }
          : thread,
      ),
    );

    setReplyInputs(prev => ({ ...prev, [threadId]: '' }));
    setShowReplyBox(prev => ({ ...prev, [threadId]: false }));
  };

  const handleDeleteThread = (id: number) => {
    setThreads(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteReply = (threadId: number, replyId: number) => {
    setThreads(prev =>
      prev.map(thread =>
        thread.id === threadId
          ? {
              ...thread,
              replies: thread.replies.filter(reply => reply.id !== replyId),
            }
          : thread,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold ">Event Forum</h2>

      {/* Create New Thread */}

      <div className="space-y-2 border p-4 rounded-md bg-white">
        <h3 className="font-medium">Start a Discussion</h3>
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-primary p-2 rounded-md"
        />
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Write your message..."
          rows={3}
          className="w-full border border-primary p-2 rounded-md"
        />
        <button
          onClick={handleCreateThread}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!newTitle.trim() || !newContent.trim()}
        >
          Post
        </button>
      </div>

      {/* List of Threads */}
      <div className="space-y-4 overflow-auto">
        {threads.map(thread => (
          <div
            key={thread.id}
            className="border border-gray-300 rounded-md p-4 bg-white space-y-2"
          >
            <div>
              <h4 className="text-lg font-semibold">{thread.title}</h4>
              <p className="text-gray-800 whitespace-pre-line">
                {thread.content}
              </p>
              <div className="text-sm text-gray-500">
                Posted by {thread.author} • {thread.postedAt}
              </div>
              {(thread.author === currentUserName ||
                currentUserRole === 'organizer') && (
                <button
                  onClick={() => handleDeleteThread(thread.id)}
                  className="text-xs text-red-600 mt-1"
                >
                  Delete Thread
                </button>
              )}
            </div>

            {/* Replies */}
            {thread.replies.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    setShowReplies(prev => ({
                      ...prev,
                      [thread.id]: !prev[thread.id],
                    }))
                  }
                  className="text-sm text-blue-600 underline"
                >
                  {showReplies[thread.id]
                    ? 'Hide replies'
                    : `Show ${thread.replies.length} replies`}
                </button>

                {showReplies[thread.id] && (
                  <div className="ml-4 mt-2 border-l border-gray-200 pl-4 space-y-2">
                    {thread.replies.map(reply => (
                      <div key={reply.id}>
                        <p className="text-gray-800">{reply.content}</p>
                        <div className="text-xs text-gray-500">
                          Reply by {reply.author} • {reply.postedAt}
                        </div>
                        {(reply.author === currentUserName ||
                          currentUserRole === 'organizer') && (
                          <button
                            onClick={() =>
                              handleDeleteReply(thread.id, reply.id)
                            }
                            className="text-xs text-red-600"
                          >
                            Delete Reply
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Toggle Reply */}
            {currentUserRole === 'organizer' && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    setShowReplyBox(prev => ({
                      ...prev,
                      [thread.id]: !prev[thread.id],
                    }))
                  }
                  className="text-sm text-blue-600 underline"
                >
                  {showReplyBox[thread.id] ? 'Cancel' : 'Reply'}
                </button>

                {showReplyBox[thread.id] && (
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      value={replyInputs[thread.id] || ''}
                      onChange={e =>
                        setReplyInputs(prev => ({
                          ...prev,
                          [thread.id]: e.target.value,
                        }))
                      }
                      placeholder="Write a reply..."
                      className="w-full border border-primary p-2 rounded-md"
                    />
                    <button
                      onClick={() => handleReply(thread.id)}
                      className="mt-1 bg-primary text-white px-4 py-1 rounded disabled:opacity-50"
                      disabled={!replyInputs[thread.id]?.trim()}
                    >
                      Submit Reply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discussion;
