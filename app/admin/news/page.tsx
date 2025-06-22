"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { toast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";

interface NewsItem {
	id: number;
	title: string;
	content: string;
	imageUrl?: string;
	createdAt?: string;
}

export default function AdminNewsPage() {
	const [news, setNews] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [editId, setEditId] = useState<number | null>(null);
	const [form, setForm] = useState({ title: "", content: "", imageUrl: "" });
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [useFile, setUseFile] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState<{
		open: boolean;
		id: number | null;
	}>({ open: false, id: null });
	const [showActionDialog, setShowActionDialog] = useState<{
		open: boolean;
		type: "create" | "update" | null;
	}>({
		open: false,
		type: null,
	});
	const [pendingForm, setPendingForm] = useState<typeof form | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);

	// Fetch news from API
	const fetchNews = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/news");
			if (!res.ok) throw new Error("Failed to fetch news");
			const data = await res.json();
			setNews(data);
		} catch (err: any) {
			setError(err.message || "Error loading news");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNews();
	}, []);

	const handleAdd = () => {
		setForm({ title: "", content: "", imageUrl: "" });
		setImageFile(null);
		setUseFile(false);
		setEditId(null);
		setShowForm(true);
	};
	const handleEdit = (item: NewsItem) => {
		setForm({
			title: item.title,
			content: item.content,
			imageUrl: item.imageUrl || "",
		});
		setImageFile(null);
		setUseFile(false);
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
			const res = await fetch(`/api/news`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: showDeleteDialog.id }),
			});
			if (!res.ok) throw new Error("Failed to delete news post");
			setNews(news.filter((n) => n.id !== showDeleteDialog.id));
			toast({
				title: "News deleted",
				description: "The news post was deleted successfully.",
				variant: "default",
			});
			toastShown = true;
		} catch (err: any) {
			setError(err.message || "Error deleting news post");
			toast({
				title: "Delete failed",
				description: err.message || "Error deleting news post",
				variant: "destructive",
			});
			toastShown = true;
		} finally {
			setSubmitting(false);
			setShowDeleteDialog({ open: false, id: null });
			if (!toastShown) {
				toast({
					title: "Delete failed",
					description: "Unknown error occurred while deleting news post.",
					variant: "destructive",
				});
			}
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImageFile(e.target.files[0]);
			setUseFile(true);
			setForm((f) => ({ ...f, imageUrl: "" }));
		}
	};

	const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm((f) => ({ ...f, imageUrl: e.target.value }));
		setUseFile(false);
		setImageFile(null);
	};

	const handleFormSubmit = (type: "create" | "update") => {
		setShowActionDialog({ open: true, type });
		setPendingForm({ ...form });
	};

	const confirmAction = async () => {
		if (!showActionDialog.type || !pendingForm) return;
		setSubmitting(true);
		setError(null);
		let imageUrl = pendingForm.imageUrl;
		try {
			if (useFile && imageFile) {
				// Upload image file to /api/upload with progress
				const data = new FormData();
				data.append("file", imageFile);

				await new Promise<void>((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.open("POST", "/api/upload");
					xhr.upload.onprogress = (event) => {
						if (event.lengthComputable) {
							const percent = Math.round((event.loaded / event.total) * 100);
							setUploadProgress(percent);
						}
					};
					xhr.onload = () => {
						if (xhr.status >= 200 && xhr.status < 300) {
							const uploadData = JSON.parse(xhr.responseText);
							imageUrl = uploadData.url;
							setUploadProgress(null);
							resolve();
						} else {
							setUploadProgress(null);
							reject(new Error("Image upload failed"));
						}
					};
					xhr.onerror = () => {
						setUploadProgress(null);
						reject(new Error("Image upload failed"));
					};
					xhr.send(data);
				});
			}
			const payload = { ...pendingForm, imageUrl };
			if (showActionDialog.type === "update" && editId) {
				// Update
				const res = await fetch("/api/news", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: editId, ...payload }),
				});
				if (!res.ok) throw new Error("Failed to update news post");
				const updated = await res.json();
				setNews(news.map((n) => (n.id === editId ? updated : n)));
				toast({
					title: "News updated",
					description: "The news post was updated successfully.",
					variant: "default",
				});
			} else if (showActionDialog.type === "create") {
				// Create
				const res = await fetch("/api/news", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to create news post");
				const created = await res.json();
				setNews([...news, created]);
				toast({
					title: "News created",
					description: "The news post was created successfully.",
					variant: "default",
				});
			}
			setShowForm(false);
		} catch (err: any) {
			setError(err.message || "Error");
		} finally {
			setSubmitting(false);
			setUploadProgress(null);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		let imageUrl = form.imageUrl;
		try {
			if (useFile && imageFile) {
				// Upload image file to /api/upload (to be implemented)
				const data = new FormData();
				data.append("file", imageFile);
				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: data,
				});
				if (!uploadRes.ok) throw new Error("Image upload failed");
				const uploadData = await uploadRes.json();
				imageUrl = uploadData.url;
			}
			const payload = { ...form, imageUrl };
			if (editId) {
				// Update
				const res = await fetch("/api/news", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: editId, ...payload }),
				});
				if (!res.ok) throw new Error("Failed to update news post");
				const updated = await res.json();
				setNews(news.map((n) => (n.id === editId ? updated : n)));
				toast({
					title: "News updated",
					description: "The news post was updated successfully.",
					variant: "default",
				});
			} else {
				// Create
				const res = await fetch("/api/news", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				if (!res.ok) throw new Error("Failed to create news post");
				const created = await res.json();
				setNews([...news, created]);
				toast({
					title: "News created",
					description: "The news post was created successfully.",
					variant: "default",
				});
			}
			setShowForm(false);
		} catch (err: any) {
			setError(err.message || "Error saving news post");
			toast({
				title: "Save failed",
				description: err.message || "Error saving news post",
				variant: "destructive",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<h1 className="text-2xl md:text-3xl font-bold mb-6">
				Manage News Posts
			</h1>
			<div className="flex justify-between items-center mb-4">
				<p className="text-gray-500">
					View, edit, or delete news posts. Click "Add News Post" to create a new
					one.
				</p>
				<button
					onClick={handleAdd}
					className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition"
				>
					Add News Post
				</button>
			</div>
			{error && <div className="text-red-500 mb-2">{error}</div>}
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-0 border border-gray-100 dark:border-neutral-800 overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-50 dark:bg-neutral-800">
							<th className="p-3 text-left font-semibold">Title</th>
							<th className="p-3 text-left font-semibold">Content</th>
							<th className="p-3 text-left font-semibold">Image</th>
							<th className="p-3 text-left font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={4}
									className="text-center text-gray-400 py-8"
								>
									Loading...
								</td>
							</tr>
						) : news.length === 0 ? (
							<tr>
								<td
									colSpan={4}
									className="text-center text-gray-400 py-8"
								>
									No news posts yet.
								</td>
							</tr>
						) : (
							news.map((item) => (
								<tr
									key={item.id}
									className="border-t border-gray-100 dark:border-neutral-800"
								>
									<td className="p-3">{item.title}</td>
									<td className="p-3 max-w-xs truncate">{item.content}</td>
									<td className="p-3">
										{item.imageUrl ? (
											<img
												src={item.imageUrl}
												alt="news"
												className="h-12 w-20 object-cover rounded"
											/>
										) : (
											<span className="text-gray-400">No image</span>
										)}
									</td>
									<td className="p-3 flex gap-2">
										<button
											onClick={() => handleEdit(item)}
											className="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(item.id)}
											disabled={submitting}
											className="bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/80"
										>
											Delete
										</button>
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
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleFormSubmit(editId ? "update" : "create");
						}}
						className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 w-full max-w-md space-y-4"
					>
						<h2 className="text-xl font-bold mb-4">
							{editId ? "Edit News Post" : "Add News Post"}
						</h2>
						<div>
							<label className="block mb-1 font-medium">Title</label>
							<input
								type="text"
								className="w-full border rounded px-3 py-2"
								value={form.title}
								onChange={(e) =>
									setForm((f) => ({ ...f, title: e.target.value }))
								}
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Content</label>
							<textarea
								className="w-full border rounded px-3 py-2 min-h-[100px]"
								value={form.content}
								onChange={(e) =>
									setForm((f) => ({ ...f, content: e.target.value }))
								}
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-medium">Image</label>
							<div className="flex gap-2 items-center">
								<input
									type="radio"
									id="url"
									name="imageType"
									checked={!useFile}
									onChange={() => {
										setUseFile(false);
										setImageFile(null);
									}}
								/>
								<label htmlFor="url" className="mr-2">
									Use Image URL
								</label>
								<input
									type="radio"
									id="file"
									name="imageType"
									checked={useFile}
									onChange={() => {
										setUseFile(true);
										setForm((f) => ({ ...f, imageUrl: "" }));
									}}
								/>
								<label htmlFor="file">Upload Image</label>
							</div>
							{!useFile ? (
								<input
									type="url"
									className="w-full border rounded px-3 py-2 mt-2"
									value={form.imageUrl}
									onChange={handleImageUrlChange}
									placeholder="https://example.com/image.jpg"
								/>
							) : (
								<input
									type="file"
									accept="image/*"
									className="w-full mt-2"
									onChange={handleFileChange}
								/>
							)}
						</div>
						<div className="flex gap-2 justify-end">
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-muted/80"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={submitting}
								className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
							>
								{editId ? "Update" : "Create"}
							</button>
						</div>
					</form>
				</div>
			)}
			{/* Delete Confirmation Dialog */}
			<Dialog
				open={showDeleteDialog.open}
				onOpenChange={(open) =>
					setShowDeleteDialog((s) => ({ ...s, open }))
				}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Are you sure you want to delete this news post?
						</DialogTitle>
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
			{/* Create/Update Confirmation Dialog */}
			<Dialog
				open={showActionDialog.open}
				onOpenChange={(open) =>
					setShowActionDialog((s) => ({ ...s, open }))
				}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Are you sure you want to{" "}
							{showActionDialog.type === "create"
								? "create"
								: "update"}{" "}
							this news post?
						</DialogTitle>
					</DialogHeader>
					<DialogFooter>
						<button
							className="bg-destructive text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition"
							onClick={confirmAction}
							disabled={submitting}
						>
							Yes
						</button>
						<button
							className="bg-muted text-muted-foreground px-4 py-2 rounded font-semibold hover:bg-muted/80 transition"
							onClick={() => setShowActionDialog({ open: false, type: null })}
							disabled={submitting}
						>
							Cancel
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{uploadProgress !== null && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
					<div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-80 flex flex-col items-center">
						<div className="mb-2 font-semibold">Uploading Image...</div>
						<div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded h-3 overflow-hidden mb-2">
							<div
								className="bg-blue-600 h-3 rounded"
								style={{ width: `${uploadProgress}%`, transition: 'width 0.2s' }}
							/>
						</div>
						<div className="text-xs text-zinc-600 dark:text-zinc-300">{uploadProgress}%</div>
					</div>
				</div>
			)}
		</div>
	);
}
