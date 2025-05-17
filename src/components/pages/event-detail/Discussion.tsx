import { useEffect, useState } from 'react';
import { Post } from '../../../types';
import useUser from '../../../hooks/redux/useUser';
import { handleAPI } from '../../../handlers/api-handler';
import { useParams } from 'react-router';
import { useFetch } from '../../../hooks/useFetch';

type Props = {
  isOrganizer: boolean;
};

function Discussion({ isOrganizer }: Props) {
  const { id } = useParams();
  const { data: postsData } = useFetch(`/events/${id}/discussions`, {
    method: 'GET',
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  const user = useUser();
  const userId = user.id;

  useEffect(() => {
    if (postsData) {
      setPosts(postsData.data);
    }
  }, [postsData]);

  const handleCreateThread = async () => {
    const res = await handleAPI('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        eventId: id,
        userId: userId,
      }),
    });

    if (res.ok) {
      const newPost = await res.json();
      setPosts(prev => [
        {
          ...newPost.data,
          author: user, // fallback: use current user
          comments: [],
        },
        ...prev,
      ]);
      setNewTitle('');
      setNewContent('');
    }
  };

  const handleReply = async (postId: string, content: string) => {
    const res = await handleAPI('/comments', {
      method: 'POST',
      body: JSON.stringify({
        content,
        postId,
        userId,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    ...newComment.data,
                    user: user, // fallback
                  },
                ],
              }
            : post,
        ),
      );
      setReplyInputs(prev => ({ ...prev, [postId]: '' }));
      setShowReplyBox(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    const res = await handleAPI(`/comments/${replyId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPosts(prev =>
        prev.map(post => ({
          ...post,
          comments: post.comments.filter(c => c.id !== replyId),
        })),
      );
    }
  };

  const handleDeletePost = async (postId: string) => {
    const res = await handleAPI(`/posts/${postId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Event Forum</h2>

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
        {posts.map(post => (
          <div
            key={post.id}
            className="border border-gray-300 rounded-md p-4 bg-white space-y-2"
          >
            <div>
              <h4 className="text-lg font-semibold">{post.title}</h4>
              <p className="text-gray-800 whitespace-pre-line">
                {post.content}
              </p>
              <div className="text-sm text-gray-500">
                Posted by {post.author?.name || 'Unknown'} • {post.created_at}
              </div>
              {(post.user_id === userId || isOrganizer) && (
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-xs text-red-600 mt-1 hover:underline"
                >
                  Delete Thread
                </button>
              )}
            </div>

            {/* Replies */}
            {post.comments.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    setShowReplies(prev => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="text-sm text-blue-600 underline"
                >
                  {showReplies[post.id]
                    ? 'Hide replies'
                    : `Show ${post.comments.length} replies`}
                </button>

                {showReplies[post.id] && (
                  <div className="ml-4 mt-2 border-l border-gray-200 pl-4 space-y-2">
                    {post.comments.map(comment => (
                      <div key={comment.id}>
                        <p className="text-gray-800">{comment.content}</p>
                        <div className="text-xs text-gray-500">
                          Reply by {comment.user?.name || 'Unknown'} •{' '}
                          {comment.created_at}
                        </div>
                        {(comment.user_id === userId || isOrganizer) && (
                          <button
                            onClick={() => handleDeleteReply(comment.id)}
                            className="text-xs text-red-600 hover:underline"
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

            {/* Reply Box */}
            <div className="mt-2">
              <button
                onClick={() =>
                  setShowReplyBox(prev => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
                className="text-sm text-blue-600 underline"
              >
                {showReplyBox[post.id] ? 'Cancel' : 'Reply'}
              </button>

              {showReplyBox[post.id] && (
                <div className="mt-2">
                  <textarea
                    rows={2}
                    value={replyInputs[post.id] || ''}
                    onChange={e =>
                      setReplyInputs(prev => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a reply..."
                    className="w-full border border-primary p-2 rounded-md"
                  />
                  <button
                    className="mt-1 bg-primary text-white px-4 py-1 rounded disabled:opacity-50"
                    disabled={!replyInputs[post.id]?.trim()}
                    onClick={() => handleReply(post.id, replyInputs[post.id])}
                  >
                    Submit Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discussion;
