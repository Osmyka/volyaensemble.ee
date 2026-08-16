"use client";

import { useState } from "react";

const nav = ["Про ансамбль", "Розклад", "Галерея", "Контакти"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  return (
    <main className={darkTheme ? "site dark-mode" : "site"}>
      <nav className="nav wrap">
        <a className="brand" href="#top" aria-label="VOLYA на головну"><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} /></a>
        <div className={`navlinks ${menuOpen ? "open" : ""}`}>
          {nav.map((item, i) => <a key={item} href={["#about", "#schedule", "#gallery", "#contact"][i]} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className="lang" href="#">UA <small>⌄</small></a>
        </div>
        <button className="theme-toggle" onClick={() => setDarkTheme(!darkTheme)} aria-label="Перемкнути тему"><span>{darkTheme ? "☼" : "☾"}</span><small>{darkTheme ? "Світла" : "Темна"}</small></button>
        <a className="nav-cta" href="https://forms.gle/BfqdNshRtWhtw2QX9" target="_blank" rel="noreferrer">Приєднатися <b>↗</b></a>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Відкрити меню">☰</button>
      </nav>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" /> УКРАЇНСЬКИЙ АНСАМБЛЬ ПІСНІ І ТАНЦЮ</p>
          <img className="hero-brand" src="/logo-volya.webp" alt="VOLYA" width={960} height={386} />
          <p className="hero-text">Один із найбільших українських творчих колективів у країнах Балтії, що діє при Спілці української молоді в Естонії.</p>
          <div className="hero-actions"><a className="button dark" href="https://forms.gle/BfqdNshRtWhtw2QX9" target="_blank" rel="noreferrer">Приєднуйся до Волі! <span>↗</span></a><a className="play" href="https://youtu.be/xZsTxucTU_I?si=1cc7ph9DHfeFINiU" target="_blank" rel="noreferrer"><span>▶</span> VOLYA. 3 aastat koos</a></div>
          <div className="hero-note"><strong>60+</strong><span>дітей та молоді<br />у нашій родині</span></div>
          <div className="union-note"><img src="/logo-sum.webp" alt="Логотип Спілки української молоді" width={220} height={347} /><div><b>Ансамбль діє при<br />Спілці української молоді в Естонії (СУМ)</b><a href="https://cym.ee" target="_blank" rel="noreferrer">Дізнатися більше про СУМ <i>↗</i></a></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Молоді учасники ансамблю в українських костюмах" />
          <div className="year">ЗАСНОВАНО<br /><strong>2023</strong></div>
          <div className="scribble">живемо<br />і творимо<br /><b>разом</b> ✦</div>
        </div>
      </section>

      <section className="ticker"><div>ПІСНЯ <span>✦</span> ТАНЕЦЬ <span>✦</span> СПІЛЬНОТА <span>✦</span> ТРАДИЦІЯ <span>✦</span> ПІСНЯ <span>✦</span> ТАНЕЦЬ <span>✦</span> СПІЛЬНОТА</div></section>


      <section className="about wrap" id="about">
        <div className="section-label">01 / ПРО НАС</div>
        <div className="about-content"><h2>Ми — більше,<br /><em>ніж ансамбль.</em></h2><div className="about-body"><p>VOLYA — це місце, де українська культура звучить сучасно, сміливо й по-справжньому. Ми співаємо, танцюємо, дружимо та зростаємо разом.</p><p className="muted">Заснований у 2023 році в Таллінні, ансамбль об’єднує близько 60 дітей та молоді віком від 6 до 25 років.</p><a className="text-link" href="#contact">Наша історія <span>↗</span></a></div></div>
        <div className="values"><div><b>01</b><strong>Традиція</strong><span>Памʼятаємо, звідки ми.</span></div><div><b>02</b><strong>Енергія</strong><span>Створюємо нове.</span></div><div><b>03</b><strong>Свобода</strong><span>Будь собою з VOLYA.</span></div></div>
      </section>

      <section className="schedule wrap" id="schedule"><div className="schedule-head"><div className="section-label">02 / ПРИЄДНУЙСЯ</div><h2>Твій час — <em>зараз.</em></h2><p>Обирай свою групу та приходь на перше заняття. Будемо знайомитися! <strong>Перше заняття — безкоштовне.</strong></p></div><div className="schedule-card"><div className="card-top"><span>РОЗКЛАД ЗАНЯТЬ</span><a href="/schedule">ОСІНЬ 2026 ↗</a></div><div className="card-description"><p><b>Хореографія</b> — 2–3 рази на тиждень по 1,5 години</p><p><b>Вокал</b> — 2 рази на тиждень по 1–1,5 години</p></div><div className="class"><div><small>ПОНЕДІЛОК</small><strong>17:00 — 18:30</strong></div><span>ТАНЦІ <b>6–12 років</b></span></div><div className="class"><div><small>СЕРЕДА</small><strong>17:00 — 18:30</strong></div><span>ВОКАЛ <b>6–12 років</b></span></div><div className="class"><div><small>ЧЕТВЕР</small><strong>18:00 — 20:00</strong></div><span>ТАНЦІ + ВОКАЛ <b>13–25 років</b></span></div><a className="button yellow" href="/schedule">Повний розклад <span>↗</span></a></div></section>

      <section className="team wrap" id="team"><div className="team-head"><div><div className="section-label">03 / КОМАНДА</div><h2>Наші діти —<br /><em>наша команда.</em></h2></div><p>Чотири викладачі, які щодня допомагають дітям розкривати голос, рух і впевненість.</p></div><div className="team-photo-placeholder"><span>МІСЦЕ ДЛЯ ВЕЛИКОГО ФОТО</span><strong>Наші діти — наша команда</strong></div><div className="teachers"><div><div className="teacher-photo teacher-photo-1" /><b>01</b><strong>Викладачка</strong><span>Хореографія</span></div><div><div className="teacher-photo teacher-photo-2" /><b>02</b><strong>Викладачка</strong><span>Хореографія</span></div><div><div className="teacher-photo teacher-photo-3" /><b>03</b><strong>Викладачка</strong><span>Вокал</span></div><div><div className="teacher-photo teacher-photo-4" /><b>04</b><strong>Викладачка</strong><span>Вокал / VOLYA PRO</span></div></div></section>

      <section className="place wrap"><div className="place-photo"><img src="/place-volya.webp" alt="Учасниці VOLYA під час танцю" width={1400} height={1400} loading="lazy" decoding="async" /></div><div className="place-copy"><div className="section-label">04 / ДЕ МИ ЗАЙМАЄМОСЯ</div><h2>Зустрічаємось<br /><em>у Таллінні.</em></h2><p>Наші заняття проходять у трьох локаціях. Тут ми репетируємо, вчимося та створюємо спогади.</p><div className="address"><span>⌖</span><div><a href="https://maps.google.com/?q=Madara+14+Tallinn" target="_blank" rel="noreferrer"><strong>Хореографія</strong><br />Madara 14, Tallinn ↗</a><br /><br /><a href="https://maps.google.com/?q=Maneezi+3+Tallinn" target="_blank" rel="noreferrer"><strong>Вокал</strong><br />Maneeži 3, Tallinn ↗</a><br /><br /><a href="https://maps.google.com/?q=Salme+tn+12+Tallinn" target="_blank" rel="noreferrer"><strong>Salme Kultuuri Keskus</strong><br />Salme tn 12, 10413 Tallinn ↗</a></div></div></div></section>

      <section className="gallery wrap" id="gallery"><div className="gallery-head"><div><div className="section-label">04 / МОМЕНТИ</div><h2>Живі. <em>Справжні.</em></h2></div><a className="text-link" href="https://www.instagram.com/volya_eesti?igsh=MTBkdTcwOWtmNzZjMQ==" target="_blank" rel="noreferrer">Дивитись більше фото <span>↗</span></a></div><div className="gallery-grid">{Array.from({ length: 6 }, (_, index) => <div className={`g-${["one", "two", "three", "four", "five", "six"][index]}`} key={index}><img src={`/moments-${index + 1}.webp`} alt={`Момент із життя ансамблю VOLYA ${index + 1}`} width={1000} height={800} loading="lazy" decoding="async" /></div>)}</div></section>

      <section className="join" id="join"><div className="wrap join-inner"><div className="section-label">05 / БУДЬ З НАМИ</div><h2>Готовий бути<br /><em>частиною VOLYA?</em></h2><p>Стань частиною нашої великої української родини.</p><a className="button yellow" href="https://forms.gle/BfqdNshRtWhtw2QX9" target="_blank" rel="noreferrer">Приєднуйся до Волі! <span>↗</span></a><div className="join-mark">VOLYA<br /><small>тут починається<br />свобода</small></div></div></section>

      <footer className="footer wrap" id="contact"><div className="footer-brand"><a className="brand" href="#top"><img src="/logo-volya.webp" alt="VOLYA" width={960} height={386} loading="lazy" decoding="async" /></a><p>Український ансамбль<br />пісні і танцю в Естонії.</p></div><div className="footer-contact"><small>КОНТАКТИ</small><a href="mailto:volya@ukraine.ee">volya@ukraine.ee ↗</a><a href="tel:+37253774435">+372 5377 4435 ↗</a><a href="tel:+37253007761">+372 5300 7761 ↗</a><a href="https://t.me/volya_ee" target="_blank" rel="noreferrer">Telegram @volya_ee ↗</a><p>Ukraina Noorsoo Liit Eestis<br />80163437</p></div><div><small>НАВІГАЦІЯ</small>{nav.map(x => <a key={x} href="#top">{x}</a>)}</div><div><small>СЛІДКУЙ ЗА НАМИ</small><a href="https://www.instagram.com/volya_eesti?igsh=MTBkdTcwOWtmNzZjMQ==" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/share/1Bu16UiqZp/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook ↗</a><a href="mailto:volya@ukraine.ee">Email ↗</a></div><div className="footer-legal">© 2025 VOLYA<br />Діє при Спілці української молоді в Естонії.<br /><br />Зроблено з любовʼю в Таллінні ✦</div></footer>
    </main>
  );
}
