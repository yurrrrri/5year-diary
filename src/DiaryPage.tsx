import { useEffect, useState } from "react";
import {
  buildDateKey,
  formatDateLabel,
  STORAGE_PREFIX,
  todayISO,
  YEARS,
} from "./utils";

interface DiaryPageProps {
  selectedDate: string;
  onBack: () => void;
  onDateChange: (date: string) => void;
}

function DiaryPage({ selectedDate, onBack, onDateChange }: DiaryPageProps) {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const dateKey = buildDateKey(selectedDate);
  const storageKey = `${STORAGE_PREFIX}:${dateKey}`;

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries({});
      }
    } else {
      setEntries({});
    }
    setDirty(false);
    setSaved(false);
  }, [storageKey]);

  const handleEntryChange = (year: number, value: string) => {
    setEntries((current) => ({ ...current, [year]: value }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = () => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
    setSaved(true);
    setDirty(false);
    setSavedAt(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = window.setTimeout(() => setShowToast(false), 2000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const todayDate = todayISO();

  return (
    <div className="app-shell">
      <div className="page-header">
        <button className="ghost-button small" onClick={onBack}>
          ← 메인으로
        </button>
        <div>
          <p className="eyebrow">5년 일기</p>
          <h1>{formatDateLabel(selectedDate)}의 일기</h1>
          <p className="subtitle">
            같은 날짜의 5년 기록을 한 페이지에서 작성하고 저장하세요.
          </p>
        </div>
        <div>
          <label className="date-input-label">
            날짜 선택
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </label>
        </div>
        <button
          className="ghost-button"
          onClick={() => onDateChange(todayDate)}
        >
          오늘 날짜로 보기
        </button>
      </div>

      <div className="grid-panel">
        {YEARS.map((year) => (
          <article key={year} className="entry-card">
            <div className="card-header">
              <span>{year}년</span>
            </div>
            <textarea
              value={entries[year] ?? ""}
              onChange={(event) => handleEntryChange(year, event.target.value)}
              placeholder={`${year}년의 오늘은 어떤 하루였나요?`}
            />
          </article>
        ))}
      </div>

      <div className="bottom-panel">
        <button
          className="primary-button save-footer"
          onClick={handleSave}
          disabled={!dirty}
        >
          저장하기
        </button>
      </div>
      {showToast && <div className="toast-message">저장이 완료되었습니다.</div>}
    </div>
  );
}

export default DiaryPage;
