"use client";

import { useState } from "react";

export default function PostingTestPage() {
  // GoogleClassroom風に「ファイルを追加」→選択済みのファイル名表示を実装
  const [files, setFiles] = useState<File[]>([]);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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
      const res = await fetch("http://localhost:3000/api/posting/", { method: "POST", body: form });
      console.log(res);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatusMsg("アップロード成功");
    } catch (err) {
      console.error(err);
      setStatusMsg("アップロードに失敗しました。コンソールを確認してください。");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 dark:bg-black">
      <main className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">資料投稿フォーム</h1>

        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">科目・担任・年度を入力して、資料ファイルをアップロードしてください。</p>

        <form
          method="post"
          action="/posting"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">タイトル</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="例：微積分 過去問"
                className="w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">科目名</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="例：微分積分"
                className="w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="teacher" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">担任</label>
              <input
                type="text"
                id="teacher"
                name="teacher"
                placeholder="例：山田 太郎"
                className="w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="year" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">年度</label>
              <input
                type="number"
                id="year"
                name="year"
                placeholder="例：2025"
                min={1900}
                max={2100}
                className="w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">資料の種類</p>
            <div className="flex gap-4 text-sm text-zinc-700 dark:text-zinc-300">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="contents_type" value="old_exam" defaultChecked className="accent-blue-600" />
                過去問
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="contents_type" value="subject_resume" className="accent-blue-600" />
                授業資料
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="contents_type" value="other" className="accent-blue-600" />
                その他
              </label>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">ファイル（複数可）</p>

            <div className="flex items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">
                <input type="file" multiple accept="video/mp4,image/png,image/jpeg,application/pdf" onChange={handleAddFiles} className="hidden" />
                <span className="text-base">＋</span>
                <span>ファイルを追加</span>
              </label>

              <div className="text-sm text-zinc-500 dark:text-zinc-400">選択済み: {files.length} 個</div>
            </div>

            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, idx) => (
                  <li key={f.name + f.size + f.lastModified} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 text-xs text-zinc-500 dark:text-zinc-400">{idx + 1}</div>
                      <div className="min-w-0 truncate text-sm text-zinc-800 dark:text-zinc-200">{f.name}</div>
                      <div className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{Math.round(f.size / 1024)} KB</div>
                    </div>
                    <div>
                      <button type="button" onClick={() => handleRemoveFile(idx)} className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900">×</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400"></div>
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-95">投稿</button>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{statusMsg ?? ''}</div>
          </div>
        </form>
      </main>
    </div>
  );
}
