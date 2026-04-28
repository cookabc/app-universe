import type { SkillData } from "../../../data/skills";

interface Props {
  skill: SkillData;
}

export default function CollectionLayout({ skill }: Props) {
  switch (skill.id) {
    case "opc-methodology":
      return <OpcLayout skill={skill} />;
    case "impeccable-style":
      return <ImpeccableLayout skill={skill} />;
    case "markdown-viewer-skills":
      return <MarkdownViewerLayout skill={skill} />;
    case "khazix-skills":
      return <KhazixLayout skill={skill} />;
    case "app-icon-minimalist":
      return <AppIconLayout skill={skill} />;
    case "blueprinter":
      return <BlueprinterLayout skill={skill} />;
    case "design-system":
      return <DesignSystemLayout skill={skill} />;
    case "editorial-card-screenshot":
      return <EditorialCardLayout skill={skill} />;
    case "infographic-creation":
      return <InfographicLayout skill={skill} />;
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   1. OPC — 一人企业方法论（参考 opc-skills.ft07.com）
   编号卡片网格 + 用户故事对话 + 安装指南 + 文件输出
   ═══════════════════════════════════════════ */
function OpcLayout({ skill }: Props) {
  const children = skill.children || [];
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#1B365D,#2D5A8A)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.8px",
            marginBottom: 16,
          }}
        >
          ONE-PERSON COMPANY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            maxWidth: "56ch",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {skill.description}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 20,
            fontSize: "13px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>{children.length} 个 Agent Skill</span>
          <span>·</span>
          <span>从资源盘点到转化闭环</span>
          <span>·</span>
          <span>可执行的方法论</span>
        </div>
      </header>

      {/* Numbered Card Grid */}
      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {children.map((child, i) => (
            <div
              key={child.id}
              style={{
                padding: "20px 22px",
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: "0.5px solid var(--border-soft)",
                boxShadow: "var(--shadow-sm)",
                transition: "transform .2s ease, box-shadow .2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 8px 24px rgba(27,54,93,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    opacity: 0.85,
                    lineHeight: 1,
                    minWidth: "36px",
                  }}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: "0 0 6px",
                    }}
                  >
                    {child.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {child.description}
                  </p>
                </div>
              </div>
              {child.tag && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 4,
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.4px",
                    textTransform: "uppercase" as const,
                    background:
                      child.tag === "编排层"
                        ? "#EEF2F5"
                        : child.tag === "条件触发"
                          ? "#FFF7ED"
                          : "#F0FDF4",
                    color:
                      child.tag === "编排层"
                        ? "#1B365D"
                        : child.tag === "条件触发"
                          ? "#C2410C"
                          : "#166534",
                  }}
                >
                  {child.tag}
                </span>
              )}
            </div>
          ))}
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginTop: 16,
            fontFamily: "var(--font-mono)",
          }}
        >
          01 → 07 线性顺序执行 &nbsp;|&nbsp; 08 / 09 在实际运营中按需触发
        </p>
      </section>

      {/* User Story Demo */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "2px solid var(--border)",
          }}
        >
          Usage Demo
        </h2>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "12px",
            border: "0.5px solid var(--border-soft)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Demo header */}
          <div
            style={{
              padding: "14px 20px",
              background: "var(--bg-surface)",
              borderBottom: "0.5px solid var(--border-soft)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#E74C3C",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#F39C12",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#27AE60",
              }}
            />
            <span
              style={{
                marginLeft: 12,
                fontSize: "11px",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              opc-methodology — 对话流程
            </span>
          </div>
          {/* Chat messages */}
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* User */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                夏
              </div>
              <div
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  maxWidth: "480px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                }}
              >
                在某二线省会城市的传统装饰企业上班。房地产下行后，公司派单从每月 5-8 个骤降到 1-2
                个。我决定用下班后的 3 小时，搭建自己的一人企业。
              </div>
            </div>
            {/* AI response */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1B365D,#2D5A8A)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                AI
              </div>
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  maxWidth: "520px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                }}
              >
                这些都不是"没能力"，而是行业结构变了。我们接下来要做的，是把你已有能力重新组织成适合一人公司的版本。
                <br />
                <br />
                先确认一下——你对 OPC 相关方法论的熟悉度？
              </div>
            </div>
            {/* User reply */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#667eea,#764ba2)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                夏
              </div>
              <div
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  maxWidth: "320px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                }}
              >
                大部分熟悉，想快一点推进。
              </div>
            </div>
            {/* AI progress */}
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1B365D,#2D5A8A)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                AI
              </div>
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: "0 12px 12px 12px",
                  padding: "12px 16px",
                  maxWidth: "520px",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  lineHeight: 1.55,
                }}
              >
                已设为直通模式，术语按需解释。进入 <strong>01 资源盘点</strong>。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install Guide */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "2px solid var(--border)",
          }}
        >
          Install All Skills
        </h2>
        <div
          style={{
            background: "#1E293B",
            borderRadius: "10px",
            padding: "24px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "#E2E8F0",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              color: "var(--text-muted)",
              marginBottom: 12,
              fontSize: "11px",
            }}
          >{`# 安装全部 9 个 OPC 方法论 Skill`}</div>
          {children.map((c) => (
            <div key={c.id} style={{ marginBottom: 6, paddingLeft: 0 }}>
              <span style={{ color: "#7DD3FC" }}>npx skills add</span>{" "}
              <span
                style={{ color: "#A5F3FC" }}
              >{`https://github.com/easychen/opc-methodology/skills/${c.id}`}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "16px 20px",
            background: "var(--bg-surface)",
            borderRadius: 8,
            borderLeft: "3px solid #1B365D",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong>启动方法：</strong>安装完成后，使用总编排 Skill 启动建盘流程：
          <br />
          <code
            style={{
              background: "var(--bg-card)",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
            }}
          >
            /opc-orchestrator
          </code>
        </div>
      </section>

      {/* File Outputs */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "2px solid var(--border)",
          }}
        >
          Deliverables per Phase
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {[
            ["01 资源盘点", "inventory.md · scorecard.json"],
            ["02 利基定位", "three-ring-analysis.md · candidates.md"],
            ["03 价值主张", "value-proposition-canvas.md · messaging.md"],
            ["04 商业模式", "lean-canvas.md · business-model-canvas-lite.md"],
            ["06 MVP 设计", "mvp-spec.md · experiment-plan.md"],
            ["07 转化闭环", "conversion-path.md · channel-strategy.md"],
          ].map(([stage, files], i) => (
            <div
              key={i}
              style={{
                padding: "14px 18px",
                background: "var(--bg-card)",
                borderRadius: 8,
                border: "0.5px solid var(--border-soft)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                }}
              >
                {stage}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.6,
                }}
              >
                {files}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. Impeccable — 设计质量工具（参考 impeccable.style）
   7维原则 + 18命令网格 + 多安装方式 + 检测引擎
   ═══════════════════════════════════════════ */
function ImpeccableLayout({ skill }: Props) {
  const dimensions = [
    {
      title: "Visual Expression",
      desc: "Scale, rhythm, hierarchy, expression",
      icon: "VG",
    },
    {
      title: "Design Systems",
      desc: "Accessibility, systems, theming",
      icon: "DS",
    },
    {
      title: "Spatial Layout",
      desc: "Layout, spacing, composition",
      icon: "SP",
    },
    {
      title: "Responsive Design",
      desc: "Fluid layouts, touch targets",
      icon: "RD",
    },
    {
      title: "Interaction Design",
      desc: "States, feedback, affordances",
      icon: "IX",
    },
    {
      title: "Motion & Polish",
      desc: "Micro-interactions, transitions",
      icon: "MP",
    },
    {
      title: "Content Quality",
      desc: "Clarity, voice, error messages",
      icon: "CQ",
    },
  ];

  const commands = [
    {
      name: "/create",
      desc: "Generate designed UI from requirements",
      color: "#6366f1",
    },
    {
      name: "/evaluate",
      desc: "Review against design principles",
      color: "#8b5cf6",
    },
    { name: "/refine", desc: "Iterative improvement pass", color: "#a855f7" },
    {
      name: "/simplify",
      desc: "Reduce complexity while keeping intent",
      color: "#d946ef",
    },
    {
      name: "/harden",
      desc: "Production readiness: edge cases, errors",
      color: "#ec4899",
    },
    {
      name: "/system",
      desc: "Align to design system tokens",
      color: "#f43f5e",
    },
    {
      name: "/audit",
      desc: "Score 5 dimensions with P0-P3 severity",
      color: "#ef4444",
    },
    { name: "/polish", desc: "Final visual refinement pass", color: "#f97316" },
    {
      name: "/bolder",
      desc: "Strengthen typographic hierarchy",
      color: "#eab308",
    },
    { name: "/distill", desc: "Remove unnecessary elements", color: "#84cc16" },
    {
      name: "/critique",
      desc: "Nielsen heuristics + persona review",
      color: "#22c55e",
    },
    {
      name: "/typeset",
      desc: "Fix typography scale and rhythm",
      color: "#14b8a6",
    },
    { name: "/layout", desc: "Fix layout & spacing issues", color: "#06b6d4" },
    {
      name: "/shape",
      desc: "Structured discovery interview → brief",
      color: "#0ea5e9",
    },
    {
      name: "/craft",
      desc: "Brief → full implementation flow",
      color: "#3b82f6",
    },
    {
      name: "/teach",
      desc: "Set project design context (.impeccable.md)",
      color: "#6366f1",
    },
    {
      name: "/extract",
      desc: "Extract design context from codebase",
      color: "#8b5cf6",
    },
    {
      name: "/impeccable",
      desc: "Master command: teach/craft/extract modes",
      color: "var(--text-primary)",
    },
  ];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 20px",
            borderRadius: 30,
            background: "linear-gradient(135deg,#1a1a2e,#16213e)",
            color: "#D4AF37",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            marginBottom: 20,
            fontFamily: "var(--font-sans)",
          }}
        >
          ◆ IMPECCABLE
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "38px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 14px",
            lineHeight: 1.15,
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "17px",
            color: "var(--text-secondary)",
            maxWidth: "58ch",
            margin: "0 auto",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}
        >
          Before commands, before detection, Impeccable teaches your AI real design.
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            maxWidth: "52ch",
            margin: "12px auto 0",
            lineHeight: 1.55,
          }}
        >
          Deep reference knowledge across 7 dimensions, loaded every time your AI writes code.
        </p>
      </header>

      {/* 7 Dimensions */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          7 Dimensions of Design Quality
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 12,
          }}
        >
          {dimensions.map((d, i) => (
            <div
              key={i}
              style={{
                padding: "20px 18px",
                background: "var(--bg-card)",
                borderRadius: 10,
                border: "0.5px solid var(--border-soft)",
                textAlign: "center",
                transition: "transform .15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "none")}
            >
              <div style={{ fontSize: "28px", marginBottom: 8 }}>{d.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {d.title}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  lineHeight: 1.45,
                }}
              >
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 18 Commands Grid */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          18 Commands
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: 24,
            fontFamily: "var(--font-mono)",
          }}
        >
          A shared vocabulary between you and your AI
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: 10,
          }}
        >
          {commands.map((cmd, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                background: "var(--bg-card)",
                borderRadius: 8,
                border: "0.5px solid var(--border-soft)",
                borderLeft: `3px solid ${cmd.color}`,
                transition: "transform .15s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "none")}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: cmd.color,
                  marginBottom: 4,
                }}
              >
                {cmd.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                }}
              >
                {cmd.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-pattern Detection Engine */}
      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            padding: "28px",
            background: "linear-gradient(135deg,#1a1a2e,#0f3460)",
            borderRadius: 14,
            color: "#fff",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 500,
                margin: "0 0 12px",
                color: "#D4AF37",
              }}
            >
              Detection Engine
            </h3>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 18px",
                fontSize: "13px",
                lineHeight: 1.75,
                color: "#cbd5e1",
              }}
            >
              <li>
                <strong style={{ color: "#fff" }}>25 deterministic checks</strong> — No LLM needed
              </li>
              <li>Catches gradient text, purple palettes, nested cards</li>
              <li>Low contrast, overused fonts, emoji-only nodes</li>
              <li>Supports oklch, oklab, lch, lab color formats</li>
            </ul>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 500,
                margin: "0 0 12px",
                color: "#D4AF37",
              }}
            >
              Three Ways to Use It
            </h3>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 18px",
                fontSize: "13px",
                lineHeight: 1.75,
                color: "#cbd5e1",
              }}
            >
              <li>
                <strong style={{ color: "#fff" }}>Chrome Extension</strong> — Any page, live overlay
              </li>
              <li>
                <strong style={{ color: "#fff" }}>CLI</strong> —{" "}
                <code
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "1px 6px",
                    borderRadius: 3,
                    fontSize: "11px",
                  }}
                >
                  npx impeccable detect src/
                </code>
              </li>
              <li>
                <strong style={{ color: "#fff" }}>/critique</strong> — During AI design review
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Multi-Install Section */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          Installation
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 14,
          }}
        >
          {[
            {
              label: "Skills Add (Recommended)",
              cmd: "npx skills add pbakaus/impeccable",
              note: "Works with Cursor, Claude Code, Gemini CLI, Codex CLI",
              icon: "FX",
            },
            {
              label: "CLI / Global Install",
              cmd: "npm i -g impeccable",
              note: "Scan files, directories, or live URLs for anti-patterns",
              icon: "🖥",
            },
            {
              label: "Chrome Extension",
              cmd: "Install from Chrome Web Store →",
              note: "One-click detection on any page",
              icon: "CE",
            },
            {
              label: "Claude Code Plugin",
              cmd: "/plugin marketplace add pbakaus/impeccable",
              note: "Then open /plugin in Claude Code",
              icon: "API",
            },
          ].map((method, i) => (
            <div
              key={i}
              style={{
                padding: "18px",
                background: "var(--bg-card)",
                borderRadius: 10,
                border: "0.5px solid var(--border-soft)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: "18px" }}>{method.icon}</span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {method.label}
                </span>
              </div>
              <code
                style={{
                  display: "block",
                  padding: "8px 12px",
                  background: "#1E293B",
                  borderRadius: 6,
                  color: "#7DD3FC",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 8,
                  overflowX: "auto",
                }}
              >
                {method.cmd}
              </code>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{method.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Update / Changelog hint */}
      <section>
        <div
          style={{
            padding: "16px 20px",
            background: "var(--bg-surface)",
            borderRadius: 8,
            borderLeft: "3px solid #D4AF37",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.55,
          }}
        >
          <strong>Stay updated:</strong> Run{" "}
          <code
            style={{
              background: "var(--bg-card)",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: "var(--text-primary)",
            }}
          >
            npx impeccable skills update
          </code>{" "}
          periodically to pull the latest skill definitions.
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. markdown-viewer/skills — 渲染引擎集合
   独特设计：引擎分类层级视图 + 技能选择指南 + 代码围栏参考
   ═══════════════════════════════════════════ */
function MarkdownViewerLayout({ skill }: Props) {
  const children = skill.children || [];

  const engineGroups = [
    {
      name: "Standalone Engines",
      desc: "独立渲染引擎，各有专属代码围栏",
      icon: "SA",
      color: "#6366f1",
      bg: "#EEEDFF",
      skills: children.filter((c) => ["vega", "infographic", "canvas"].includes(c.id)),
    },
    {
      name: "HTML/CSS Embedded",
      desc: "直接嵌入 Markdown 的 HTML/CSS 渲染",
      icon: "VG",
      color: "#ec4899",
      bg: "#FCE7F3",
      skills: children.filter((c) => ["architecture", "infocard"].includes(c.id)),
    },
    {
      name: "PlantUML-Based",
      desc: "基于 PlantUML 的领域特定图标与约定",
      icon: "SP",
      color: "#14b8a6",
      bg: "#CCFBF1",
      skills: children.filter(
        (c) => !["vega", "infographic", "canvas", "architecture", "infocard"].includes(c.id),
      ),
    },
  ];

  const codeFences = [
    ["vega", "```vega-lite / ```vega", "SVG/Canvas"],
    ["infographic", "```infographic", "HTML"],
    ["canvas", "```canvas", "SVG"],
    ["uml / cloud / network ...", "```plantuml / ```puml", "SVG"],
    ["architecture", "(no fence, raw HTML)", "HTML"],
    ["infocard", "(no fence, raw HTML)", "HTML"],
  ];

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", marginBottom: 44 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 18px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.6px",
            marginBottom: 18,
          }}
        >
          RENDERING ENGINE COLLECTION
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "34px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text-secondary)",
            maxWidth: "56ch",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {skill.description}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 18,
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span>{children.length} Skills</span>
          <span>·</span>
          <span>5 Engines</span>
          <span>·</span>
          <span>GPL-3.0</span>
        </div>
      </header>

      {/* Engine Category Cards */}
      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          渲染引擎分类
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
            gap: 18,
          }}
        >
          {engineGroups.map((group, gi) => (
            <div
              key={gi}
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                border: "0.5px solid var(--border-soft)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Group header */}
              <div
                style={{
                  padding: "16px 20px",
                  background: group.bg,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderBottom: "0.5px solid var(--border-soft)",
                }}
              >
                <span style={{ fontSize: "22px" }}>{group.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: group.color,
                    }}
                  >
                    {group.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{group.desc}</div>
                </div>
              </div>
              {/* Skills list */}
              <div
                style={{
                  padding: "14px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {group.skills.map((s, si) => (
                  <div
                    key={si}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: si % 2 === 0 ? "var(--bg-surface)" : "transparent",
                      fontSize: "13px",
                      transition: "background .15s",
                    }}
                  >
                    <span style={{ fontSize: "15px", flexShrink: 0 }}>{s.icon || "[doc]"}</span>
                    <span
                      style={{
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        flex: 1,
                      }}
                    >
                      {s.name}
                    </span>
                    {s.tag && (
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: group.bg,
                          color: group.color,
                          fontWeight: 600,
                        }}
                      >
                        {s.tag}
                      </span>
                    )}
                  </div>
                ))}
                {group.skills.length === 0 && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      padding: "8px 0",
                    }}
                  >
                    —
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Hierarchy Diagram (ASCII-art style rendered visually) */}
      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          技能层级关系
        </h2>
        <div
          style={{
            padding: "28px",
            background: "linear-gradient(135deg,var(--bg-surface) 0%,var(--bg-card) 100%)",
            borderRadius: 12,
            border: "0.5px solid var(--border-soft)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
          }}
        >
          {/* Visual hierarchy tree */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Row 0: Root */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: "8px 20px",
                  background: "var(--brand)",
                  color: "var(--bg-primary)",
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                markdown-viewer/skills
              </div>
            </div>
            {/* Connector lines */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: 1,
                  background: "var(--border-strong)",
                }}
              />
            </div>
            {/* Row 1: 3 engines */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginBottom: 12,
              }}
            >
              {[
                { label: "Standalone", color: "#6366f1", bg: "#EEEDFF" },
                { label: "HTML/CSS", color: "#ec4899", bg: "#FCE7F3" },
                {
                  label: "PlantUML",
                  color: "#5ecf8a",
                  bg: "color-mix(in srgb, #5ecf8a 12%, transparent)",
                },
              ].map((eng, ei) => (
                <div
                  key={ei}
                  style={{
                    padding: "6px 14px",
                    background: eng.bg,
                    borderRadius: 6,
                    color: eng.color,
                    fontWeight: 600,
                    fontSize: "11px",
                    textAlign: "center",
                    minWidth: 110,
                  }}
                >
                  {eng.label}
                </div>
              ))}
            </div>
            {/* Row 2: Leaf skills */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {children.slice(0, 14).map((c, ci) => (
                <div
                  key={ci}
                  style={{
                    padding: "4px 10px",
                    background: "var(--bg-card)",
                    borderRadius: 4,
                    border: "0.5px solid #e2e8f0",
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {c.icon} {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Fence Reference Table */}
      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
          }}
        >
          代码围栏参考
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              background: "var(--bg-card)",
              borderRadius: 10,
              border: "0.5px solid var(--border-soft)",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-surface)" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  Skill
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  Code Fence
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  Output Format
                </th>
              </tr>
            </thead>
            <tbody>
              {codeFences.map(([skill, fence, output], i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--border-soft)" }}>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-primary)",
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <code
                      style={{
                        background: "var(--bg-elevated)",
                        padding: "2px 6px",
                        borderRadius: 3,
                      }}
                    >
                      {fence}
                    </code>
                  </td>
                  <td
                    style={{
                      padding: "10px 16px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {output}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Install */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          Quick Install
        </h2>
        <div
          style={{
            background: "#1E293B",
            borderRadius: 10,
            padding: "20px 24px",
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
            color: "#E2E8F0",
          }}
        >
          <div
            style={{
              color: "var(--text-muted)",
              marginBottom: 8,
              fontSize: "11px",
            }}
          >{`# 一键安装全部 14 个渲染引擎 Skill`}</div>
          <div style={{ color: "#7DD3FC" }}>npx skills add markdown-viewer/skills</div>
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: "12px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          支持 Claude Code · Codex · Cursor · GitHub Copilot · VS Code
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. Khazix Skills — 中文方法论工具箱
   独特设计：个人工具箱风格 + 双卡片聚焦 + Prompt 展示
   ═══════════════════════════════════════════ */
function KhazixLayout({ skill }: Props) {
  const children = skill.children || [];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px 60px" }}>
      {/* Hero — personal/indie vibe */}
      <header style={{ textAlign: "center", marginBottom: 44 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 18px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            color: "#92400E",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            marginBottom: 18,
            fontFamily: "var(--font-sans)",
          }}
        >
          Khazix Skills
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "34px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            maxWidth: "50ch",
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          {skill.description}
        </p>
        <div
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "var(--bg-surface)",
            borderRadius: 8,
            border: "0.5px dashed var(--border)",
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontStyle: "italic",
            maxWidth: "46ch",
            margin: "20px auto 0",
            lineHeight: 1.55,
          }}
        >
          两种东西，一个目的：把我积累的方法论变成可复用的工具。
        </div>
      </header>

      {/* Two Prominent Tool Cards */}
      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Skills — 结构化指令集
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {children.map((child, i) => (
            <div
              key={child.id}
              style={{
                display: "grid",
                gridTemplateColumns: i === 0 ? "72px 1fr auto" : "72px 1fr auto",
                gap: 20,
                padding: "24px 28px",
                background: "var(--bg-card)",
                borderRadius: 14,
                border: "0.5px solid var(--border-soft)",
                boxShadow: "var(--shadow-sm)",
                transition: "transform .2s ease, box-shadow .2s ease",
                alignItems: "start",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 32px rgba(27,54,93,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              {/* Icon block */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  background:
                    i === 0
                      ? "linear-gradient(135deg,#667eea,#764ba2)"
                      : "linear-gradient(135deg,#f59e0b,#ef4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  flexShrink: 0,
                }}
              >
                {child.icon || "SK"}
              </div>

              {/* Content */}
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: "0 0 8px",
                  }}
                >
                  {child.name}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: "0 0 12px",
                  }}
                >
                  {child.description}
                </p>
                {child.tag && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {child.tag.split("·").map((t, ti) => (
                      <span
                        key={ti}
                        style={{
                          padding: "3px 10px",
                          borderRadius: 4,
                          fontSize: "10px",
                          fontWeight: 600,
                          background: "var(--tag-bg-light)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action badge */}
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: i === 0 ? "#EEEDFF" : "#FEF3C7",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: i === 0 ? "#6366f1" : "#B45309",
                  whiteSpace: "nowrap",
                  alignSelf: "center",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Agent Skill
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prompts Section — lightweight version */}
      <section style={{ marginBottom: 44 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Prompts — 轻量级，即用即走
        </h2>
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg,var(--bg-surface) 0%,var(--bg-secondary) 100%)",
            borderRadius: 12,
            border: "0.5px solid #fcd34d",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#92400E",
              fontWeight: 600,
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Copy Prompt，修改「研究对象」，丢进任何支持 Deep Research 的模型
          </div>
          <div
            style={{
              padding: "16px 20px",
              background: "var(--bg-card)",
              borderRadius: 8,
              border: "0.5px solid #fcd34d",
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            <strong>横纵分析法</strong> —
            通用深度研究框架，融合历时-共时分析与竞争战略视角，半小时出一份万字级研究报告。
          </div>
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <span
              style={{
                fontSize: "11px",
                color: "#B45309",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              查看完整 Prompt →
            </span>
          </div>
        </div>
      </section>

      {/* Install Guide */}
      <section style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 16,
          }}
        >
          安装方式
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Agent install */}
          <div
            style={{
              padding: "18px",
              background: "var(--bg-card)",
              borderRadius: 10,
              border: "0.5px solid var(--border-soft)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 10,
              }}
            >
              通过 Agent 安装
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: "0 0 12px",
                lineHeight: 1.5,
              }}
            >
              在 Claude Code、Codex、OpenClaw 等 Agent 中直接对话：
            </p>
            <code
              style={{
                display: "block",
                padding: "10px 14px",
                background: "#1E293B",
                borderRadius: 6,
                color: "#7DD3FC",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
              }}
            >
              安装这个 skill：https://github.com/KKKKhazix/khazix-skills
            </code>
          </div>
          {/* Manual install */}
          <div
            style={{
              padding: "18px",
              background: "var(--bg-card)",
              borderRadius: 10,
              border: "0.5px solid var(--border-soft)",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 10,
              }}
            >
              手动安装
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                margin: "0 0 10px",
                lineHeight: 1.5,
              }}
            >
              git clone 后复制到对应目录：
            </div>
            <code
              style={{
                display: "block",
                padding: "10px 14px",
                background: "#1E293B",
                borderRadius: 6,
                color: "#A5F3FC",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.6,
              }}
            >
              {`git clone https://github.com/KKKKhazix/khazix-skills.git\ncp -r khazix-skills/hv-analysis ~/.claude/skills/\ncp -r khazix-skills/khazix-writer ~/.claude/skills/`}
            </code>
          </div>
        </div>
        {/* Paths table */}
        <div style={{ marginTop: 14, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
              background: "var(--bg-card)",
              borderRadius: 8,
              border: "0.5px solid var(--border-soft)",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-surface)" }}>
                <th
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "11px",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  工具
                </th>
                <th
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontWeight: 600,
                    fontSize: "11px",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  安装路径
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Claude Code", "~/.claude/skills/"],
                ["OpenClaw", "~/.openclaw/skills/"],
                ["Codex", "~/.agents/skills/"],
              ].map(([tool, path], i) => (
                <tr key={i} style={{ borderBottom: "0.5px solid var(--border-soft)" }}>
                  <td
                    style={{
                      padding: "8px 16px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {tool}
                  </td>
                  <td
                    style={{
                      padding: "8px 16px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {path}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* License badge */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: 6,
            background: "var(--tag-bg-light)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
          }}
        >
          MIT License · Open Source
        </span>
      </div>
    </div>
  );
}

/* ═══ 5. App Icon Minimalist — 极简图标工坊 ═══ */
function AppIconLayout({ skill }: Props) {
  const icons = [
    { bg: "#1B365D", shape: "chat" },
    { bg: "#E74C3C", shape: "target" },
    { bg: "#27AE60", shape: "CK" },
    { bg: "#F39C12", shape: "SN" },
    { bg: "#8E44AD", shape: "♫" },
    { bg: "#16A085", shape: "⚙" },
    { bg: "#2C3E50", shape: "LK" },
    { bg: "#D35400", shape: "CT" },
  ];
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px 48px" }}>
      <header style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: "36px", marginBottom: 12 }}>[CAM]</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 10px",
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            maxWidth: "42ch",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {skill.description}
        </p>
      </header>

      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
          }}
        >
          {icons.map((icon, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                borderRadius: i % 3 === 0 ? 14 : i % 3 === 1 ? 28 : 10,
                background: icon.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
                fontSize: "22px",
              }}
            >
              {icon.shape}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {[
            {
              n: "①",
              t: "Abstract → Symbol",
              d: "Core function into simple visual element",
            },
            {
              n: "②",
              t: "Frame & Adjust",
              d: "Center in platform spec, keep recognizable at 64px",
            },
            {
              n: "③",
              t: "Ship & Iterate",
              d: "Good enough to launch, refine later",
            },
          ].map((s) => (
            <div
              key={s.n}
              style={{
                padding: "16px",
                background: "var(--bg-card)",
                borderRadius: 10,
                border: "0.5px solid var(--border-soft)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: 6 }}>{s.n}</div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: 3,
                }}
              >
                {s.t}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Specs */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 10,
          }}
        >
          Platform Specs
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
              background: "var(--bg-card)",
              borderRadius: 8,
              border: "0.5px solid var(--border-soft)",
            }}
          >
            <thead>
              <tr style={{ background: "var(--bg-surface)" }}>
                {["Platform", "Canvas", "Size"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      borderBottom: "0.5px solid var(--border-soft)",
                      fontSize: "10px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["iOS", "Square rounded", "1024 × 1024"],
                ["Android", "Square rounded", "512 × 512"],
                ["Web / Favicon", "Square", "180 × 180"],
              ].map((row, ri) => (
                <tr
                  key={ri}
                  style={{
                    borderBottom: ri < 2 ? "0.5px solid var(--border-soft)" : "none",
                  }}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: "7px 14px",
                        color: ci === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                        fontWeight: ci === 0 ? 600 : 400,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Principles */}
      <section>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 10,
          }}
        >
          Key Principles
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            {
              icon: "○",
              title: "One concept only",
              desc: "Never combine multiple ideas",
            },
            {
              icon: "◻",
              title: "Shapes not illustrations",
              desc: "Geometric forms, not drawings",
            },
            {
              icon: "◎",
              title: "Recognizable at 29px",
              desc: "If it works small, it works everywhere",
            },
            {
              icon: "▣",
              title: "No text in icons",
              desc: "Language-independent symbols",
            },
          ].map((p) => (
            <div
              key={p.title}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "12px 14px",
                background: "var(--bg-card)",
                borderRadius: 8,
                border: "0.5px solid var(--border-soft)",
              }}
            >
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{p.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══ 6. Blueprinter — 工程蓝图 ═══ */
function BlueprinterLayout({ skill }: Props) {
  const rules = [
    { r: "NO drop shadows", w: "Visual noise, no data value" },
    { r: "NO gradients", w: "Reduces clarity & print-friendliness" },
    { r: "NO glassmorphism/blur", w: "Obscures content beneath" },
    { r: "1-2px solid borders only", w: "Maximum structure, minimum ink" },
  ];
  const colors = [
    ["Canvas", "#ffffff"],
    ["Text Main", "#0f172a"],
    ["Text Sub", "#64748b"],
    ["Accent", "#1B365D"],
  ];
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 20px 48px",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 0 0 4px var(--bg-secondary)",
          padding: "28px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: "3px double #1B365D",
            paddingBottom: 10,
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: "9px",
                color: "var(--text-muted)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              SKILL SPEC
            </div>
            <h1
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "4px 0 0",
              }}
            >
              {skill.name.toUpperCase()}
            </h1>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "var(--text-muted)",
              textAlign: "right",
            }}
          >
            <div>{skill.stats.complexityLabel.toUpperCase()}</div>
          </div>
        </div>
        <div
          style={{
            padding: "12px 14px",
            background: "var(--bg-surface)",
            borderLeft: "3px solid var(--brand)",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-secondary)",
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          {skill.description}
        </div>

        {/* Philosophy */}
        <div
          style={{
            padding: "12px 16px",
            background: "var(--brand-subtle)",
            borderRadius: 6,
            border: "1px solid var(--border-strong)",
            fontSize: "12px",
            color: "var(--brand)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          <strong>Precise, Objective, High Data-Ink Ratio.</strong> Output looks like a technical
          spec sheet or architectural diagram, NOT a marketing page.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <section>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 10,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 6,
              }}
            >
              § Visual Rules
            </div>
            {rules.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "6px 0",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                <span style={{ color: "var(--error)", fontWeight: 700 }}>[x]</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{r.r}</span>
              </div>
            ))}
          </section>
          <section>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 10,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 6,
              }}
            >
              § Color Palette
            </div>
            {colors.map(([name, hex], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "5px 0",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 3,
                    background: hex,
                    border: "1px solid var(--border-strong)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    color: hex,
                  }}
                >
                  {hex}
                </span>
              </div>
            ))}
          </section>
        </div>

        {/* Mini Diagram Preview */}
        <section style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 10,
              borderBottom: "1px solid var(--border)",
              paddingBottom: 6,
            }}
          >
            § Output Example
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 6,
              border: "1px solid var(--border-soft)",
              padding: 16,
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
            }}
          >
            <div
              style={{
                borderBottom: "2px solid var(--brand)",
                paddingBottom: 6,
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                SYSTEM ARCHITECTURE
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "9px" }}>EXAMPLE OUTPUT</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
              {[
                ["Client Layer", true],
                ["API Gateway", false],
                ["Auth Service", false],
                ["Data Store", false],
              ].map(([label, active], i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    fontSize: "9px",
                    background: active ? "var(--bg-elevated)" : "var(--bg-card)",
                    borderLeft: `2px solid ${active ? "var(--brand)" : "var(--border)"}`,
                    borderRadius: "2px 0 0 2px",
                    color: active ? "var(--brand)" : "var(--text-muted)",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {label}
                </div>
              ))}
              <div
                style={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {[1, 2].map((n) => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 20,
                        height: 12,
                        borderRadius: 2,
                        background: "var(--brand-subtle)",
                        fontSize: "7px",
                        color: "var(--brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      REQ
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "var(--border-strong)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: "8px",
                  color: "var(--text-muted)",
                }}
              >
                {["HTTP/2", "JSON", "Redis"].map((t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--border-soft)",
                      paddingBottom: 2,
                    }}
                  >
                    <span>{t}</span>
                    <span>Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 10,
              borderBottom: "1px solid var(--border)",
              paddingBottom: 6,
            }}
          >
            § Features
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {skill.keyFeatures.slice(0, 8).map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 2,
                }}
              >
                <span style={{ color: "var(--brand)", fontWeight: 700 }}>[x]</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══ 7. Design System Browser — 设计令牌画廊 ═══ */
