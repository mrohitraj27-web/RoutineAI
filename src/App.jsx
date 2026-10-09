import { useMemo, useState } from 'react'
import './App.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'analyzer', label: 'Workflow Analyzer', icon: 'workflow' },
  { id: 'results', label: 'Optimization Results', icon: 'chart' },
  { id: 'history', label: 'History', icon: 'clock' },
  { id: 'safety', label: 'Safety & Accuracy', icon: 'shield' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

const historyItems = [
  { task: 'Research competitor pricing in SaaS', date: 'Oct 24, 2024', calls: '18 → 11', saved: '38.9%', status: 'Complete' },
  { task: 'Summarize Q3 customer feedback', date: 'Oct 23, 2024', calls: '24 → 15', saved: '37.5%', status: 'Complete' },
  { task: 'Compare project management tools', date: 'Oct 22, 2024', calls: '16 → 10', saved: '37.5%', status: 'Review' },
  { task: 'Find recent AI regulation updates', date: 'Oct 21, 2024', calls: '21 → 13', saved: '38.1%', status: 'Complete' },
  { task: 'Draft product launch checklist', date: 'Oct 20, 2024', calls: '14 → 9', saved: '35.7%', status: 'Complete' },
  { task: 'Analyze support ticket themes', date: 'Oct 19, 2024', calls: '27 → 17', saved: '37.0%', status: 'Review' },
]

const chartValues = {
  '7 days': [32, 44, 39, 58, 50, 69, 64, 79, 72, 87, 78, 96],
  '30 days': [22, 37, 32, 49, 43, 62, 56, 76, 68, 86, 78, 96],
  '90 days': [15, 28, 24, 43, 39, 55, 51, 69, 62, 81, 73, 96],
}

function Icon({ name, size = 18, ...props }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    workflow: <><rect x="3" y="4" width="7" height="6" rx="1.5" /><rect x="14" y="14" width="7" height="6" rx="1.5" /><path d="M10 7h2a2 2 0 0 1 2 2v5" /><path d="m12 12 2 2 2-2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /><path d="M16 6h4v4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.7Z" transform="translate(-1 -1) scale(1.08)" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    up: <><path d="m7 14 5-5 5 5" /></>,
    down: <><path d="m7 10 5 5 5-5" /></>,
    zap: <><path d="m13 2-3 8h7l-6 12 2-9H6l7-11Z" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    sliders: <><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3" /><path d="M2 14h4m4-6h4m4 8h4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...common} {...props}>{icons[name] || icons.spark}</svg>
}

function Button({ children, className = '', ...props }) {
  return <button className={`button ${className}`} {...props}>{children}</button>
}

function Header({ active, onNotify, mobileOpen, setMobileOpen }) {
  const title = navItems.find((item) => item.id === active)?.label ?? 'Dashboard'
  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="icon-button mobile-menu" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
        <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{title}</strong></div>
      </div>
      <div className="topbar-actions">
        <span className="simulated-tag"><span className="status-dot" />SIMULATED DATA</span>
        <button className="icon-button notification-button" aria-label="Show notifications" onClick={onNotify}><Icon name="bell" /><i /></button>
        <button className="profile-button" aria-label="Open profile menu"><span className="avatar">JD</span><span className="profile-name">Jordan Davis</span><Icon name="down" size={14} /></button>
      </div>
    </header>
  )
}

