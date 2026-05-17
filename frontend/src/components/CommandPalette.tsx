"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface CmdItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  hint?: string;
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const I = {
  articles: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  challenges: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  roadmaps: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-4 4 4 4-8 4 4"/><path d="M21 21H3"/></svg>,
  playground: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  systemDesign: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  dashboard: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  home: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  puzzle: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  zap: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  rag: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
  robot: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
};

const allItems: CmdItem[] = [
  { icon: I.articles,     label: "Articles",           href: "/articles",                            hint: "Learn" },
  { icon: I.challenges,   label: "Challenges",         href: "/challenges",                          hint: "Practice" },
  { icon: I.roadmaps,     label: "Roadmaps",           href: "/roadmaps",                            hint: "Paths" },
  { icon: I.playground,   label: "Playground",         href: "/playground",                          hint: "Test" },
  { icon: I.systemDesign, label: "System Design",      href: "/system-design",                       hint: "Arch" },
  { icon: I.dashboard,    label: "Dashboard",          href: "/dashboard",                           hint: "Stats" },
  { icon: I.search,       label: "Search",             href: "/search",                              hint: "Find" },
  { icon: I.home,         label: "Home",               href: "/",                                    hint: "Main" },
  { icon: I.puzzle,       label: "Prompt Engineering", href: "/articles?category=fundamentals" },
  { icon: I.zap,          label: "Zero/Few-Shot",      href: "/articles?category=techniques" },
  { icon: I.rag,          label: "RAG Architecture",   href: "/articles?category=architecture" },
  { icon: I.robot,        label: "AI Agents",          href: "/articles?category=agents" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.hint?.toLowerCase().includes(query.toLowerCase()))
      )
    : allItems;

  const handleOpen = useCallback(() => { setOpen(true); setQuery(""); setActiveIdx(0); }, []);
  const handleClose = useCallback(() => { setOpen(false); setQuery(""); }, []);
  const navigate = useCallback((href: string) => { handleClose(); router.push(href); }, [handleClose, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); open ? handleClose() : handleOpen(); }
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleOpen, handleClose]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((prev) => Math.min(prev + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((prev) => Math.max(prev - 1, 0)); }
    else if (e.key === "Enter" && filtered[activeIdx]) navigate(filtered[activeIdx].href);
  };

  if (!open) return null;

  return (
    <>
      <div className="cmd-overlay" onClick={handleClose} />
      <div className="cmd-palette" onKeyDown={handleKeyDown}>
        <input
          ref={inputRef}
          className="cmd-input"
          placeholder="Search pages, topics..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
        />
        <div className="cmd-results">
          {filtered.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No results found
            </div>
          ) : (
            filtered.map((item, i) => (
              <div
                key={item.href + item.label}
                className={`cmd-item ${i === activeIdx ? "active" : ""}`}
                onClick={() => navigate(item.href)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <span className="cmd-item-icon" style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                <span className="cmd-item-label">{item.label}</span>
                {item.hint && <span className="cmd-item-hint">{item.hint}</span>}
              </div>
            ))
          )}
        </div>
        <div className="cmd-footer">
          <span><kbd className="cmd-kbd">↑↓</kbd> navigate</span>
          <span><kbd className="cmd-kbd">↵</kbd> open</span>
          <span><kbd className="cmd-kbd">esc</kbd> close</span>
        </div>
      </div>
    </>
  );
}
