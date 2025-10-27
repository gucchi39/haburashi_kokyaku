// チャット画面
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const ChatPage = () => {
  const messages = useStore(state => state.messages);
  const recentMessages = messages.slice(-20).reverse();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">チャット履歴</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ホーム
          </Link>
        </header>

        <div className="max-w-3xl mx-auto space-y-4">
          {recentMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              まだメッセージがありません
            </div>
          ) : (
            recentMessages.map(msg => (
              <div key={msg.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                    👩‍⚕️
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        スーパー衛生士
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('ja-JP')}
                      </span>
                    </div>

                    {/* 褒める */}
                    {msg.content.praise.map((text, i) => (
                      <p key={i} className="text-gray-700 dark:text-gray-300 mb-2">
                        {text}
                      </p>
                    ))}

                    {/* アドバイス */}
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        💡 {msg.content.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
