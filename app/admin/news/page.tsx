"use client";

import React, { useState } from "react";

// Dummy data for demonstration
const initialNews = [
	{ id: 1, title: "First News Post", date: "2025-06-20" },
	{ id: 2, title: "Second News Post", date: "2025-06-19" },
];

export default function AdminNewsPage() {
	const [news, setNews] = useState(initialNews);
	const [showForm, setShowForm] = useState(false);
	const [editId, setEditId] = useState<number | null>(null);
	const [form, setForm] = useState({ title: "", date: "" });

	const handleAdd = () => {
		setForm({ title: "", date: new Date().toISOString().slice(0, 10) });
		setEditId(null);
		setShowForm(true);
	};
	const handleEdit = (item: any) => {
		setForm({ title: item.title, date: item.date });
		setEditId(item.id);
		setShowForm(true);
	};
	const handleDelete = (id: number) => {
		setNews(news.filter((n) => n.id !== id));
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editId) {
			setNews(news.map((n) => (n.id === editId ? { ...n, ...form } : n)));
		} else {
			setNews([...news, { ...form, id: Date.now() }]);
		}
		setShowForm(false);
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
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-0 border border-gray-100 dark:border-neutral-800 overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-gray-50 dark:bg-neutral-800">
							<th className="p-3 text-left font-semibold">Title</th>
							<th className="p-3 text-left font-semibold">Date</th>
							<th className="p-3 text-left font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{news.length === 0 ? (
							<tr>
								<td
									colSpan={3}
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
									<td className="p-3">{item.date}</td>
									<td className="p-3 flex gap-2">
										<button
											onClick={() => handleEdit(item)}
											className="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:bg-secondary/80"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(item.id)}
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
						onSubmit={handleSubmit}
						className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 w-full max-w-md"
					>
						<h2 className="text-xl font-bold mb-4">
							{editId ? "Edit News Post" : "Add News Post"}
						</h2>
						<div className="mb-4">
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
						<div className="mb-4">
							<label className="block mb-1 font-medium">Date</label>
							<input
								type="date"
								className="w-full border rounded px-3 py-2"
								value={form.date}
								onChange={(e) =>
									setForm((f) => ({ ...f, date: e.target.value }))
								}
								required
							/>
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
								className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
							>
								{editId ? "Update" : "Create"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