function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); setActive('dashboard'); setMobileOpen(false) }}>
          <span className="brand-mark"><Icon name="spark" size={21} /></span>
          <span className="brand-copy"><b>routine<span>ai</span></b><small>WORKFLOW INTELLIGENCE</small></span>
        </a>
        <div className="workspace-switcher"><span className="workspace-avatar">N</span><span><strong>Northstar Labs</strong><small>Free workspace</small></span><Icon name="down" size={14} /></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={`nav-link ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setMobileOpen(false) }} aria-current={active === item.id ? 'page' : undefined}><Icon name={item.icon} size={18} /><span>{item.label}</span>{item.id === 'safety' && <span className="nav-badge">2</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="usage-card"><div className="usage-top"><span>Monthly usage</span><span>68%</span></div><div className="usage-track"><span /></div><p>1,360 <span>of 2,000 tasks</span></p><button onClick={() => setActive('settings')}>Manage plan <Icon name="arrow" size={14} /></button></div>
          <button className="help-link" onClick={() => setActive('settings')}><span className="help-mark">?</span>Help & support<Icon name="arrow" size={14} /></button>
          <div className="sidebar-foot">RoutineAI <span>v1.0.4 · Simulated</span></div>
        </div>
      </aside>
    </>
  )
}

function MetricCard({ icon, label, value, note, trend, tone }) {
  return <article className="metric-card"><div className="metric-top"><span className={`metric-icon ${tone}`}><Icon name={icon} size={17} /></span><span className={`metric-trend ${trend.startsWith('+') ? 'positive' : ''}`}><Icon name={trend.startsWith('+') ? 'up' : 'down'} size={13} />{trend}</span></div><p className="metric-label">{label}</p><div className="metric-value">{value}</div><p className="metric-note">{note}</p></article>
}

function EfficiencyChart({ range }) {
  const values = chartValues[range] || chartValues['30 days']
  const coords = values.map((value, index) => `${24 + index * 48},${151 - value * 1.18}`).join(' ')
  const area = `M ${coords.replaceAll(' ', ' L ')} L 552 164 L 24 164 Z`
  return <div className="chart-wrap" role="img" aria-label={`Simulated workflow efficiency chart for ${range}`}>
    <svg className="line-chart" viewBox="0 0 580 190" preserveAspectRatio="none">
      <defs><linearGradient id="efficiencyFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#9b7cff" stopOpacity=".22" /><stop offset="100%" stopColor="#9b7cff" stopOpacity="0" /></linearGradient></defs>
      {[30, 65, 100, 135, 170].map((y) => <line key={y} x1="24" x2="555" y1={y} y2={y} className="chart-grid" />)}
      <path d={area} fill="url(#efficiencyFill)" />
      <polyline points={coords} fill="none" stroke="#a58bff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((value, index) => <circle key={index} cx={24 + index * 48} cy={151 - value * 1.18} r={index === values.length - 1 ? 4 : 2.5} className="chart-point" />)}
    </svg>
    <div className="chart-x-labels"><span>Oct 01</span><span>Oct 06</span><span>Oct 12</span><span>Oct 18</span><span>Oct 24</span></div>
  </div>
}

function ActivityChart() {
  const bars = [35, 52, 43, 68, 57, 78, 50, 72, 62, 89, 66, 82, 72, 94, 75, 59, 83, 70, 100, 78, 90, 63, 82, 72]
  return <div className="activity-chart" role="img" aria-label="Simulated volume of optimized tasks in the last 24 hours">
    {bars.map((height, index) => <span key={index} className={index > 17 ? 'bar-highlight' : ''} style={{ height: `${height}%` }} />)}
  </div>
}

function Dashboard({ setActive }) {
  const [range, setRange] = useState('30 days')
  return <div className="page-content">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />OVERVIEW</div><h1>Good morning, Jordan <span className="wave">✦</span></h1><p className="page-subtitle">Here’s what’s happening across your agent workflows.</p></div><Button className="primary" onClick={() => setActive('analyzer')}><Icon name="plus" size={17} />Analyze a workflow</Button></div>
    <div className="metrics-grid">
      <MetricCard icon="workflow" tone="violet" label="Tasks analyzed" value="1,284" note="vs. previous 30 days" trend="+12.8%" />
      <MetricCard icon="zap" tone="mint" label="Tool calls saved" value="8,642" note="across all workflows" trend="+18.2%" />
      <MetricCard icon="chart" tone="blue" label="Efficiency improvement" value="37.4%" note="average reduction" trend="+4.6%" />
      <MetricCard icon="clock" tone="amber" label="Time saved" value="42.6 hrs" note="estimated this month" trend="+9.3%" />
    </div>
    <div className="dashboard-grid">
      <section className="panel efficiency-panel"><div className="panel-heading"><div><h2>Workflow efficiency</h2><p>Estimated reduction in redundant tool calls</p></div><div className="select-wrap"><Icon name="sliders" size={15} /><select aria-label="Chart time range" value={range} onChange={(event) => setRange(event.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select><Icon name="down" size={13} /></div></div><div className="chart-legend"><span><i className="legend-dot purple-dot" />Efficiency gain</span><span className="chart-period">SIMULATED · {range.toUpperCase()}</span></div><EfficiencyChart range={range} /></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Task activity</h2><p>Optimizations over time</p></div><button className="quiet-more" aria-label="More task activity options"><Icon name="more" /></button></div><div className="activity-summary"><strong>186</strong><span><i />+14.2%</span></div><ActivityChart /><div className="activity-axis"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div><div className="activity-foot"><span><i className="legend-dot purple-dot" />Tasks optimized</span><span>LAST 24 HOURS</span></div></section>
    </div>
    <div className="dashboard-grid lower-grid">
      <section className="panel runs-panel"><div className="panel-heading"><div><h2>Recent optimizations</h2><p>Your latest workflow analyses</p></div><button className="text-button" onClick={() => setActive('history')}>View all <Icon name="arrow" size={15} /></button></div><div className="recent-list">{historyItems.slice(0, 4).map((item, index) => <div className="recent-row" key={item.task}><span className={`run-icon run-${index}`}><Icon name={index === 2 ? 'chart' : 'workflow'} size={16} /></span><span className="recent-task"><strong>{item.task}</strong><small>{item.date} <i>·</i> {item.calls} calls</small></span><span className="saved-pill">{item.saved} saved</span></div>)}</div></section>
      <section className="panel accuracy-panel"><div className="panel-heading"><div><h2>Safety & accuracy</h2><p>Validation across analyzed tasks</p></div><button className="text-button" onClick={() => setActive('safety')}>Details <Icon name="arrow" size={15} /></button></div><div className="accuracy-score"><span className="score-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" /><circle className="score-progress" cx="22" cy="22" r="18" /></svg><Icon name="shield" size={16} /></span><strong>98.2%</strong><span className="score-label">validation pass rate</span></div><div className="safety-check"><span><i className="check-dot"><Icon name="check" size={11} /></i>Safety checks passed</span><strong>1,261 / 1,284</strong></div><div className="safety-check"><span><i className="review-dot" />Needs human review</span><strong>23 tasks</strong></div><p className="sim-disclaimer"><Icon name="spark" size={13} />Illustrative sample data — not measured accuracy</p></section>
    </div>
  </div>
}

const initialNodes = [
  { title: 'Understand request', detail: 'Parse user intent', icon: 'spark', kind: 'start' },
  { title: 'Search the web', detail: '3 similar queries', icon: 'search', kind: 'redundant' },
  { title: 'Fetch sources', detail: '5 page requests', icon: 'workflow', kind: 'normal' },
  { title: 'Search the web', detail: 'Repeated query', icon: 'search', kind: 'redundant' },
  { title: 'Summarize findings', detail: 'Synthesize results', icon: 'chart', kind: 'finish' },
]

function WorkflowNode({ node, index }) {
  return <div className={`workflow-node ${node.kind}`}><span className="node-index">{String(index + 1).padStart(2, '0')}</span><span className="node-icon"><Icon name={node.icon} size={17} /></span><span className="node-copy"><strong>{node.title}</strong><small>{node.detail}</small></span>{node.kind === 'redundant' && <span className="redundant-label">REDUNDANT</span>}</div>
}

function Analyzer({ setActive }) {
  const [task, setTask] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const runAnalysis = (event) => {
    event.preventDefault()
    if (!task.trim()) { setError('Enter a task description to preview a simulated workflow.'); return }
    setError('')
    setLoading(true)
    window.setTimeout(() => { setAnalyzed(true); setLoading(false) }, 450)
  }
  return <div className="page-content">
    <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />WORKFLOW INTELLIGENCE</div><h1>Workflow analyzer</h1><p className="page-subtitle">Map a task and inspect where an agent workflow may be repeating work.</p></div><span className="simulated-tag"><span className="status-dot" />SIMULATED PREVIEW</span></div>
    <div className="analyzer-layout"><div className="analyzer-main">
      <section className="panel input-panel"><div className="step-heading"><span className="step-number">01</span><div><h2>Describe your task</h2><p>Enter a task to generate a sample workflow map.</p></div></div><form onSubmit={runAnalysis}><label className="field-label" htmlFor="task-input">TASK DESCRIPTION</label><textarea id="task-input" rows="3" value={task} onChange={(event) => { setTask(event.target.value); setError('') }} placeholder="e.g. Research the latest trends in sustainable packaging and summarize key findings..." aria-describedby={error ? 'task-error' : 'task-hint'} /><div className="input-footer"><small id={error ? 'task-error' : 'task-hint'} className={error ? 'form-error' : ''}>{error || 'Be specific for the most useful workflow preview.'}</small><Button className="primary" disabled={loading}>{loading ? <><span className="spinner" /> Mapping workflow…</> : <><Icon name="spark" size={16} />Map workflow</>}</Button></div></form></section>
      <section className="panel workflow-panel"><div className="panel-heading"><div><h2>Agent workflow map</h2><p>{analyzed ? 'Preview generated from your task description' : 'Example workflow · simulated'}</p></div><span className="node-count">{initialNodes.length} STEPS</span></div><div className="workflow-legend"><span><i className="legend-dot purple-dot" />Workflow step</span><span><i className="legend-dot red-dot" />Potential repetition</span></div><div className="workflow-flow">{initialNodes.map((node, index) => <div className="flow-item" key={`${node.title}-${index}`}><WorkflowNode node={node} index={index} />{index < initialNodes.length - 1 && <div className="flow-connector"><span /><Icon name="arrow" size={13} /></div>}</div>)}</div><div className="workflow-callout"><span className="callout-icon"><Icon name="spark" size={16} /></span><div><strong>{analyzed ? 'Potential repetition detected' : 'We found a possible opportunity'}</strong><p>Two web searches appear to overlap. A real system would validate this against execution traces before suggesting any changes.</p></div></div><div className="workflow-actions"><span><Icon name="shield" size={15} />No workflow is changed by this preview</span><Button onClick={() => setActive('results')}>View sample comparison <Icon name="arrow" size={15} /></Button></div></section>
    </div><aside className="analyzer-aside"><section className="panel guidance-card"><span className="guide-icon"><Icon name="spark" /></span><h3>What you’ll see</h3><p>This preview illustrates how redundant tool calls can be identified in a workflow.</p><div className="guide-point"><span>01</span><p><strong>Map the steps</strong><br />Break down a task into a sequence of agent actions.</p></div><div className="guide-point"><span>02</span><p><strong>Spot repetition</strong><br />Highlight similar searches and overlapping calls.</p></div><div className="guide-point"><span>03</span><p><strong>Review safely</strong><br />A human should approve changes before execution.</p></div><div className="guide-note"><Icon name="shield" size={15} /><span>Sample only. Not connected to an agent or live tools.</span></div></section><section className="panel example-card"><div><span className="example-label">TRY AN EXAMPLE</span><button onClick={() => setTask('Research the top project management tools for small teams and compare their pricing.')}>Compare project management tools <Icon name="arrow" size={14} /></button></div></section></aside></div>
  </div>
}

function Results() {
  const [selected, setSelected] = useState('Research competitor pricing')
  const data = [{ name: 'Tool calls', original: 18, optimized: 11 }, { name: 'Execution time', original: 42, optimized: 26 }, { name: 'Searches', original: 9, optimized: 5 }, { name: 'Page reads', original: 7, optimized: 5 }]
  const max = 45
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />PERFORMANCE</div><h1>Optimization results</h1><p className="page-subtitle">Compare illustrative workflow metrics before and after a hypothetical optimization.</p></div><span className="simulated-tag"><span className="status-dot" />SIMULATED DATA</span></div>
    <div className="results-controls"><label htmlFor="result-select">SAMPLE WORKFLOW</label><select id="result-select" value={selected} onChange={(event) => setSelected(event.target.value)}><option>Research competitor pricing</option><option>Summarize customer feedback</option><option>Compare project management tools</option></select><span className="results-date"><Icon name="clock" size={15} />Sample run · Oct 24, 2024</span></div>
    <div className="results-summary-grid"><div className="panel result-summary purple-summary"><span className="result-summary-icon"><Icon name="zap" /></span><span>TOOL CALLS REDUCED</span><strong>38.9%</strong><small>7 fewer calls in this example</small></div><div className="panel result-summary green-summary"><span className="result-summary-icon"><Icon name="clock" /></span><span>ESTIMATED TIME SAVED</span><strong>16 min</strong><small>42 min → 26 min (illustrative)</small></div><div className="panel result-summary blue-summary"><span className="result-summary-icon"><Icon name="shield" /></span><span>VALIDATION STATUS</span><strong>Pending review</strong><small>Human approval required</small></div></div>
    <section className="panel comparison-panel"><div className="panel-heading"><div><h2>Workflow comparison</h2><p>Estimated values for the selected sample scenario</p></div><div className="comparison-legend"><span><i className="legend-dot gray-dot" />Original</span><span><i className="legend-dot purple-dot" />Optimized preview</span></div></div><div className="comparison-chart" role="img" aria-label="Simulated comparison between original and optimized workflow metrics">{data.map((item) => <div className="comparison-row" key={item.name}><span className="comparison-name">{item.name}</span><div className="comparison-bars"><div className="compare-bar"><span className="bar-original" style={{ width: `${item.original / max * 100}%` }} /><b>{item.original}{item.name === 'Execution time' ? ' min' : ''}</b></div><div className="compare-bar"><span className="bar-optimized" style={{ width: `${item.optimized / max * 100}%` }} /><b>{item.optimized}{item.name === 'Execution time' ? ' min' : ''}</b><em>−{Math.round((1 - item.optimized / item.original) * 100)}%</em></div></div></div>)}</div><p className="chart-caveat">Illustrative comparison only. No live workflow data has been analyzed.</p></section>
    <section className="panel result-review"><div className="review-icon"><Icon name="shield" /></div><div><strong>Review before applying</strong><p>Changes should be validated against task requirements and safety policies before use. This frontend does not execute or apply workflow changes.</p></div><button className="text-button" onClick={() => window.alert('Sample comparison exported for review.')}>Export summary <Icon name="download" size={15} /></button></section>
  </div>
}

function History({ onExport }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All runs')
  const filtered = useMemo(() => historyItems.filter((item) => item.task.toLowerCase().includes(query.toLowerCase()) && (filter === 'All runs' || item.status === filter)), [query, filter])
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />ACTIVITY LOG</div><h1>Optimization history</h1><p className="page-subtitle">Browse sample workflow analyses and their illustrative results.</p></div><Button onClick={onExport}><Icon name="download" size={16} />Export CSV</Button></div>
    <section className="panel history-panel"><div className="history-toolbar"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search optimization runs" placeholder="Search workflows..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div><label className="filter-select"><Icon name="sliders" size={16} /><select aria-label="Filter runs by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All runs</option><option>Complete</option><option>Review</option></select><Icon name="down" size={13} /></label><span className="history-count">{filtered.length} {filtered.length === 1 ? 'run' : 'runs'}</span></div>
      {filtered.length ? <div className="table-scroll"><table><thead><tr><th>TASK</th><th>DATE</th><th>TOOL CALLS</th><th>CALLS REDUCED</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.task}><td><span className={`table-task-icon run-${index % 4}`}><Icon name="workflow" size={15} /></span><strong>{item.task}</strong></td><td>{item.date}</td><td className="calls-cell">{item.calls}</td><td><span className="saved-pill">{item.saved}</span></td><td><span className={`status-pill ${item.status === 'Review' ? 'review-status' : ''}`}><i />{item.status}</span></td><td><button className="quiet-more" aria-label={`Actions for ${item.task}`}><Icon name="more" /></button></td></tr>)}</tbody></table></div> : <div className="empty-state"><span><Icon name="search" size={21} /></span><strong>No runs found</strong><p>Try another search or change the status filter.</p><button className="text-button" onClick={() => { setQuery(''); setFilter('All runs') }}>Clear filters</button></div>}
      <div className="table-footer"><span>Showing {filtered.length ? `1–${filtered.length}` : '0'} of 128 sample runs</span><div><button disabled aria-label="Previous page">‹</button><button className="current-page" aria-current="page">1</button><button onClick={() => window.alert('Only sample page 1 is available in this demo.')}>2</button><button aria-label="Next page" onClick={() => window.alert('Only sample page 1 is available in this demo.')}>›</button></div></div>
    </section>
    <p className="history-disclaimer"><Icon name="spark" size={14} />All rows are sample records for interface demonstration.</p>
  </div>
}

function Safety() {
  const [expanded, setExpanded] = useState('')
  const checks = [{ title: 'Task intent preserved', desc: 'Illustrative checks suggest the hypothetical output still covers the original task goal.', status: 'Sample pass', icon: 'check' }, { title: 'Source coverage', desc: 'Overlapping source lookups are flagged for a human to inspect before any workflow change.', status: 'Needs review', icon: 'search' }, { title: 'Policy compliance', desc: 'No live safety policy engine is connected. Configure policies in Settings for this demo.', status: 'Not connected', icon: 'shield' }]
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />TRUST & GOVERNANCE</div><h1>Safety & accuracy</h1><p className="page-subtitle">Understand validation status and when human review is needed.</p></div><span className="simulated-tag"><span className="status-dot" />DEMO MODE</span></div>
    <div className="safety-banner"><span><Icon name="shield" size={21} /></span><div><strong>Simulation — no measured accuracy</strong><p>This demo has no connected AI agent, execution traces, or validation backend. Percentages and checks below are illustrative sample values.</p></div></div>
    <div className="safety-metrics"><section className="panel safety-metric"><span>ILLUSTRATIVE TASK CORRECTNESS</span><strong>98.2%</strong><p><i className="safe-check"><Icon name="check" size={11} /></i>Sample metric only</p></section><section className="panel safety-metric"><span>SAMPLE SAFETY CHECKS</span><strong>1,261 <small>/ 1,284</small></strong><p><i className="safe-check"><Icon name="check" size={11} /></i>Example validation count</p></section><section className="panel safety-metric"><span>HUMAN REVIEW REQUIRED</span><strong>23 <small>tasks</small></strong><p><i className="review-dot" />Illustrative flagged cases</p></section></div>
    <section className="panel validation-panel"><div className="panel-heading"><div><h2>Validation checklist</h2><p>Sample validation categories</p></div><span className="node-count">3 CHECKS</span></div><div className="validation-list">{checks.map((item) => <div className="validation-item" key={item.title}><button className="validation-row" aria-expanded={expanded === item.title} onClick={() => setExpanded(expanded === item.title ? '' : item.title)}><span className={`validation-icon ${item.status === 'Needs review' ? 'warn' : ''}`}><Icon name={item.icon} size={16} /></span><span className="validation-copy"><strong>{item.title}</strong><small>{item.status === 'Sample pass' ? 'Example check passed in sample data' : item.status === 'Needs review' ? 'Human review recommended' : 'Backend not connected'}</small></span><span className={`validation-status ${item.status === 'Needs review' ? 'status-warn' : item.status === 'Not connected' ? 'status-neutral' : ''}`}>{item.status}</span><Icon name="down" size={15} /></button>{expanded === item.title && <p className="validation-detail">{item.desc}</p>}</div>)}</div></section>
    <section className="human-review-note"><span><Icon name="workflow" size={18} /></span><div><strong>Human oversight is part of the workflow</strong><p>Optimization suggestions are not automatically applied. Review proposed changes and verify task outcomes before production use.</p></div></section>
  </div>
}

function Settings() {
  const [threshold, setThreshold] = useState(20)
  const [toggles, setToggles] = useState({ requireReview: true, preserveSources: true, blockSensitive: true, logChanges: false })
  const flip = (key) => setToggles((current) => ({ ...current, [key]: !current[key] }))
  const [saved, setSaved] = useState(false)
  const policies = [{ key: 'requireReview', title: 'Require human review', description: 'Always require approval before applying an optimization.' }, { key: 'preserveSources', title: 'Preserve source coverage', description: 'Do not remove research steps that provide unique evidence.' }, { key: 'blockSensitive', title: 'Block sensitive workflows', description: 'Flag tasks that may handle confidential or personal data.' }, { key: 'logChanges', title: 'Log policy changes', description: 'Keep an audit trail of updates to these settings.' }]
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />PREFERENCES</div><h1>Settings</h1><p className="page-subtitle">Set illustrative thresholds and safety defaults for your workspace.</p></div><span className="settings-saved" aria-live="polite">{saved ? <><Icon name="check" size={14} />Settings saved</> : ''}</span></div>
    <div className="settings-layout"><div className="settings-main"><section className="panel settings-section"><div className="settings-section-heading"><span className="settings-section-icon violet"><Icon name="sliders" /></span><div><h2>Optimization thresholds</h2><p>Choose when a workflow should be flagged for review.</p></div></div><div className="threshold-setting"><div className="threshold-copy"><strong>Minimum tool-call reduction</strong><p>Flag workflows when estimated savings meet this threshold.</p></div><label className="range-label"><input type="range" min="5" max="60" step="5" value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); setSaved(false) }} aria-label="Minimum tool-call reduction percentage" /><span>{threshold}%</span></label></div><div className="setting-select-row"><div><strong>Default review mode</strong><p>How proposed changes are handled.</p></div><select aria-label="Default review mode" onChange={() => setSaved(false)}><option>Require human approval</option><option>Preview only</option><option>Manual review by policy</option></select></div></section>
    <section className="panel settings-section"><div className="settings-section-heading"><span className="settings-section-icon blue"><Icon name="shield" /></span><div><h2>Safety policies</h2><p>Controls for responsible workflow recommendations.</p></div></div><div className="policy-list">{policies.map((policy) => <div className="policy-row" key={policy.key}><div><strong>{policy.title}</strong><p>{policy.description}</p></div><button className={`toggle ${toggles[policy.key] ? 'toggle-on' : ''}`} role="switch" aria-checked={toggles[policy.key]} aria-label={policy.title} onClick={() => { flip(policy.key); setSaved(false) }}><span /></button></div>)}</div></section>
    <div className="settings-actions"><span>Settings apply to this demo session only.</span><Button className="primary" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2800) }}>Save settings</Button></div></div><aside className="panel settings-note"><span className="guide-icon"><Icon name="spark" /></span><h3>Safe by default</h3><p>These controls demonstrate a possible policy interface. They do not connect to a live agent or enforce backend policies.</p><div className="guide-note"><Icon name="shield" size={15} /><span>Review all changes before using them with production workflows.</span></div></aside></div>
  </div>
}

function App() {
  const [active, setActive] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')
  const notify = () => { setToast('You’re all caught up on sample notifications.'); window.setTimeout(() => setToast(''), 3000) }
  const exportCsv = () => {
    const rows = [['Task', 'Date', 'Tool calls', 'Calls reduced', 'Status'], ...historyItems.map((item) => [item.task, item.date, item.calls, item.saved, item.status])]
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'routineai-sample-history.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><main className="main-area"><Header active={active} onNotify={notify} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><div className="page-scroll">{active === 'dashboard' && <Dashboard setActive={setActive} />}{active === 'analyzer' && <Analyzer setActive={setActive} />}{active === 'results' && <Results />}{active === 'history' && <History onExport={exportCsv} />}{active === 'safety' && <Safety />}{active === 'settings' && <Settings />}<footer className="app-footer"><span>© 2024 RoutineAI</span><span><i />All results shown are simulated sample data</span><button onClick={() => setActive('safety')}>Safety & data policy</button></footer></div></main>{toast && <div role="status" className="toast"><Icon name="check" size={16} />{toast}</div>}</div>
}

export default App