function DesignSystemLayout({ skill }: Props) {
  const systems = [
    {
      name: "Bauhaus",
      accent: "#D02020",
      radius: "0px",
      feel: "Minimalist, Bold",
    },
    { name: "Beam", accent: "#ffaa40", radius: "10px", feel: "Clean, Modern" },
    {
      name: "Hand-draw",
      accent: "#ff6b6b",
      radius: "255px 15px",
      feel: "Handwritten",
    },
    { name: "Kinetic", accent: "#DFE104", radius: "0px", feel: "Edgy, Bold" },
    { name: "Luxury", accent: "#D4AF37", radius: "4px", feel: "Elegant" },
    {
      name: "Motion",
      accent: "#3b82f6",
      radius: "24px",
      feel: "Smooth, Fluid",
    },
    {
      name: "Neumorphism",
      accent: "#FF8800",
      radius: "12px",
      feel: "Soft, 3D",
    },
    { name: "Newsprint", accent: "#CC0000", radius: "0px", feel: "Editorial" },
    {
      name: "Playful",
      accent: "#8B5CF6",
      radius: "16px",
      feel: "Colorful, Fun",
    },
    { name: "Uber", accent: "#276EF1", radius: "8px", feel: "Professional" },
    {
      name: "Win98",
      accent: "#0000FF",
      radius: "0px",
      feel: "Retro, Nostalgic",
    },
  ];
  return (
    <div style={{ maxWidth: "840px", margin: "0 auto", padding: "32px 20px 44px" }}>
      <header style={{ textAlign: "center", marginBottom: 32 }}>
        <div
          style={{
            fontSize: "24px",
            marginBottom: 10,
            color: "var(--brand)",
            letterSpacing: "4px",
          }}
        >
          DS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            maxWidth: "46ch",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          {skill.description}
        </p>
      </header>

      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))",
            gap: 10,
          }}
        >
          {systems.map((sys, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card)",
                borderRadius: parseInt(sys.radius) || 8,
                border: "0.5px solid var(--border-soft)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 3,
                  background: `linear-gradient(90deg,${sys.accent},${sys.accent}88)`,
                }}
              />
              <div style={{ padding: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {sys.name}
                  </span>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: sys.accent,
                    }}
                  />
                </div>
                {/* Color swatches */}
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {[0.4, 0.7, 1].map((o, si) => (
                    <div
                      key={si}
                      style={{
                        flex: 1,
                        aspectRatio: "1",
                        borderRadius:
                          typeof sys.radius === "string" && sys.radius.includes(" ")
                            ? "50%"
                            : parseInt(sys.radius) || 4,
                        background: sys.accent,
                        opacity: 0.25 + o * 0.75,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{sys.feel}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Preview */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 10,
          }}
        >
          Output Format
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 8,
            border: "0.5px solid var(--border-soft)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              background: "var(--bg-surface)",
              borderBottom: "0.5px solid var(--border-soft)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--brand)",
              }}
            >
              [doc]
            </span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>CSS Variables</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "12px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              background: "var(--bg-card)",
            }}
          >{`:root {
  --primary: #D02020;
  --bg: #F0F0F0;
  --radius: 0px;
}`}</pre>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 10,
            }}
          >
            Output Formats
          </div>
          {["CSS Variables", "Tailwind Config", "JSON Tokens"].map((fmt) => (
            <div
              key={fmt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: "var(--bg-surface)",
                borderRadius: 6,
                marginBottom: 6,
                fontSize: "12px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--brand)",
                }}
              >
                [doc]
              </span>
              <span>{fmt}</span>
            </div>
          ))}
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 10,
            }}
          >
            Use Cases
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {skill.useCases.slice(0, 6).map((uc, i) => (
              <span
                key={i}
                style={{
                  padding: "5px 12px",
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  border: "0.5px solid var(--border-soft)",
                  fontSize: "11px",
                }}
              >
                {uc.icon} {uc.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   8. Editorial Card Screenshot — 瑞士国际主义杂志
   布局本身就是瑞士风格的演示 · 大数字 · 双栏编辑
   ═══════════════════════════════════════════ */
function EditorialCardLayout({ skill }: Props) {
  const ratios = [
    { label: "3:4", w: 3, h: 4, use: "Portrait cards" },
    { label: "4:3", w: 4, h: 3, use: "Landscape info" },
    { label: "1:1", w: 1, h: 1, use: "Social / Avatar" },
    { label: "16:9", w: 16, h: 9, use: "Video / Hero" },
    { label: "2.35:1", w: 2.35, h: 1, use: "Cinema widescreen" },
    { label: "3:1", w: 3, h: 1, use: "Ultra-wide banner" },
  ];
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 20px 44px" }}>
      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Editorial Design
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "30px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            margin: "0 0 14px",
            paddingLeft: 12,
            borderLeft: "2px solid #1B365D",
          }}
        >
          {skill.description}
        </p>
        <div
          style={{
            display: "flex",
            gap: 20,
            paddingBottom: 12,
            borderBottom: "2px solid var(--border)",
          }}
        >
          {[
            [skill.stats.sectionCount, "Sections"],
            [skill.stats.complexityLabel, "Complexity"],
            [skill.stats.readTime, "Read Time"],
          ].map(([v, l], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: "8px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </header>

      <section style={{ marginBottom: 24 }}>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 6,
            overflow: "hidden",
            border: "0.5px solid var(--border-soft)",
          }}
        >
          <div
            style={{
              padding: "6px 12px",
              background: "var(--bg-secondary)",
              borderBottom: "0.5px solid var(--border-soft)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "8px",
              color: "var(--text-muted)",
            }}
          >
            <span>EDITORIAL CARD PREVIEW</span>
            <span>SWISS STYLE</span>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div
              style={{
                fontSize: "8px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Design System · 2026
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "15px",
                fontWeight: 500,
                lineHeight: 1.15,
                color: "var(--text-primary)",
                margin: "0 0 4px",
              }}
            >
              High-Density Information Card
            </h3>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "11px",
                lineHeight: 1.45,
                color: "var(--text-secondary)",
                margin: 0,
                paddingLeft: 10,
                borderLeft: "2px solid #1B365D",
              }}
            >
              Swiss International Style editorial layout with serif headlines.
            </p>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 10,
              borderBottom: "1px solid var(--border-soft)",
              paddingBottom: 6,
            }}
          >
            Ratios
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
            }}
          >
            {ratios.map((r) => (
              <div
                key={r.label}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: 6,
                  border: "0.5px solid var(--border-soft)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    aspectRatio: `${r.w}/${r.h}`,
                    background: "linear-gradient(135deg,#f8f8f6,#eef2f7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "0.5px solid var(--border-soft)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {r.label}
                  </span>
                </div>
                <div
                  style={{
                    padding: "6px 8px",
                    fontSize: "9px",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {r.use}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 10,
              borderBottom: "1px solid var(--border-soft)",
              paddingBottom: 6,
            }}
          >
            Rules
          </div>
          <div
            style={{
              fontSize: "11px",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
            }}
          >
            {[
              "Serif headlines at weight 500, never bold",
              "Big-character composition for sparse content",
              "Two/three-column grid when content is dense",
              "Oversized numbers, heavy rules, tinted blocks",
              "Match structure to content type",
              "Ratio changes reading path, not volume",
              "Three line-height bands: tight / dense / reading",
              "Solid hex tags for print compatibility",
            ].map((rule) => (
              <div key={rule} style={{ marginBottom: 4, display: "flex", gap: 6 }}>
                <span style={{ color: "var(--text-primary)" }}>—</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══ 9. Infographic Creation — 数据可视化 ═══ */
function InfographicLayout({ skill }: Props) {
  const categories = [
    {
      icon: "📊",
      name: "Charts & Graphs",
      templates: ["Bar", "Line", "Pie", "Radar"],
    },
    {
      icon: "📋",
      name: "Lists & Comparisons",
      templates: ["Comparison", "Pros/Cons", "Matrix"],
    },
    {
      icon: "🗓️",
      name: "Timelines & Flows",
      templates: ["Timeline", "Roadmap", "Funnel"],
    },
    {
      icon: "🌳",
      name: "Hierarchical",
      templates: ["Org Tree", "Mind Map", "Kanban"],
    },
    {
      icon: "📰",
      name: "Editorial Cards",
      templates: ["KPI Card", "Stat Highlight", "Quote"],
    },
    {
      icon: "🎯",
      name: "Strategic",
      templates: ["SWOT", "Boston Matrix", "Gantt"],
    },
  ];
  return (
    <div style={{ maxWidth: "840px", margin: "0 auto", padding: "32px 20px 44px" }}>
      <header style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 16px",
            borderRadius: 16,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "var(--bg-primary)",
            fontSize: "10px",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          INFOGRAPHIC ENGINE
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 8px",
          }}
        >
          {skill.name}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            maxWidth: "48ch",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          {skill.description}
        </p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "20px",
            background: "linear-gradient(135deg,#f5f4ed,#eef2f7)",
            borderRadius: 10,
            border: "0.5px solid var(--border-soft)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              fontWeight: 600,
              color: "#6366f1",
              marginBottom: 12,
            }}
          >
            PREVIEW
          </div>
          {[
            { label: "Visual Design", value: 92, color: "#6366f1" },
            { label: "Diagram", value: 78, color: "#8b5cf6" },
            { label: "Data Viz", value: 95, color: "#a855f7" },
            { label: "Writing", value: 64, color: "#d946ef" },
          ].map((bar) => (
            <div key={bar.label} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: "11px", color: "var(--text-primary)" }}>{bar.label}</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: bar.color,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {bar.value}%
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: 3,
                  background: "rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${bar.value}%`,
                    borderRadius: 3,
                    background: bar.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            style={{
              padding: "14px",
              background: "var(--bg-card)",
              borderRadius: 8,
              border: "0.5px solid var(--border-soft)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: "20px" }}>{cat.icon}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {cat.name}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {cat.templates.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "2px 8px",
                    background: "var(--tag-bg-light)",
                    borderRadius: 4,
                    fontSize: "9px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Syntax Reference */}
      <section style={{ marginBottom: 24 }}>
        <div
          style={{
            background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)",
            borderRadius: 10,
            padding: "20px",
            color: "#e0e7ff",
          }}
        >
          <h3
            style={{
              color: "#a5b4fc",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: 12,
              fontFamily: "var(--font-sans)",
            }}
          >
            Syntax Reference
          </h3>
          <pre
            style={{
              margin: 0,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              lineHeight: 1.6,
              overflowX: "auto",
              color: "#c7d2fe",
            }}
          >{`{
  "type": "infographic",
  "theme": "default",
  "content": {
    "title": "...",
    "items": [...]
  }
}`}</pre>
        </div>
      </section>

      <section style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["70+ Templates", "Iconify Icons", "Dark Mode", "Custom Themes"].map((tag) => (
          <span
            key={tag}
            style={{
              padding: "5px 12px",
              background: "linear-gradient(135deg,#eef2ff,#fae8ff)",
              borderRadius: 12,
              fontSize: "11px",
              color: "#6366f1",
            }}
          >
            ✦ {tag}
          </span>
        ))}
      </section>
    </div>
  );
}
