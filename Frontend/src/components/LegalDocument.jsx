import React, { useEffect } from "react";

/**
 * Shared layout for the legal pages.
 *
 * sections: [{ id?, heading, body: [string | { list: string[] } | { note: string }] }]
 * Strings may contain simple links written as [text](href).
 */
const renderInline = (text, linkClass) => {
  const parts = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a key={match.index} href={match[2]} className={linkClass}>
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const LegalDocument = ({ isDark, icon: Icon, title, updated, intro, sections }) => {
  // Single-page navigation does not scroll to #anchors by itself (e.g. /disclaimer#corrections)
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  const heading = isDark ? "text-white" : "text-gray-900";
  const muted = isDark ? "text-gray-400" : "text-gray-600";
  const panel = isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200";
  const note = isDark ? "bg-amber-900/20 border-amber-700/40 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900";
  const link = "text-blue-500 hover:text-blue-600 underline";

  return (
    <div className={`min-h-screen py-20 px-4 transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {Icon && <Icon className="w-8 h-8 text-blue-500" />}
            <h1 className={`text-4xl md:text-5xl font-bold ${heading}`}>{title}</h1>
          </div>
          <p className={`text-sm ${muted}`}>Last updated: {updated}</p>
          {intro && <p className={`mt-6 text-lg leading-8 ${muted}`}>{renderInline(intro, link)}</p>}
        </header>

        <nav className={`mb-10 p-6 rounded-lg border ${panel}`} aria-label="Contents">
          <p className={`font-semibold mb-3 ${heading}`}>Contents</p>
          <ol className={`list-decimal list-inside space-y-1 text-sm ${muted}`}>
            {sections.map((s, i) => (
              <li key={i}>
                <a href={`#${s.id || `section-${i + 1}`}`} className="hover:underline">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <section key={i} id={s.id || `section-${i + 1}`} className="scroll-mt-24">
              <h2 className={`text-2xl font-bold mb-4 ${heading}`}>
                {i + 1}. {s.heading}
              </h2>
              <div className={`space-y-4 leading-7 ${muted}`}>
                {s.body.map((block, j) => {
                  if (typeof block === "string") return <p key={j}>{renderInline(block, link)}</p>;
                  if (block.list)
                    return (
                      <ul key={j} className="list-disc pl-6 space-y-2">
                        {block.list.map((item, k) => (
                          <li key={k}>{renderInline(item, link)}</li>
                        ))}
                      </ul>
                    );
                  if (block.note)
                    return (
                      <p key={j} className={`rounded-lg border p-4 ${note}`}>
                        {renderInline(block.note, link)}
                      </p>
                    );
                  return null;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalDocument;
