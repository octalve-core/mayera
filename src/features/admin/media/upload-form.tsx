"use client";

import { FormEvent, useState } from "react";

export function MediaUploadForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/admin/media/upload", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json().catch(() => ({})) as { message?: string; media?: { url?: string } };
    if (response.ok) {
      setStatus(`Uploaded: ${result.media?.url ?? "asset saved"}`);
      event.currentTarget.reset();
      window.location.reload();
    } else setStatus(result.message ?? "Upload failed.");
    setBusy(false);
  }
  return <form onSubmit={submit} className="mt-7 grid gap-4 rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-6 md:grid-cols-2"><label className="text-xs uppercase tracking-[.1em]">Image<input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" required className="mt-2 block w-full text-sm normal-case" /></label><Field name="alt" label="Accessible alt text" required /><Field name="folder" label="Folder" defaultValue="products" required /><button disabled={busy} className="min-h-11 rounded-full bg-mayera-espresso px-6 text-sm text-white md:w-fit disabled:opacity-50">{busy ? "Uploading…" : "Upload to object storage"}</button>{status ? <p role="status" className="text-xs leading-5 text-mayera-espresso/60 md:col-span-2">{status}</p> : null}</form>;
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <label className="text-xs uppercase tracking-[.1em]">{label}<input className="mt-2 h-11 w-full rounded-xl border border-mayera-line bg-white px-3 text-sm normal-case" {...props} /></label>;
}
