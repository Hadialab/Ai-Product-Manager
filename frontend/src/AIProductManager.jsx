import { useState } from "react";

const API_BASE = "http://localhost:5000";

const SECTION_META = [
  { key: "elevatorPitch",     label: "Elevator pitch",      icon: "ti-speakerphone",  color: "purple" },
  { key: "problemStatement",  label: "Problem statement",   icon: "ti-alert-circle",  color: "coral"  },
  { key: "targetAudience",    label: "Target audience",     icon: "ti-users",         color: "blue"   },
  { key: "coreFeatures",      label: "Core features",       icon: "ti-stars",         color: "teal"   },
  { key: "userStories",       label: "User stories",        icon: "ti-message-2",     color: "amber"  },
  { key: "acceptanceCriteria",label: "Acceptance criteria", icon: "ti-circle-check",  color: "green"  },
  { key: "sprintPlan",        label: "Sprint plan",         icon: "ti-calendar-event",color: "blue"   },
  { key: "apiSuggestions",    label: "API suggestions",     icon: "ti-api",           color: "purple" },
  { key: "technologyStack",   label: "Technology stack",    icon: "ti-stack-2",       color: "teal"   },
  { key: "risks",             label: "Risks",               icon: "ti-shield-exclamation", color: "coral"},
  { key: "databaseDesign",    label: "Database design",     icon: "ti-database",      color: "amber"  },
];

const COLOR_MAP = {
  purple: { bg: "#EEEDFE", border: "#534AB7", text: "#3C3489", badge: "#AFA9EC" },
  coral:  { bg: "#FAECE7", border: "#993C1D", text: "#712B13", badge: "#F0997B" },
  blue:   { bg: "#E6F1FB", border: "#185FA5", text: "#0C447C", badge: "#85B7EB" },
  teal:   { bg: "#E1F5EE", border: "#0F6E56", text: "#085041", badge: "#5DCAA5" },
  amber:  { bg: "#FAEEDA", border: "#854F0B", text: "#633806", badge: "#EF9F27" },
  green:  { bg: "#EAF3DE", border: "#3B6D11", text: "#27500A", badge: "#97C459" },
};

function Badge({ children, color = "blue" }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <span style={{
      display: "inline-block",
      background: c.bg,
      color: c.text,
      border: `0.5px solid ${c.badge}`,
      borderRadius: 6,
      fontSize: 13,
      padding: "3px 10px",
      marginRight: 6,
      marginBottom: 6,
      lineHeight: 1.5,
    }}>
      {children}
    </span>
  );
}

