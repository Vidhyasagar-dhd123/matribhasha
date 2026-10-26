"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare, Database, Filter, ListFilter, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { PageHeader } from "./PageHeader";

type FieldType = "text" | "number" | "boolean" | "date" | "json" | "relation";
type ModelField = {
  name: string;
  label: string;
  type: FieldType;
  relation?: string;
  filterable?: boolean;
  editable?: boolean;
};
type ModelDefinition = { name: string; label: string; description: string; fields: ModelField[] };
type RecordValue = string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
type DataRecord = { _id: string; [key: string]: RecordValue };
type Relationship = {
  direction: "forward" | "reverse";
  field: string;
  model?: string;
  label: string;
  records: DataRecord[];
};

const displayValue = (value: RecordValue) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function DataModelsPanel() {
  const [models, setModels] = useState<ModelDefinition[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<DataRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectingMatches, setSelectingMatches] = useState(false);
  const [error, setError] = useState("");

  const definition = useMemo(
    () => models.find((model) => model.name === selectedModel),
    [models, selectedModel]
  );

  const loadModels = useCallback(async () => {
    const response = await fetch("/api/v1/admin/data-models", {
      headers: getRequestHeaders(false),
    });
    if (!response.ok) throw new Error("Unable to load data models");
    const data = (await response.json()) as { models: ModelDefinition[] };
    setModels(data.models);
    setSelectedModel((current) => current || data.models[0]?.name || "");
  }, []);

  const loadRecords = useCallback(async () => {
    if (!selectedModel) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(pagination.page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const response = await fetch(
        `/api/v1/admin/data-models/${selectedModel}?${params.toString()}`,
        { headers: getRequestHeaders(false) }
      );
      const data = (await response.json()) as {
        records?: DataRecord[];
        pagination?: { page: number; pages: number; total: number };
        message?: string;
      };
      if (!response.ok) throw new Error(data.message || "Unable to load records");
      setRecords(data.records || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, search, selectedModel]);

  useEffect(() => {
    loadModels().catch((loadError) =>
      setError(loadError instanceof Error ? loadError.message : "Unable to load data models")
    );
  }, [loadModels]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const selectModel = (name: string) => {
    setSelectedModel(name);
    setSelected(null);
    setSelectedIds([]);
    setBulkEditing(false);
    setFilters({});
    setPagination((current) => ({ ...current, page: 1 }));
  };

  const toggleRecord = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const selectMatchingValue = async (field: ModelField, value: RecordValue) => {
    if (
      value === null ||
      value === undefined ||
      value === "—" ||
      field.type === "relation" ||
      field.type === "json"
    ) return;
    setSelectingMatches(true);
    setError("");
    try {
      const params = new URLSearchParams({
        field: field.name,
        value: String(value),
      });
      const response = await fetch(
        `/api/v1/admin/data-models/${selectedModel}/bulk?${params.toString()}`,
        { headers: getRequestHeaders(false) }
      );
      const data = (await response.json()) as { ids?: string[]; count?: number; capped?: boolean; message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to select matching records");
      setSelectedIds(data.ids || []);
      if (data.capped) {
        setError(`Selected the first ${data.count} matching records. Refine the value before applying a bulk update.`);
      }
    } catch (selectionError) {
      setError(selectionError instanceof Error ? selectionError.message : "Unable to select matching records");
    } finally {
      setSelectingMatches(false);
    }
  };

  const bulkUpdate = async () => {
    if (!definition || !bulkField || !selectedIds.length) return;
    setSaving(true);
    setError("");
    try {
      const field = definition.fields.find((item) => item.name === bulkField);
      if (!field) throw new Error("Select a valid field");
      let value: unknown = bulkValue;
      if (field.type === "number") value = Number(bulkValue);
      if (field.type === "boolean") value = bulkValue === "true";
      if (field.type === "json") value = JSON.parse(bulkValue);
      const response = await fetch(`/api/v1/admin/data-models/${selectedModel}/bulk`, {
        method: "PATCH",
        headers: getRequestHeaders(true),
        body: JSON.stringify({ ids: selectedIds, updates: { [bulkField]: value } }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to bulk update records");
      setSelectedIds([]);
      setBulkEditing(false);
      setBulkField("");
      setBulkValue("");
      await loadRecords();
    } catch (bulkError) {
      setError(bulkError instanceof Error ? bulkError.message : "Unable to bulk update records");
    } finally {
      setSaving(false);
    }
  };

  const openRecord = async (record: DataRecord) => {
    setSelected(record);
    setEditing(false);
    setRelationships([]);
    setDetailsLoading(true);
    const nextDraft: Record<string, string> = {};
    definition?.fields.filter((field) => field.type !== "relation").forEach((field) => {
      const value = record[field.name];
      nextDraft[field.name] =
        field.type === "json" ? JSON.stringify(value ?? [], null, 2) : displayValue(value);
    });
    setDraft(nextDraft);
    try {
      const response = await fetch(
        `/api/v1/admin/data-models/${selectedModel}/${record._id}`,
        { headers: getRequestHeaders(false) }
      );
      const data = (await response.json()) as {
        record?: DataRecord;
        relationships?: Relationship[];
        message?: string;
      };
      if (!response.ok) throw new Error(data.message || "Unable to load record details");
      if (data.record) {
        setSelected(data.record);
        const detailDraft: Record<string, string> = {};
        definition?.fields.filter((field) => field.type !== "relation").forEach((field) => {
          const value = data.record?.[field.name];
          detailDraft[field.name] =
            field.type === "json" ? JSON.stringify(value ?? [], null, 2) : displayValue(value);
        });
        setDraft(detailDraft);
      }
      setRelationships(data.relationships || []);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Unable to load record details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const saveRecord = async () => {
    if (!definition) return;
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {};
      definition.fields.filter((field) => field.editable !== false && field.type !== "relation").forEach((field) => {
        const value = draft[field.name];
        if (field.type === "number") payload[field.name] = value === "" ? undefined : Number(value);
        else if (field.type === "boolean") payload[field.name] = value === "true";
        else if (field.type === "json") payload[field.name] = value ? JSON.parse(value) : [];
        else if (value !== "—") payload[field.name] = value;
      });
      const url = selected
        ? `/api/v1/admin/data-models/${selectedModel}/${selected._id}`
        : `/api/v1/admin/data-models/${selectedModel}`;
      const response = await fetch(url, {
        method: selected ? "PATCH" : "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { record?: DataRecord; message?: string };
      if (!response.ok) throw new Error(data.message || "Unable to save record");
      setSelected(data.record || null);
      setEditing(false);
      await loadRecords();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save record");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async () => {
    if (!selected || !window.confirm("Delete this record? This cannot be undone.")) return;
    const response = await fetch(
      `/api/v1/admin/data-models/${selectedModel}/${selected._id}`,
      { method: "DELETE", headers: getRequestHeaders(false) }
    );
    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setError(data.message || "Unable to delete record");
      return;
    }
    setSelected(null);
    await loadRecords();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] gap-6">
      <aside className="w-64 shrink-0 space-y-4">
        <PageHeader section="Admin" title="Data" heading="Data models" />
        <div className="rounded-lg border border-border bg-card p-2">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Models
          </div>
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => selectModel(model.name)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                selectedModel === model.name
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Database size={15} />
              {model.label}
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0 flex-1 space-y-4">
        {definition && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{definition.label}</h2>
                <p className="text-sm text-muted-foreground">{definition.description}</p>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setEditing(true);
                  setDraft({});
                }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                <Plus size={16} /> Add record
              </button>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-60 flex-1 text-sm">
                  <span className="mb-1 block text-muted-foreground">Search text fields</span>
                  <span className="flex items-center gap-2 rounded-md border border-border bg-background px-2">
                    <Search size={16} className="text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPagination((current) => ({ ...current, page: 1 }));
                      }}
                      className="w-full bg-transparent py-2 outline-none"
                      placeholder="Search records..."
                    />
                  </span>
                </label>
                {definition.fields.filter((field) => field.filterable && field.type !== "json").map((field) => (
                  <label key={field.name} className="min-w-36 text-sm">
                    <span className="mb-1 block text-muted-foreground">{field.label}</span>
                    <input
                      value={filters[field.name] || ""}
                      onChange={(event) => {
                        setFilters((current) => ({ ...current, [field.name]: event.target.value }));
                        setPagination((current) => ({ ...current, page: 1 }));
                      }}
                      className="w-full rounded-md border border-border bg-background px-2 py-2 outline-none"
                      placeholder={`Filter ${field.label}`}
                    />
                  </label>
                ))}
                <button onClick={() => loadRecords()} className="rounded-md border border-border p-2 hover:bg-muted">
                  <RefreshCw size={17} />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Filter size={14} /> Relationship fields are shown as IDs and can be filtered exactly.
              </div>
            </div>

            {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="overflow-auto rounded-lg border border-border bg-card">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-border text-left text-muted-foreground">
                  <tr>
                    <th className="w-10 p-3">
                      <input
                        type="checkbox"
                        checked={records.length > 0 && records.every((record) => selectedIds.includes(record._id))}
                        onChange={(event) =>
                          setSelectedIds(event.target.checked ? records.map((record) => record._id) : [])
                        }
                        aria-label="Select all visible records"
                      />
                    </th>
                    {definition.fields.filter((field) => field.type !== "relation" && field.name in (records[0] || {})).slice(0, 5).map((field) => (
                      <th key={field.name} className="p-3 font-medium">{field.label}</th>
                    ))}
                    <th className="p-3 font-medium">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} onClick={() => openRecord(record)} className="cursor-pointer border-b border-border hover:bg-muted/40">
                      <td className="p-3" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(record._id)}
                          onChange={() => toggleRecord(record._id)}
                          aria-label={`Select ${record._id}`}
                        />
                      </td>
                      {definition.fields.filter((field) => field.type !== "relation" && field.name in record).slice(0, 5).map((field) => (
                        <td key={field.name} className="group max-w-64 p-3">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{displayValue(record[field.name])}</span>
                            <button
                              type="button"
                              disabled={selectingMatches}
                              onClick={(event) => {
                                event.stopPropagation();
                                selectMatchingValue(field, record[field.name]);
                              }}
                              className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-primary/10 hover:text-primary group-hover:opacity-100 disabled:opacity-40"
                              title={`Select all records where ${field.label} equals this value`}
                              aria-label={`Select all records where ${field.label} equals this value`}
                            >
                              <ListFilter size={14} />
                            </button>
                          </div>
                        </td>
                      ))}
                      <td className="p-3 font-mono text-xs text-muted-foreground">{record._id}</td>
                    </tr>
                  ))}
                  {!loading && records.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No records match these filters.</td></tr>}
                  {loading && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading records...</td></tr>}
                </tbody>
              </table>
            </div>
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                <span className="text-sm font-medium">{selectedIds.length} records selected</span>
                <button
                  onClick={() => setBulkEditing(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  <CheckSquare size={16} /> Bulk update field
                </button>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{pagination.total} records</span>
              <div className="flex gap-2">
                <button disabled={pagination.page <= 1} onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))} className="rounded border border-border px-3 py-1 disabled:opacity-40">Previous</button>
                <span className="px-2 py-1">Page {pagination.page} of {pagination.pages}</span>
                <button disabled={pagination.page >= pagination.pages} onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))} className="rounded border border-border px-3 py-1 disabled:opacity-40">Next</button>
              </div>
            </div>
          </>
        )}
      </section>

      {(selected || editing) && definition && (
        <aside className="fixed bottom-0 right-0 top-16 z-[60] w-full max-w-xl overflow-y-auto border-l border-border bg-card p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selected ? "Record details" : "Add record"}</h2>
              {selected && <p className="font-mono text-xs text-muted-foreground">{selected._id}</p>}
            </div>
            <button onClick={() => { setSelected(null); setEditing(false); }}><X size={20} /></button>
          </div>
          <div className="space-y-4">
            {detailsLoading && selected && <p className="text-sm text-muted-foreground">Loading related records...</p>}
            {definition.fields.filter((field) => field.editable !== false && field.type !== "relation").map((field) => (
              <label key={field.name} className="block text-sm">
                <span className="mb-1 block font-medium">{field.label}{field.relation && <span className="ml-1 text-xs text-muted-foreground">→ {field.relation}</span>}</span>
                {field.type === "json" || field.name === "content" || field.name === "description" || field.name === "bio" ? (
                  <textarea value={draft[field.name] || ""} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))} rows={field.type === "json" ? 4 : 3} className="w-full rounded-md border border-border bg-background p-2 font-mono text-xs outline-none" />
                ) : field.type === "boolean" ? (
                  <select value={draft[field.name] || "false"} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))} className="w-full rounded-md border border-border bg-background p-2 outline-none"><option value="true">true</option><option value="false">false</option></select>
                ) : (
                  <input type={field.name === "password" ? "password" : field.type === "number" ? "number" : "text"} value={draft[field.name] || ""} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))} className="w-full rounded-md border border-border bg-background p-2 outline-none" />
                )}
                {bulkEditing && definition && (
                  <aside className="fixed bottom-0 right-0 top-16 z-[60] w-full max-w-xl overflow-y-auto border-l border-border bg-card p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">Bulk update field</h2>
                        <p className="text-sm text-muted-foreground">Update {selectedIds.length} selected records.</p>
                      </div>
                      <button onClick={() => setBulkEditing(false)}><X size={20} /></button>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm">
                        <span className="mb-1 block font-medium">Field</span>
                        <select
                          value={bulkField}
                          onChange={(event) => {
                            setBulkField(event.target.value);
                            setBulkValue("");
                          }}
                          className="w-full rounded-md border border-border bg-background p-2 outline-none"
                        >
                          <option value="">Select a field</option>
                          {definition.fields
                            .filter((field) => field.editable !== false && field.type !== "relation")
                            .map((field) => <option key={field.name} value={field.name}>{field.label}</option>)}
                        </select>
                      </label>
                      {bulkField && (
                        <label className="block text-sm">
                          <span className="mb-1 block font-medium">New value</span>
                          {definition.fields.find((field) => field.name === bulkField)?.type === "boolean" ? (
                            <select value={bulkValue} onChange={(event) => setBulkValue(event.target.value)} className="w-full rounded-md border border-border bg-background p-2 outline-none">
                              <option value="">Select value</option>
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            <textarea
                              value={bulkValue}
                              onChange={(event) => setBulkValue(event.target.value)}
                              rows={definition.fields.find((field) => field.name === bulkField)?.type === "json" ? 5 : 3}
                              className="w-full rounded-md border border-border bg-background p-2 font-mono text-xs outline-none"
                              placeholder="Enter the value applied to every selected record"
                            />
                          )}
                        </label>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setBulkEditing(false)} className="rounded-md border border-border px-3 py-2 text-sm">Cancel</button>
                      <button disabled={saving || !bulkField || !bulkValue} onClick={bulkUpdate} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                        {saving ? "Updating..." : "Apply to selected"}
                      </button>
                    </div>
                  </aside>
                )}
              </label>
            ))}
          </div>
          {selected && !editing && (
            <div className="mt-8 space-y-4 border-t border-border pt-5">
              <div>
                <h3 className="font-semibold">Relationships</h3>
                <p className="text-xs text-muted-foreground">Forward references and records that point to this record.</p>
              </div>
              {relationships.map((relationship) => (
                <div key={`${relationship.direction}-${relationship.model}-${relationship.field}`} className="rounded-md border border-border bg-background p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{relationship.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {relationship.direction === "forward" ? `→ ${relationship.model}` : `← ${relationship.model}`}
                    </span>
                  </div>
                  {relationship.records.length ? (
                    <div className="space-y-2">
                      {relationship.records.map((relatedRecord) => (
                        <div key={relatedRecord._id} className="rounded border border-border/70 p-2 text-xs">
                          <div className="mb-1 font-mono text-muted-foreground">{relatedRecord._id}</div>
                          <div className="grid gap-1">
                            {Object.entries(relatedRecord)
                              .filter(([key]) => key !== "_id")
                              .slice(0, 6)
                              .map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium">{key}:</span>
                                  <span className="truncate text-muted-foreground">{displayValue(value)}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No related records.</p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-between">
            {selected ? <button onClick={deleteRecord} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive"><Trash2 size={15} /> Delete</button> : <span />}
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setSelected(null); }} className="rounded-md border border-border px-3 py-2 text-sm">Cancel</button>
              <button disabled={saving} onClick={saveRecord} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
