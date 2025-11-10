/**
 * Утилита для перевода статусов картин с английского на русский
 */

export const statusTranslations = {
  // Новые английские статусы
  'available': 'В наличии',
  'out_of_stock': 'Нет в наличии', 
  'custom_order': 'Доступно под заказ',
  
  // Старые русские статусы (для обратной совместимости)
  'В наличии': 'В наличии',
  'Нет в наличии': 'Нет в наличии',
  'Доступно под заказ': 'Доступно под заказ'
};

/**
 * Переводит статус с английского на русский
 * @param {string} status - Статус для перевода
 * @returns {string} Переведенный статус
 */
export function translateStatus(status) {
  return statusTranslations[status] || status;
}

/**
 * Возвращает все доступные статусы на русском языке
 * @returns {Array} Массив статусов на русском
 */
export function getAvailableStatuses() {
  return ['В наличии', 'Нет в наличии', 'Доступно под заказ'];
}

/**
 * Возвращает английский ключ по русскому названию статуса
 * @param {string} russianStatus - Русское название статуса
 * @returns {string} Английский ключ статуса
 */
export function getStatusKey(russianStatus) {
  const reverseMap = {
    'В наличии': 'available',
    'Нет в наличии': 'out_of_stock',
    'Доступно под заказ': 'custom_order'
  };
  return reverseMap[russianStatus] || russianStatus;
}