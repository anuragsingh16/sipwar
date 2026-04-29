"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Plus, Trash2 } from "lucide-react";

export default function ProductForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    category: initialData?.category || "arabica",
    tags: initialData?.tags?.join(", ") || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    images: initialData?.images?.map((img: any) => img.url).join("\n") || "",
    variants: initialData?.variants || [],
  });

  const handleChange = (e: any) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { weight: 250, grindType: "whole-bean", sku: `SKU-${Date.now()}`, price: 0, stock: 0, isAvailable: true }
      ]
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariant = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError("");
    
    const formDataPayload = new FormData();
    Array.from(e.target.files).forEach(file => {
      formDataPayload.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataPayload,
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      const currentImages = formData.images ? formData.images.split("\n").filter(Boolean) : [];
      const newImages = [...currentImages, ...data.urls];
      
      setFormData({ ...formData, images: newImages.join("\n") });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        images: formData.images.split("\n").map((url: string) => ({ url: url.trim() })).filter((img: any) => img.url),
      };

      const url = isEditing ? `/api/admin/products/${initialData._id}` : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg px-4 py-2 bg-white">
              <option value="arabica">Arabica</option>
              <option value="robusta">Robusta</option>
              <option value="filter">Filter</option>
              <option value="blend">Blend</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (comma separated)</label>
            <input name="tags" value={formData.tags} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" placeholder="e.g. bestseller, new" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Short Description</label>
          <input required name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Description</label>
          <textarea required name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={4} className="w-full border rounded-lg px-4 py-2" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold text-gray-900">Variants (Prices & Stock)</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
            <Plus className="w-4 h-4" /> Add Variant
          </button>
        </div>
        {formData.variants.length === 0 && <p className="text-gray-500 text-sm italic">No variants added. Please add at least one.</p>}
        {formData.variants.map((v: any, i: number) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Weight (g)</label>
              <input type="number" required value={v.weight} onChange={e => updateVariant(i, "weight", Number(e.target.value))} className="w-full border rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Grind</label>
              <select value={v.grindType} onChange={e => updateVariant(i, "grindType", e.target.value)} className="w-full border rounded-lg px-3 py-1.5 text-sm bg-white">
                <option value="whole-bean">Whole Bean</option>
                <option value="fine">Fine</option>
                <option value="medium">Medium</option>
                <option value="coarse">Coarse</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">SKU</label>
              <input required value={v.sku} onChange={e => updateVariant(i, "sku", e.target.value)} className="w-full border rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Price (₹)</label>
              <input type="number" required value={v.price} onChange={e => updateVariant(i, "price", Number(e.target.value))} className="w-full border rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Stock</label>
              <input type="number" required value={v.stock} onChange={e => updateVariant(i, "stock", Number(e.target.value))} className="w-full border rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <div className="pb-1 text-right md:text-center">
              <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Images & Status</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Images</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3b2314]/10 file:text-[#3b2314] hover:file:bg-[#3b2314]/20"
              />
              {uploading && <span className="text-sm text-gray-500 font-medium">Uploading...</span>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Or enter Image URLs manually (one per line)</label>
            <textarea name="images" value={formData.images} onChange={handleChange} rows={4} placeholder="https://example.com/image1.jpg&#10;/uploads/products/image2.jpg" className="w-full border rounded-lg px-4 py-2 text-sm font-mono whitespace-pre" />
          </div>
          
          {formData.images && (
            <div className="flex gap-4 flex-wrap mt-2">
              {formData.images.split("\n").filter(Boolean).map((url: string, i: number) => (
                <div key={i} className="relative w-20 h-20 rounded-lg border overflow-hidden bg-gray-50">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-[#3b2314]" />
            <span className="text-sm font-medium">Active (Visible in shop)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 accent-[#3b2314]" />
            <span className="text-sm font-medium">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#1a0e0a] hover:bg-[#3b2314] text-white rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
