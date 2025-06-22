"use client";
import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setForm({ name: "" });
    setEditId(null);
    setShowForm(true);
  };
  const handleEdit = (item: Category) => {
    setForm({ name: item.name });
    setEditId(item.id);
    setShowForm(true);
  };
  const handleDelete = (id: number) => {
    setShowDeleteDialog({ open: true, id });
  };
  const confirmDelete = async () => {
    if (!showDeleteDialog.id) return;
    setSubmitting(true);
    let toastShown = false;
    try {
      const res = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: showDeleteDialog.id }),
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c.id !== showDeleteDialog.id));
      toast({ title: "Category deleted", description: "The category was deleted successfully.", variant: "default" });
      toastShown = true;
    } catch (err: any) {
      setError(err.message || "Error deleting category");
      toast({ title: "Delete failed", description: err.message || "Error deleting category", variant: "destructive" });
      toastShown = true;
    } finally {
      setSubmitting(false);
      setShowDeleteDialog({ open: false, id: null });
      if (!toastShown) {
        toast({ title: "Delete failed", description: "Unknown error occurred while deleting category.", variant: "destructive" });
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editId) {
        // Update
        const res = await fetch(`/api/categories?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update category");
        const updated = await res.json();
        setCategories(categories.map((c) => (c.id === editId ? updated : c)));
        toast({ title: "Category updated", description: "The category was updated successfully.", variant: "default" });
      } else {
        // Create
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create category");
        const created = await res.json();
        setCategories([...categories, created]);
        toast({ title: "Category created", description: "The category was created successfully.", variant: "default" });
      }
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Error saving category");
      toast({ title: "Save failed", description: err.message || "Error saving category", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">View, edit, or delete categories. Click "Add Category" to create a new one.</p>
        <button onClick={handleAdd} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition">Add Category</button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-0 border border-gray-100 dark:border-neutral-800 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-neutral-800">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={2} className="text-center text-gray-400 py-8">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center text-gray-400 py-8">No categories yet.</td>
              </tr>
            ) : (
              categories.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 dark:border-neutral-800">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80">Edit</button>
                    <button onClick={() => handleDelete(item.id)} disabled={submitting} className="bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/80">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal/Form for Add/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editId ? "Edit Category" : "Add Category"}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-muted/80">Cancel</button>
              <button type="submit" disabled={submitting} className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90">{editId ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog.open} onOpenChange={open => setShowDeleteDialog(s => ({ ...s, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this category?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button
              className="bg-destructive text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
              onClick={confirmDelete}
              disabled={submitting}
            >
              Yes
            </button>
            <button
              className="bg-muted text-muted-foreground px-4 py-2 rounded font-semibold hover:bg-muted/80 transition"
              onClick={() => setShowDeleteDialog({ open: false, id: null })}
              disabled={submitting}
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
