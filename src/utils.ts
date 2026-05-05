export const buildDateKey = (date: string) => date.slice(5);
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const formatDateLabel = (iso: string) => {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const YEARS = [2026, 2027, 2028, 2029, 2030];
export const STORAGE_PREFIX = '5years-diary';
export const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
