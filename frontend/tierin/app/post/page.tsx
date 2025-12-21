"use client";

import { useState, useRef } from "react";
import { Header } from '@/app/components/Header';
import { postAction } from './postAction';
import { SubjectTeacherContainer } from "./suggest_layout";

export default function PostingTestPage() {
  // GoogleClassroom風に「ファイルを追加」→選択済みのファイル名表示を実装
  const [files, setFiles] = useState<File[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const { SubjectInputs, SubjectList, reset: resetSubject } = SubjectTeacherContainer();
  const formRef = useRef<HTMLFormElement>(null);

  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;
    const incoming = Array.from(selected);

    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name + f.size + f.lastModified));
      const merged = [...prev];
      for (const f of incoming) {
        if (!seen.has(f.name + f.size + f.lastModified)) merged.push(f);
      }
      return merged;
    });

    // reset so same files can be selected again
    e.currentTarget.value = "";
  }

  function handleRemoveFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMsg("送信中…");

    const form = new FormData(e.currentTarget);
    files.forEach((f) => form.append("file", f));

    try {
      const result = await postAction(form);

      if (result.success) {
        setStatusMsg("アップロード成功");
        // フォームをリセット
        formRef.current?.reset();
        setFiles([]);
        resetSubject();
      } else {
        // エラーメッセージを表示
        setStatusMsg(result.error || 'アップロードに失敗しました。');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("アップロードに失敗しました。コンソールを確認してください。");
    }
  }

  return (
    <div className="with-header" style={{ paddingBottom: 48, background: "#f5f5f5" }}>
      <Header />
      <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="auth-card">
          <h1 className="auth-title">資料投稿フォーム</h1>

          <p style={{ fontSize: '0.9rem', color: '#666666', marginBottom: '24px', textAlign: 'center' }}>
            科目を入力して、該当授業を選択し、資料ファイルをアップロードしてください。
          </p>

          <form
            ref={formRef}
            method="post"
            action="/posting"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="auth-form"
            style={{ gap: '24px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
              {/* 左カラム: タイトル、科目、先生、年度 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="title" className="auth-label">タイトル</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="例：微積分 過去問"
                    className="auth-input"
                    required
                  />
                </div>

                {SubjectInputs}

                <div>
                  <label htmlFor="year" className="auth-label">年度</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    placeholder="例：2025"
                    min={2008}
                    max={2025}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              {/* 右カラム: 該当授業一覧 */}
              <div>
                {SubjectList}
              </div>
            </div>

            <div>
              <p className="auth-label">資料の種類</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: '#666666' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="contents_type" value="old_exam" defaultChecked style={{ accentColor: '#56D6E4' }} />
                  過去問
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="contents_type" value="subject_resume" style={{ accentColor: '#56D6E4' }} />
                  授業資料
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="contents_type" value="other" style={{ accentColor: '#56D6E4' }} />
                  その他
                </label>
              </div>
            </div>

            <div>
              <p className="auth-label">ファイル（複数可）</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  display: 'inline-flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #d0d0d0',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#333333',
                  transition: 'background 0.2s ease',
                  width: 'fit-content'
                }}>
                  <input type="file" multiple accept="video/mp4,image/png,image/jpeg,application/pdf" onChange={handleAddFiles} style={{ display: 'none' }} />
                  <span>＋</span>
                  <span>ファイルを追加</span>
                </label>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#999999' }}>
                  <span>選択済み: {files.length} 個</span>
                  {files.length > 0 && (
                    <span style={{
                      color: files.reduce((acc, f) => acc + f.size, 0) > 100 * 1024 * 1024 ? '#dc3545' : '#666666',
                      fontWeight: files.reduce((acc, f) => acc + f.size, 0) > 100 * 1024 * 1024 ? '600' : '400'
                    }}>
                      合計: {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)} MB / 100 MB
                    </span>
                  )}
                </div>
              </div>

              {files.length > 0 && (
                <ul style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '12px',
                  listStyle: 'none',
                  padding: 0
                }}>
                  {files.map((f, idx) => (
                    <li key={f.name + f.size + f.lastModified} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div style={{
                          background: '#56D6E4',
                          color: '#ffffff',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>{idx + 1}</div>
                        <div style={{ fontSize: '0.9rem', color: '#333333', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#999999' }}>{Math.round(f.size / 1024)} KB</div>
                      </div>
                      <div>
                        <button type="button" onClick={() => handleRemoveFile(idx)} style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ff4444',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          lineHeight: 1
                        }}>×</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="auth-button">投稿</button>
              {statusMsg && (
                <div style={{
                  fontSize: '0.9rem',
                  color: statusMsg === 'アップロード成功' ? '#28a745' :
                    statusMsg === '送信中…' ? '#666666' : '#dc3545',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: statusMsg === 'アップロード成功' ? '#d4edda' :
                    statusMsg === '送信中…' ? '#f5f5f5' : '#f8d7da',
                  textAlign: 'center',
                  maxWidth: '100%'
                }}>
                  {statusMsg}
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
