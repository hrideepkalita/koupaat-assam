import type { MenuItem } from "@/store/cart";

export const WHATSAPP_NUMBER = "918822821202"; // Owner's WhatsApp (country code, no +)

export const menuItems: MenuItem[] = [
  // Thali
  { id: "veg-thali", name: "Veg Thali", price: 180, category: "Thali" },
  { id: "chicken-thali", name: "Chicken Thali", price: 240, category: "Thali" },
  { id: "mutton-thali", name: "Mutton Thali", price: 320, category: "Thali" },
  { id: "egg-thali", name: "Egg Thali", price: 200, category: "Thali" },
  { id: "fish-thali", name: "Fish Thali", price: 260, category: "Thali" },
  // Breads
  { id: "roti", name: "Roti", price: 20, category: "Breads" },
  { id: "paratha", name: "Paratha", price: 35, category: "Breads" },
  { id: "puri", name: "Puri", price: 25, category: "Breads" },
  // Snacks & Mains
  { id: "noodles", name: "Noodles", price: 120, category: "Snacks" },
  { id: "roll", name: "Roll", price: 90, category: "Snacks" },
  { id: "fried-rice", name: "Fried Rice", price: 140, category: "Snacks" },
  { id: "momo", name: "Momo", price: 100, category: "Snacks" },
  // Beverages
  { id: "coffee", name: "Coffee", price: 50, category: "Beverages" },
  { id: "tea", name: "Tea", price: 30, category: "Beverages" },
];

export const categories = ["All", "Thali", "Breads", "Snacks", "Beverages"];
