import React, { useRef } from 'react'

export default function BackupControls({ onExportJSON, onImportJSON, onExportEncrypted, onImportEncrypted }){
  const fileRef = useRef()
  return (
    <div className="card glass backup">
      <h3>Backup / Restore</h3>
      <div style={{display:'flex',gap:8}}>
        <button onClick={onExportJSON}>Export JSON</button>
        <label className="ghost" style={{padding:'6px 10px',borderRadius:8,display:'inline-flex',alignItems:'center',cursor:'pointer'}}>
          <input ref={fileRef} type="file" accept="application/json" style={{display:'none'}} onChange={e=>{ const f = e.target.files && e.target.files[0]; if(f){ const r=new FileReader(); r.onload=()=>onImportJSON(r.result); r.readAsText(f) } }} />Import JSON
        </label>
      </div>
      <div style={{height:8}} />
      <div style={{display:'flex',gap:8}}>
        <button onClick={onExportEncrypted}>Export Encrypted</button>
        <label className="ghost" style={{padding:'6px 10px',borderRadius:8,display:'inline-flex',alignItems:'center',cursor:'pointer'}}>
          <input type="file" accept="application/json" style={{display:'none'}} onChange={e=>{ const f = e.target.files && e.target.files[0]; if(f){ const r=new FileReader(); r.onload=()=>onImportEncrypted(r.result); r.readAsText(f) } }} />Import Encrypted
        </label>
      </div>
      <small className="hint">Encrypted backups require the same password to decrypt.</small>
    </div>
  )
}
