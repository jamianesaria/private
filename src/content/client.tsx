"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import Image from "next/image";
import { annotation, fieldSource, entryFor, imageProps, mappedData, type CopyImageProps, type CopyState } from "./model";

const Context = createContext<CopyState>({ documents: {}, preview: false });
export function CopyProvider({ value, children }: { value: CopyState; children: ReactNode }) { return <Context value={value}>{children}</Context>; }
export function EditableText({ document, entry, fallback, plain = false, translations }: { document: string; entry: string; fallback: string; plain?: boolean; translations?: Record<string, string> }) {
  const state = useContext(Context);
  const original = entryFor(state, document, entry)?.text ?? fallback;
  const text = translations?.[original] ?? translations?.[original.replaceAll("&apos;", "'")] ?? original;
  return state.preview && !plain ? <span data-sanity={annotation(state, { document, key: entry, field: "text" })}>{text}</span> : text;
}
export function EditableImage(props: CopyImageProps) { const resolved = imageProps(useContext(Context), props); return <Image {...resolved} alt={resolved.alt} />; }
export function useGalleryRecords() { return useContext(Context).gallery; }
export function useFieldAttribute() { const state = useContext(Context); return (object: unknown, key: string | number) => annotation(state, fieldSource(object, key)); }
export function EditableValue({ object, field, children }: { object: unknown; field: string; children: ReactNode }) { const attribute = useFieldAttribute(); return <span data-sanity={attribute(object, field)}>{children}</span>; }
export function useEditableData<T>(document: string, fallback: T, prefix: string[] = []): T {
  const state = useContext(Context);
  const prefixKey = JSON.stringify(prefix);
  return useMemo(() => document === "siteSettings" ? { ...fallback, ...state.settings } : mappedData(state, document, fallback, JSON.parse(prefixKey)), [state, document, fallback, prefixKey]);
}
