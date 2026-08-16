// `next/link` is unusable here: vinext 1.0.0-beta.2 ships a Link whose client
// runtime throws ("RSC prefetch setup error: f is not a function") and swallows
// the click, so every in-page navigation silently does nothing. Plain anchors
// do a full page load, which is fine for a two-page site.
/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import "../globals.css";
import "../concept.css";
import "../logo.css";
import "./schedule.css";
import "./schedule-overrides.css";

const times = Array.from({ length: 21 }, (_, i) => `${String(10 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const days = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця", "Субота"];
const sessions = [
  { day: "Понеділок", start: "15:30", end: "17:00", type: "dance", label: "ХОРЕОГРАФІЯ · 8–10", place: "Madara 14" },
  { day: "Понеділок", start: "18:00", end: "19:00", type: "vocal", label: "ВОКАЛ · 14–18", place: "Maneeži 3" },
  { day: "Понеділок", start: "19:00", end: "20:30", type: "vocal", label: "VOLYA PRO", place: "Maneeži 3" },
  { day: "Вівторок", start: "16:30", end: "18:30", type: "dance", label: "ХОРЕОГРАФІЯ · 14–18", place: "Madara 14" },
  { day: "Вівторок", start: "18:00", end: "19:00", type: "vocal", label: "ВОКАЛ · 10–13", place: "Maneeži 3" },
  { day: "Середа", start: "15:30", end: "17:00", type: "dance", label: "ХОРЕОГРАФІЯ · 8–10", place: "Madara 14" },
  { day: "Середа", start: "17:00", end: "18:30", type: "dance", label: "ХОРЕОГРАФІЯ · 10–13", place: "Madara 14" },
  { day: "Четвер", start: "16:30", end: "18:30", type: "dance", label: "ХОРЕОГРАФІЯ · 14–18", place: "Madara 14" },
  { day: "Пʼятниця", start: "15:30", end: "17:00", type: "dance", label: "ХОРЕОГРАФІЯ · 8–10", place: "Madara 14" },
  { day: "Пʼятниця", start: "17:00", end: "18:30", type: "dance", label: "ХОРЕОГРАФІЯ · 10–13", place: "Madara 14" },
  { day: "Субота", start: "10:00", end: "11:00", type: "vocal", label: "ВОКАЛ · 10–13", place: "Maneeži 3" },
  { day: "Субота", start: "11:00", end: "12:00", type: "vocal", label: "ВОКАЛ · 14–18", place: "Maneeži 3" },
  { day: "Субота", start: "14:00", end: "15:30", type: "dance", label: "ХОРЕОГРАФІЯ · 10–13", place: "Salme tn 12" },
  { day: "Субота", start: "15:30", end: "17:00", type: "dance", label: "ХОРЕОГРАФІЯ · 14–18", place: "Salme tn 12" },
];

export const metadata: Metadata = {
  title: "Розклад занять — VOLYA",
  description: "Хореографія та вокал для дітей і молоді від 6 до 25 років у Таллінні. Перше заняття безкоштовне.",
};

export default function SchedulePage() {
  const cell = (day: string, time: string, index: number) => {
    const active = sessions.find(session => session.day === day && session.start === time);
    const covered = sessions.some(session => session.day === day && session.start < time && time < session.end);
    if (covered) return null;
    const duration = active ? Math.min((Number(active.end.slice(0, 2)) * 60 + Number(active.end.slice(3)) - (Number(active.start.slice(0, 2)) * 60 + Number(active.start.slice(3))) ) / 30, times.length - index) : 1;
    return <td key={`${day}-${time}`} colSpan={active ? duration : 1}>{active && <span className={`slot ${active.type}`}><b>{active.label}</b><small>{active.place}</small></span>}</td>;
  };
  return <main className="schedule-page"><header className="schedule-nav"><a href="/" className="back">← На головну</a><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} /><a href="https://forms.gle/BfqdNshRtWhtw2QX9" target="_blank" rel="noreferrer">Приєднатися ↗</a></header><section className="schedule-intro"><div className="section-label">РОЗКЛАД / ОСІНЬ 2026</div><h1>Знайди свій<br /><em>ритм.</em></h1><p>Хореографія та вокал для дітей і молоді від 6 до 25 років. Перше заняття — безкоштовне.</p><div className="schedule-legend"><span className="legend-dance">Хореографія</span><span className="legend-vocal">Вокал</span></div></section><section className="full-schedule"><div className="table-note">Гортай таблицю горизонтально на телефоні <span>→</span></div><div className="table-scroll"><table><thead><tr><th>ДЕНЬ</th>{times.map(time => <th key={time}>{time}</th>)}</tr></thead><tbody>{days.map(day => <tr key={day}><th>{day}</th>{times.map((time, index) => cell(day, time, index))}</tr>)}</tbody></table></div></section><section className="schedule-details"><div><span>01</span><h2>Хореографія</h2><p>2–3 рази на тиждень<br />по 1,5 години</p></div><div><span>02</span><h2>Вокал</h2><p>2 рази на тиждень<br />по 1–1,5 години</p></div><a className="button dark" href="https://forms.gle/BfqdNshRtWhtw2QX9" target="_blank" rel="noreferrer">Записатися на заняття ↗</a></section></main>;
}
