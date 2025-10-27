// アバター返答カードコンポーネント
import type { AvatarReply } from '../types';

interface AvatarCardProps {
  reply: AvatarReply;
  onClose: () => void;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({ reply, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
              👩‍⚕️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                スーパー衛生士
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                あなた専属のサポーター
              </p>
            </div>
          </div>

          {/* 褒める (3点) */}
          <div className="space-y-3">
            {reply.praise.map((text, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border-l-4 border-yellow-400"
              >
                <p className="text-gray-800 dark:text-gray-200">{text}</p>
              </div>
            ))}
          </div>

          {/* 改善提案 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 アドバイス
            </h4>
            <p className="text-gray-800 dark:text-gray-200">{reply.tip}</p>
          </div>

          {/* 次の約束 */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
              🎯 次の目標
            </h4>
            <p className="text-gray-800 dark:text-gray-200">{reply.nextCommitment}</p>
          </div>

          {/* 励まし */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-gray-800 dark:text-gray-200 font-medium">{reply.closing}</p>
          </div>

          {/* 受診勧奨 */}
          {reply.flags.adviseVisit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">
                ⚠️ 症状が続く場合は、歯科医院での受診をご検討ください。
              </p>
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
