import React, { useState } from "react";
import {
  Package, Plus, Search, AlertTriangle, Edit2, Trash2,
  BarChart3, CheckCircle2, XCircle, FlaskConical, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 1, name: "Blood Collection Tubes (EDTA)", category: "Consumables", stock: 800, minStock: 200, unit: "units", supplier: "MedSupply Co.", lastRestocked: "2026-08-10" },
  { id: 2, name: "Latex Gloves (Medium)", category: "PPE", stock: 45, minStock: 100, unit: "boxes", supplier: "SafeGuard Labs", lastRestocked: "2026-08-05" },
  { id: 3, name: "Microscope Slides", category: "Consumables", stock: 1200, minStock: 300, unit: "units", supplier: "BioTech Supplies", lastRestocked: "2026-08-12" },
  { id: 4, name: "Reagent Kit - CBC", category: "Reagents", stock: 12, minStock: 20, unit: "kits", supplier: "DiagnosticPro", lastRestocked: "2026-07-28" },
  { id: 5, name: "Saline Solution 500ml", category: "Solutions", stock: 300, minStock: 100, unit: "bottles", supplier: "PharmaChem", lastRestocked: "2026-08-14" },
  { id: 6, name: "Urine Collection Cups", category: "Consumables", stock: 600, minStock: 200, unit: "units", supplier: "MedSupply Co.", lastRestocked: "2026-08-11" },
  { id: 7, name: "Centrifuge Tubes 15ml", category: "Consumables", stock: 5, minStock: 50, unit: "packs", supplier: "BioTech Supplies", lastRestocked: "2026-07-20" },
  { id: 8, name: "Hand Sanitizer 1L", category: "Hygiene", stock: 60, minStock: 30, unit: "bottles", supplier: "SafeGuard Labs", lastRestocked: "2026-08-08" },
];

const CATEGORIES = ["All", "Consumables", "PPE", "Reagents", "Solutions", "Hygiene"];

const InventoryManager = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<Partial<InventoryItem>>({
    name: "", category: "Consumables", stock: 0, minStock: 0, unit: "units", supplier: ""
  });

  const filtered = items.filter(item => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const lowStock = items.filter(i => i.stock <= i.minStock);
  const outOfStock = items.filter(i => i.stock === 0);

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock === 0) return { label: "Out of Stock", color: "bg-red-50 text-red-700 border-red-100" };
    if (item.stock <= item.minStock) return { label: "Low Stock", color: "bg-amber-50 text-amber-700 border-amber-100" };
    return { label: "In Stock", color: "bg-green-50 text-green-700 border-green-100" };
  };

  const handleSave = () => {
    if (!form.name || !form.supplier) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? { ...editingItem, ...form } as InventoryItem : i));
      toast.success("Item updated");
    } else {
      const newItem: InventoryItem = {
        id: Date.now(), ...form as InventoryItem,
        lastRestocked: new Date().toISOString().split("T")[0]
      };
      setItems(prev => [newItem, ...prev]);
      toast.success("Item added to inventory");
    }
    setShowAddDialog(false);
    setEditingItem(null);
    setForm({ name: "", category: "Consumables", stock: 0, minStock: 0, unit: "units", supplier: "" });
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Item removed from inventory");
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setForm(item);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="text-primary" size={24} />
            Inventory Management
          </h2>
          <p className="text-slate-500 mt-1">Track and manage your lab supplies, reagents, and consumables.</p>
        </div>
        <Button onClick={() => { setShowAddDialog(true); setEditingItem(null); setForm({ name: "", category: "Consumables", stock: 0, minStock: 0, unit: "units", supplier: "" }); }}
          className="gap-2 rounded-xl shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Item
        </Button>
      </div>

      {/* Alert Cards */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStock.length > 0 && (
            <Card className="border-red-100 bg-red-50/50 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <XCircle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="font-bold text-red-700 text-sm">{outOfStock.length} item(s) out of stock</p>
                  <p className="text-xs text-red-600 mt-0.5">{outOfStock.map(i => i.name).join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {lowStock.length > 0 && (
            <Card className="border-amber-100 bg-amber-50/50 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                <div>
                  <p className="font-bold text-amber-700 text-sm">{lowStock.length} item(s) running low</p>
                  <p className="text-xs text-amber-600 mt-0.5">{lowStock.map(i => i.name).join(", ")}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Items", value: items.length, color: "text-slate-700" },
          { label: "Low / Out of Stock", value: lowStock.length, color: "text-amber-600" },
          { label: "Categories", value: [...new Set(items.map(i => i.category))].length, color: "text-primary" },
        ].map(s => (
          <Card key={s.label} className="border-slate-200/60 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{s.label}</p>
              <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input className="pl-9 h-10 rounded-xl border-slate-200" placeholder="Search items or suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === cat ? "bg-primary text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-primary/40"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const status = getStockStatus(item);
          const stockPercent = Math.min(100, Math.round((item.stock / (item.minStock * 2)) * 100));
          return (
            <Card key={item.id} className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category} · {item.supplier}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">{item.stock.toLocaleString()}</span>
                    <span className="text-sm text-slate-400 ml-1">{item.unit}</span>
                  </div>
                  <Badge className={`${status.color} border text-[10px] font-semibold`}>{status.label}</Badge>
                </div>

                <Progress value={stockPercent} className="h-1.5 rounded-full mb-2" />
                <p className="text-[10px] text-slate-400">Min: {item.minStock} {item.unit} · Last restocked: {item.lastRestocked}</p>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400 italic">
            No items match your search.
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Inventory Item"}</DialogTitle>
            <DialogDescription>Fill in the details for the inventory item.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label>Item Name *</Label>
              <Input value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Blood Collection Tubes" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={form.category || "Consumables"} onValueChange={val => setForm(f => ({ ...f, category: val }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Consumables", "PPE", "Reagents", "Solutions", "Hygiene"].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Unit</Label>
                <Select value={form.unit || "units"} onValueChange={val => setForm(f => ({ ...f, unit: val }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["units", "boxes", "packs", "kits", "bottles", "rolls"].map(u => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Current Stock</Label>
                <Input type="number" value={form.stock ?? ""} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label>Min. Stock (Alert)</Label>
                <Input type="number" value={form.minStock ?? ""} onChange={e => setForm(f => ({ ...f, minStock: Number(e.target.value) }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Supplier *</Label>
              <Input value={form.supplier || ""} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier name" className="rounded-xl" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button className="flex-1 rounded-xl shadow-lg shadow-primary/20" onClick={handleSave}>
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
