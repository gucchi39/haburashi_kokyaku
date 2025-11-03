// 歯ブラシヘッド購入ページ
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { BrushType } from '../types';

type BrushProduct = {
  id: string;
  name: string;
  type: BrushType;
  description: string;
  features: string[];
  price: number;
  image: string;
  recommended: boolean;
};

const products: BrushProduct[] = [
  {
    id: 'brush-1',
    name: '複合植毛ヘッド',
    type: '複合植毛',
    description: '硬さの異なる毛を組み合わせた万能タイプ',
    features: [
      '歯垢除去と歯茎マッサージを両立',
      '初心者におすすめ',
      'バランスの取れた磨き心地'
    ],
    price: 980,
    image: '🦷',
    recommended: true,
  },
  {
    id: 'brush-2',
    name: '大型・幅広ヘッド',
    type: '大型・幅広・段差植毛',
    description: '広範囲を一度に磨けるヘッド',
    features: [
      '効率的な歯磨きが可能',
      '時間短縮に最適',
      '段差植毛で歯間にもフィット'
    ],
    price: 880,
    image: '🪥',
    recommended: false,
  },
  {
    id: 'brush-3',
    name: '極細毛ヘッド',
    type: '極細毛・スーパーテーパード毛',
    description: '歯周ポケットまで届く極細毛',
    features: [
      '歯周病予防に効果的',
      '歯茎に優しい',
      '細かい部分まで届く'
    ],
    price: 1280,
    image: '✨',
    recommended: false,
  },
  {
    id: 'brush-4',
    name: 'コンパクトヘッド',
    type: '小型・コンパクト',
    description: '奥歯まで届きやすい小型ヘッド',
    features: [
      '細かい操作がしやすい',
      '奥歯の磨き残し予防',
      '口が小さい方に最適'
    ],
    price: 780,
    image: '🌟',
    recommended: false,
  },
];

export const ShopPage = () => {
  const { profile } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<BrushProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = () => {
    // 実際の決済処理はここに実装
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedProduct(null);
      setQuantity(1);
    }, 3000);
  };

  const currentBrushType = profile.brushType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ヘッダー */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🛒 替えブラシヘッド
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                あなたに合った歯ブラシヘッドを選びましょう
              </p>
              {currentBrushType && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  現在使用中: {currentBrushType}
                </p>
              )}
            </div>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition"
            >
              ← 戻る
            </Link>
          </div>
        </div>

        {/* 成功メッセージ */}
        {showSuccess && (
          <div className="bg-green-500 text-white rounded-2xl shadow-xl p-6 mb-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">ご注文ありがとうございます！</h2>
            <p>お届けまで今しばらくお待ちください</p>
          </div>
        )}

        {/* 商品一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition transform hover:scale-105 cursor-pointer ${
                product.recommended ? 'ring-4 ring-yellow-400' : ''
              } ${
                selectedProduct?.id === product.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              {product.recommended && (
                <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                  ⭐ おすすめ
                </div>
              )}
              {currentBrushType === product.type && (
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4 ml-2">
                  ✓ 使用中
                </div>
              )}
              
              <div className="text-6xl text-center mb-4">{product.image}</div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>

              <div className="space-y-2 mb-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ¥{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">税込/本</span>
              </div>
            </div>
          ))}
        </div>

        {/* 購入パネル */}
        {selectedProduct && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sticky bottom-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              購入内容の確認
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-6xl text-center mb-4">{selectedProduct.image}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                  {selectedProduct.name}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    数量
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">小計</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ¥{(selectedProduct.price * quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">送料</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      無料
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-gray-900 dark:text-white">合計</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      ¥{(selectedProduct.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setQuantity(1);
                }}
                className="flex-1 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                キャンセル
              </button>
              <button
                onClick={handlePurchase}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition shadow-xl"
              >
                購入する
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              ※ このデモでは実際の決済は行われません
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
