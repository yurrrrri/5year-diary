import { useEffect, useState } from "react";
import {
  buildDateKey,
  formatDateLabel,
  STORAGE_PREFIX,
  todayISO,
  weekDays,
} from "./utils";

interface HomePageProps {
  onDateSelect: (date: string) => void;
}

function HomePage({ onDateSelect }: HomePageProps) {
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    new Date(todayISO()),
  );
  const [savedDates, setSavedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const dates = new Set<string>();
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith(`${STORAGE_PREFIX}:`)) continue;
      const stored = key.slice(`${STORAGE_PREFIX}:`.length);
      if (stored) {
        dates.add(stored);
      }
    }
    setSavedDates(dates);
  }, []);

  const currentYear = calendarMonth.getFullYear();
  const currentMonth = calendarMonth.getMonth();
  const monthLabel = `${currentYear}년 ${currentMonth + 1}월`;
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayOfMonth + 1;
    return dayNumber >= 1 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  const monthKey = `${String(currentMonth + 1).padStart(2, "0")}`;
  const todayDate = todayISO();

  return (
    <div className="app-shell">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">5년 일기</p>
          <p className="subtitle">날짜를 선택해 오늘의 기록을 남겨보세요.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => onDateSelect(todayDate)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          오늘 일기 쓰기
        </button>
      </div>

      <div className="calendar-panel">
        <div className="calendar-header">
          <button
            className="ghost-button small"
            onClick={() =>
              setCalendarMonth(new Date(currentYear, currentMonth - 1, 1))
            }
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            이전
          </button>
          <div className="calendar-title">{monthLabel}</div>
          <button
            className="ghost-button small"
            onClick={() =>
              setCalendarMonth(new Date(currentYear, currentMonth + 1, 1))
            }
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            다음
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
        <div className="calendar-grid week-labels">
          {weekDays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid days-grid">
          {calendarCells.map((day, index) => {
            const hasEntry =
              day !== null &&
              savedDates.has(`${monthKey}-${String(day).padStart(2, "0")}`);

            const iso = day
              ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : "";
            const isToday = iso === todayDate;

            return (
              <button
                key={index}
                type="button"
                className={`calendar-cell ${day ? "active" : "empty"} ${hasEntry ? "has-entry" : ""} ${isToday ? "today" : ""}`}
                onClick={() => {
                  if (!day) return;
                  onDateSelect(iso);
                }}
                disabled={!day}
              >
                {day && <span>{day}</span>}
                {hasEntry && day && <span className="saved-marker">●</span>}
              </button>
            );
          })}
        </div>
        <div className="calendar-legend">
          <span className="legend-dot" /> 저장된 날짜
        </div>
      </div>
    </div>
  );
}

export default HomePage;
