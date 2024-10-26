/**
 * Firestore collections and document types
 */

/**
 * @typedef Pomodoro
 * @property {Date} startTime - ポモドーロの開始時間
 * @property {Date} endTime - ポモドーロの終了時間
 * @property {string} categoryId - カテゴリーID
 * @property {string} categoryName - カテゴリー名
 * @property {string} taskName - タスク名
 * @property {number} duration - 作業時間（分）
 * @property {('work'|'break')} mode - 作業モード
 */

/**
 * @typedef Category
 * @property {string} name - カテゴリー名
 * @property {Date} createdAt - 作成日時
 */

/**
 * Firestoreのコレクションパスを管理
 */
export const COLLECTIONS = {
    USERS: 'users',
    POMODOROS: 'pomodoros',
    CATEGORIES: 'categories',
  };
  
  /**
   * ユーザーごとのサブコレクションのパスを取得
   */
  export const getUserCollectionPath = (userId, collection) => {
    return `${COLLECTIONS.USERS}/${userId}/${collection}`;
  };