"use client";

import { useState } from "react";
import { links } from "../i18n/contacts";
import type { Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/types";
import { LinkMark } from "./ActionLink";

type Section = "dance" | "vocal" | "both";

/** Whole years between a date of birth and today. */
function ageFromBirthDate(value: string): number | null {
  if (!value) return null;
  const born = new Date(value);
  if (Number.isNaN(born.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) years -= 1;
  return years;
}

/**
 * Registration form.
 *
 * It writes to the ensemble's spreadsheet through `/api/join`, the same path
 * the shop's orders take, and falls back to a pre-filled e-mail if that write
 * cannot be made — a person filling in ten fields should not lose them to a
 * service being down.
 *
 * Two things are conditional: the experience questions follow the section
 * chosen, and a parent's name is required only while the participant is under
 * 18. Age is taken from the date of birth but stays editable, because the two
 * are separate columns in the sheet.
 */
export function JoinForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const copy = dict.joinPage;
  const [section, setSection] = useState<Section>("dance");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const derivedAge = ageFromBirthDate(birthDate);
  const effectiveAge = age === "" ? derivedAge : Number(age);
  const needsParent = effectiveAge !== null && !Number.isNaN(effectiveAge) && effectiveAge < 18;
  const asksDance = section === "dance" || section === "both";
  const asksVocal = section === "vocal" || section === "both";

  const openMail = (entry: Record<string, string>) => {
    const missing = copy.mail.notSpecified;
    const lines = [
      `${copy.mail.name}: ${entry.name}`,
      `${copy.mail.age}: ${entry.age || missing}`,
      `${copy.mail.birth}: ${entry.birthDate || missing}`,
      entry.parent && `${copy.mail.parent}: ${entry.parent}`,
      `${copy.mail.phone}: ${entry.phone}`,
      `${copy.mail.email}: ${entry.email}`,
      `${copy.mail.section}: ${entry.sectionLabel}`,
      entry.danceExperience && `${copy.mail.dance}: ${entry.danceExperience}`,
      entry.vocalExperience && `${copy.mail.vocal}: ${entry.vocalExperience}`,
      entry.wishes && `${copy.mail.wishes}: ${entry.wishes}`,
    ].filter(Boolean);

    window.location.href = `mailto:${links.email}?subject=${encodeURIComponent(copy.mail.subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (field: string) => String(data.get(field) ?? "").trim();

    const entry = {
      name: read("name"),
      age: age || String(derivedAge ?? ""),
      birthDate,
      parent: read("parent"),
      phone: read("phone"),
      email: read("email"),
      section,
      sectionLabel: copy.sections[section],
      danceExperience: asksDance ? read("danceExperience") : "",
      vocalExperience: asksVocal ? read("vocalExperience") : "",
      wishes: read("wishes"),
      locale,
      website: read("website"),
    };

    setStatus("sending");
    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error(String(response.status));
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error("rejected");
      setStatus("sent");
    } catch {
      setStatus("failed");
      openMail(entry);
    }
  };

  return (
    <form className="join-form" onSubmit={submit}>
      <label>
        {copy.nameLabel}
        <input name="name" required autoComplete="name" placeholder={copy.nameHint} />
      </label>

      <div className="join-row">
        <label>
          {copy.birthLabel}
          <input
            type="date"
            name="birthDate"
            required
            value={birthDate}
            onChange={event => setBirthDate(event.target.value)}
          />
        </label>
        <label>
          {copy.ageLabel}
          <input
            type="number"
            name="age"
            required
            min="1"
            max="120"
            value={age === "" && derivedAge !== null ? String(derivedAge) : age}
            onChange={event => setAge(event.target.value)}
          />
        </label>
      </div>

      <label>
        {copy.parentLabel}
        <input name="parent" required={needsParent} autoComplete="off" />
        <small>{copy.parentNote}</small>
      </label>

      <div className="join-row">
        <label>
          {copy.phoneLabel}
          <input name="phone" required autoComplete="tel" inputMode="tel" />
          <small>{copy.phoneHint}</small>
        </label>
        <label>
          {copy.emailLabel}
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>

      <fieldset className="join-choice">
        <legend>{copy.sectionLabel}</legend>
        {(["dance", "vocal", "both"] as const).map(option => (
          <label key={option} className="choice">
            <input
              type="radio"
              name="section"
              value={option}
              checked={option === section}
              onChange={() => setSection(option)}
            />
            {copy.sections[option]}
          </label>
        ))}
      </fieldset>

      {asksDance && (
        <label>
          {copy.danceLabel}
          <textarea name="danceExperience" rows={2} />
          <small>{copy.experienceHint}</small>
        </label>
      )}

      {asksVocal && (
        <label>
          {copy.vocalLabel}
          <textarea name="vocalExperience" rows={2} />
          <small>{copy.experienceHint}</small>
        </label>
      )}

      <div className="join-wishes">
        <strong>{copy.wishesTitle}</strong>
        <p>{copy.wishesText}</p>
        <label>
          {copy.wishesLabel}
          <textarea name="wishes" rows={4} />
        </label>
        <p className="join-thanks">{copy.thanks}</p>
      </div>

      {/* Off-screen and unlabelled: a person never fills this in. */}
      <input className="merch-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button className="merch-submit" type="submit" disabled={status === "sending" || status === "sent"}>
        {status === "sending" ? copy.sending : status === "sent" ? copy.sent : copy.submit}
        {status === "sent" ? null : <LinkMark />}
      </button>
      {status === "sent" && <p className="merch-status">{copy.sentNote}</p>}
      {status === "failed" && <p className="merch-status merch-status--failed">{copy.failed}</p>}
    </form>
  );
}
