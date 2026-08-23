import "./schedule.css";
import "./schedule-overrides.css";
import { addresses } from "../i18n/contacts";
import { localePath, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { BottomNav } from "../mobile/BottomNav";
import { ActionLink } from "./ActionLink";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { ThemeShell } from "../theme/theme";
import { lines } from "./text";

const times = Array.from({ length: 21 }, (_, i) => `${String(10 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);

/**
 * `day` indexes into `dict.schedulePage.days`, so the grid does not depend on
 * how any one language spells "Monday". Age ranges and venues are the same in
 * every language.
 */
const sessions: { day: number; start: string; end: string; kind: "dance" | "vocal" | "pro"; ages?: string; place: string }[] = [
  { day: 0, start: "15:30", end: "17:00", kind: "dance", ages: "8–10", place: addresses.choreography.street },
  { day: 0, start: "18:00", end: "19:00", kind: "vocal", ages: "14–18", place: addresses.vocal.street },
  { day: 0, start: "19:00", end: "20:30", kind: "pro", place: addresses.vocal.street },
  { day: 1, start: "16:30", end: "18:30", kind: "dance", ages: "14–18", place: addresses.choreography.street },
  { day: 1, start: "18:00", end: "19:00", kind: "vocal", ages: "10–13", place: addresses.vocal.street },
  { day: 2, start: "15:30", end: "17:00", kind: "dance", ages: "8–10", place: addresses.choreography.street },
  { day: 2, start: "17:00", end: "18:30", kind: "dance", ages: "10–13", place: addresses.choreography.street },
  { day: 3, start: "16:30", end: "18:30", kind: "dance", ages: "14–18", place: addresses.choreography.street },
  { day: 4, start: "15:30", end: "17:00", kind: "dance", ages: "8–10", place: addresses.choreography.street },
  { day: 4, start: "17:00", end: "18:30", kind: "dance", ages: "10–13", place: addresses.choreography.street },
  { day: 5, start: "10:00", end: "11:00", kind: "vocal", ages: "10–13", place: addresses.vocal.street },
  { day: 5, start: "11:00", end: "12:00", kind: "vocal", ages: "14–18", place: addresses.vocal.street },
  { day: 5, start: "14:00", end: "15:30", kind: "dance", ages: "10–13", place: addresses.culturalCentre.street },
  { day: 5, start: "15:30", end: "17:00", kind: "dance", ages: "14–18", place: addresses.culturalCentre.street },
];

/** Venue labels in the grid stay short: the street, without the city. */
const shortPlace = (place: string) => place.split(",")[0];

const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));

export function SchedulePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const cell = (day: number, time: string, index: number) => {
    const active = sessions.find(session => session.day === day && session.start === time);
    const covered = sessions.some(session => session.day === day && session.start < time && time < session.end);
    if (covered) return null;
    const duration = active
      ? Math.min((minutes(active.end) - minutes(active.start)) / 30, times.length - index)
      : 1;
    const label = active
      ? `${dict.schedulePage.kinds[active.kind]}${active.ages ? ` · ${active.ages}` : ""}`
      : "";
    return (
      <td key={`${day}-${time}`} colSpan={active ? duration : 1}>
        {active && <span className={`slot ${active.kind === "pro" ? "vocal" : active.kind}`}><b>{label}</b><small>{shortPlace(active.place)}</small></span>}
      </td>
    );
  };

  return (
    <ThemeShell className="schedule-page">
      <SiteHeader locale={locale} dict={dict} page="/schedule" />
      <section className="schedule-intro">
        <div className="section-label">{dict.schedulePage.label}</div>
        <h1>{dict.schedulePage.headingTop}<br /><em>{dict.schedulePage.headingEm}</em></h1>
        <p>{dict.schedulePage.text}</p>
        <div className="schedule-legend"><span className="legend-dance">{dict.schedulePage.legendDance}</span><span className="legend-vocal">{dict.schedulePage.legendVocal}</span></div>
      </section>
      <section className="full-schedule">
        <div className="table-note">{dict.schedulePage.tableNote} <span>→</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>{dict.schedulePage.dayColumn}</th>{times.map(time => <th key={time}>{time}</th>)}</tr></thead>
            <tbody>{dict.schedulePage.days.map((day, dayIndex) => <tr key={day}><th>{day}</th>{times.map((time, index) => cell(dayIndex, time, index))}</tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="schedule-details">
        <div><span>01</span><h2>{dict.schedulePage.detailChoreography}</h2><p>{lines(dict.schedulePage.choreographyFrequency)}</p></div>
        <div><span>02</span><h2>{dict.schedulePage.detailVocal}</h2><p>{lines(dict.schedulePage.vocalFrequency)}</p></div>
        <ActionLink variant="button" tone="navy" href={localePath(locale, "/join")}>{dict.schedulePage.cta}</ActionLink>
      </section>

      <SiteFooter locale={locale} dict={dict} page="/schedule" />

      <BottomNav locale={locale} dict={dict} page="/schedule" />
    </ThemeShell>
  );
}
