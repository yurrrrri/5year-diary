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
        <button className="ghost-button small" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          메인으로
        </button>
        <div style={{ marginBottom: '32px' }}>
          <p className="eyebrow">5년의 기록</p>
          <h1>{formatDateLabel(selectedDate)}</h1>
          <p className="subtitle">
            기록은 시간이 흐를수록 더 소중해집니다.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <label className="date-input-label">
            날짜 선택
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
            />
          </label>
          <button
            className="ghost-button"
            onClick={() => onDateChange(todayDate)}
            style={{ textWrap: "nowrap" }}
          >
            오늘 보기
          </button>
        </div>
      </div>

      <div className="grid-panel">
        {YEARS.map((year) => (
          <article key={year} className="entry-card">
            <div className="card-header">
              <span>{year}년</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 400 }}>{formatDateLabel(selectedDate).split(' ')[1]} {formatDateLabel(selectedDate).split(' ')[2]}</span>
            </div>
            <textarea
              value={entries[year] ?? ""}
              onChange={(event) => handleEntryChange(year, event.target.value)}
              placeholder={`${year}년의 오늘을 기록해 보세요...`}
            />
          </article>
        ))}
      </div>

      <div className="bottom-panel" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="primary-button save-footer"
          onClick={handleSave}
          disabled={!dirty}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          기록 저장하기
        </button>
      </div>
      {showToast && <div className="toast-message">저장이 완료되었습니다.</div>}
    </div>
  );
}

export default DiaryPage;
