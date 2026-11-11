import React,{useEffect,useMemo,useState}from'react';
import{FileClock,Search}from'lucide-react';

const digits=value=>String(value||'').replace(/\D/g,'');
const displayApp=value=>{const d=digits(value);return d.length===8?`${d.slice(0,2)}/${d.slice(2,5)},${d.slice(5)}`:value};
const prettyDate=value=>{if(!value)return'Unknown date';const d=new Date(`${value}T12:00:00`);return Number.isNaN(d.valueOf())?value:d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const isNew=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;const age=(Date.now()-new Date(`${value}T12:00:00Z`).getTime())/864e5;return age>=0&&age<30};

export default function TransactionsView({applications=[],newCounts={},onVisit}){
  const[query,setQuery]=useState(''),[selected,setSelected]=useState('');
  const matches=useMemo(()=>{const q=query.trim().toLowerCase(),n=digits(q);return applications.filter(a=>!q||String(a.application_number||'').includes(n)||String(a.title||'').toLowerCase().includes(q)||String(a.inventor_list||'').toLowerCase().includes(q))},[applications,query]);
  const active=applications.find(a=>a.application_number===selected)||matches[0]||null;
  useEffect(()=>{if(active)onVisit?.(active)},[active?.application_number]);
  return <section className="transactionsLayout">
    <aside className="panel transactionPicker">
      <header><FileClock/><div><h2>Applications</h2><span>{applications.length} transaction histories</span></div></header>
      <label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type an application number or title"/></label>
      <div className="applicationChoices">{matches.map(a=><button key={a.application_number} className={active?.application_number===a.application_number?'active':''} onClick={()=>setSelected(a.application_number)}><b>{displayApp(a.application_number)}{newCounts[a.application_number]>0&&<i className="countBadge">{newCounts[a.application_number]}</i>}</b><span>{a.title||'Untitled application'}</span><small>{a.transactions?.length||0} transactions</small></button>)}{!matches.length&&<p>No matching application.</p>}</div>
    </aside>
    <div className="panel transactionHistory">{active?<><header><div><span className="eyebrow">Application {displayApp(active.application_number)}</span><h2>{active.title||'Untitled application'}</h2><p>{active.inventor_list||'Inventor unavailable'}</p></div><dl><div><dt>Status</dt><dd>{active.status||'Unavailable'}</dd></div><div><dt>Filed</dt><dd>{prettyDate(active.filing_date)}</dd></div><div><dt>Patent</dt><dd>{active.patent_number||'Not issued'}</dd></div><div><dt>Examiner / Art Unit</dt><dd>{[active.examiner,active.art_unit].filter(Boolean).join(' · ')||'Unavailable'}</dd></div></dl></header><div className="transactionRows">{(active.transactions||[]).map((t,i)=><article key={`${t.event_date}-${t.event_code}-${i}`} className={isNew(t.event_date)?'newTransaction':''}><time dateTime={t.event_date}>{prettyDate(t.event_date)}</time><div><strong>{t.description||'USPTO transaction'}</strong><span>Event code: {t.event_code||'—'}</span></div>{isNew(t.event_date)&&<b className="newBadge">New</b>}</article>)}{!active.transactions?.length&&<p className="emptyTransactions">No transactions were returned for this application.</p>}</div></>:<div className="emptyTransactions"><FileClock/><h2>No transaction data yet</h2><p>Run the USPTO sync to create the transaction snapshot.</p></div>}</div>
  </section>;
}
