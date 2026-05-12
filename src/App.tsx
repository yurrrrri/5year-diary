import { useState } from "react";
import DiaryPage from "./DiaryPage";
import HomePage from "./HomePage";
import { todayISO } from "./utils";

function App() {
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [page, setPage] = useState<"home" | "diary">("home");

  const openDiary = (date: string) => {
    setSelectedDate(date);
    setPage("diary");
  };

  return page === "home" ? (
    <HomePage onDateSelect={openDiary} />
  ) : (
    <DiaryPage
      selectedDate={selectedDate}
      onBack={() => setPage("home")}
      onDateChange={(date) => setSelectedDate(date)}
    />
  );
}

export default App;