function SectionCard({ meta, value }) {
  const c = COLOR_MAP[meta.color] || COLOR_MAP.blue;

  const renderValue = () => {
    if (!value) return null;

    if (meta.key === "databaseDesign") {
      const tables = value?.tables || [];
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {tables.map((t, i) => {
            const name = typeof t === "string" ? t : t.name || t.tableName || Object.keys(t)[0];
            const cols = typeof t === "object" ? (t.columns || t.fields || []) : [];
            return (
              <div key={i} style={{
                background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 8,
                padding: "10px 14px",
                minWidth: 160,
                flex: "1 1 160px",
              }}>
                <p style={{ margin: "0 0 6px", fontWeight: 500, fontSize: 14, color: c.text }}>{name}</p>
                {cols.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {cols.map((col, j) => (
                      <li key={j} style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                        {typeof col === "string" ? col : col.name || col.column || JSON.stringify(col)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (meta.key === "sprintPlan") {
      const sprints = Array.isArray(value) ? value : [];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sprints.map((sprint, i) => {
            const name = typeof sprint === "string" ? sprint : sprint.name || sprint.sprint || sprint.title || `Sprint ${i + 1}`;
            const tasks = typeof sprint === "object" ? (sprint.tasks || sprint.features || sprint.items || []) : [];
            return (
              <div key={i} style={{
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 8,
                overflow: "hidden",
              }}>
                <div style={{
                  background: c.bg,
                  padding: "8px 14px",
                  borderBottom: `0.5px solid ${c.badge}`,
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14, color: c.text }}>{name}</span>
                </div>
                {tasks.length > 0 && (
                  <ul style={{ margin: 0, padding: "8px 14px 8px 28px" }}>
                    {tasks.map((t, j) => (
                      <li key={j} style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                        {typeof t === "string" ? t : t.task || t.name || JSON.stringify(t)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (typeof value === "string") {
      return <p style={{ margin: 0, fontSize: 15, color: "var(--color-text-primary)", lineHeight: 1.7 }}>{value}</p>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      const isShort = value.every(v => typeof v === "string" && v.length < 60);
      if (isShort) {
        return (
          <div>
            {value.map((v, i) => (
              <Badge key={i} color={meta.color}>{typeof v === "string" ? v : JSON.stringify(v)}</Badge>
            ))}
          </div>
        );
      }
      return (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {value.map((v, i) => (
            <li key={i} style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.75, marginBottom: 4 }}>
              {typeof v === "string" ? v : v.story || v.criteria || v.feature || v.risk || v.endpoint || JSON.stringify(v)}
            </li>
          ))}
        </ul>
      );
    }

    return <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{JSON.stringify(value)}</p>;
  };

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12,
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-secondary)",
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <i className={`ti ${meta.icon}`} style={{ fontSize: 17, color: c.text }} aria-hidden="true" />
        </div>
        <span style={{ fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>{meta.label}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        {renderValue()}
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--color-text-secondary)",
          animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export default function App() {
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError(null);
    setProposal(null);

    try {
      const res = await fetch(`${API_BASE}/api/proposal/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      if (!res.ok) {
    throw new Error("Server error");
}
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Generation failed.");
      setProposal(data.proposal);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure the backend is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  const copyMarkdown = () => {
    if (!proposal) return;
    const lines = [`# ${proposal.productName}\n`, `**Elevator pitch:** ${proposal.elevatorPitch}\n`];
    SECTION_META.forEach(({ key, label }) => {
      const v = proposal[key];
      if (!v) return;
      lines.push(`\n## ${label}`);
      if (Array.isArray(v)) v.forEach(item => lines.push(`- ${typeof item === "string" ? item : JSON.stringify(item)}`));
      else if (typeof v === "string") lines.push(v);
      else lines.push(JSON.stringify(v, null, 2));
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => { setProposal(null); setIdea(""); setError(null); };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1rem 4rem", fontFamily: "var(--font-sans)" }}>
      <h2 className="sr-only">AI Product Manager — generate a software project proposal from a business idea</h2>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#EEEDFE",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="ti ti-rocket" style={{ fontSize: 20, color: "#3C3489" }} aria-hidden="true" />
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
            AI Product Manager
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          Turn a rough business idea into a complete software project proposal — features, sprints, database design, and more.
        </p>
      </div>

      {/* Input */}
      {!proposal && (
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 12,
          padding: "20px",
          marginBottom: "1.5rem",
        }}>
          <label htmlFor="idea-input" style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            Describe your idea
          </label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. A food delivery app for Mars colonists"
            rows={3}
            style={{
              width: "100%",
              resize: "vertical",
              fontSize: 15,
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: 8,
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)",
              lineHeight: 1.6,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <button
              onClick={generate}
              disabled={loading || !idea.trim()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 20px",
                borderRadius: 8,
                border: loading || !idea.trim() ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid #534AB7",
                background: loading || !idea.trim() ? "var(--color-background-secondary)" : "#EEEDFE",
                color: loading || !idea.trim() ? "var(--color-text-tertiary)" : "#3C3489",
                fontSize: 14,
                fontWeight: 500,
                cursor: loading || !idea.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <><LoadingDots /><span style={{ marginLeft: 6 }}>Generating…</span></>
              ) : (
                <><i className="ti ti-sparkles" style={{ fontSize: 16 }} aria-hidden="true" /> Generate proposal</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "var(--color-background-danger)",
          border: "0.5px solid var(--color-border-danger)",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}>
          <i className="ti ti-alert-circle" style={{ fontSize: 18, color: "var(--color-text-danger)", marginTop: 1 }} aria-hidden="true" />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-danger)" }}>Generation failed</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-danger)" }}>{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {proposal && (
        <div>
          {/* Product header */}
          <div style={{
            background: "#EEEDFE",
            border: "0.5px solid #AFA9EC",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500, color: "#534AB7", textTransform: "uppercase", letterSpacing: "0.06em" }}>Product name</p>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 500, color: "#26215C", lineHeight: 1.2 }}>
                  {proposal.productName}
                </h2>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, marginTop: 4 }}>
                <button
                  onClick={copyMarkdown}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8,
                    border: "0.5px solid #534AB7",
                    background: copied ? "#534AB7" : "transparent",
                    color: copied ? "#EEEDFE" : "#3C3489",
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 15 }} aria-hidden="true" />
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={reset}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8,
                    border: "0.5px solid #534AB7",
                    background: "transparent",
                    color: "#3C3489",
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  <i className="ti ti-refresh" style={{ fontSize: 15 }} aria-hidden="true" />
                  New idea
                </button>
              </div>
            </div>
          </div>

          {/* Sections grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 14 }}>
            {SECTION_META.filter(m => m.key !== "elevatorPitch").map(meta => {
              const value = meta.key === "databaseDesign"
                ? proposal.databaseDesign
                : proposal[meta.key];
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              return <SectionCard key={meta.key} meta={meta} value={value} />;
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!proposal && !loading && !error && (
        <div style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "var(--color-text-tertiary)",
        }}>
          <i className="ti ti-bulb" style={{ fontSize: 36, display: "block", marginBottom: 12 }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: 14 }}>Enter a business idea above to generate your proposal</p>
        </div>
      )}
    </div>
  );
}
