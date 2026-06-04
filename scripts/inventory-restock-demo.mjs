const inventory = [
  {
    sku: "HW-DRILL-18V",
    name: "18V Cordless Drill",
    category: "Power Tools",
    quantity_on_hand: 4,
    minimum_threshold: 5,
    reorder_quantity: 12,
    supplier: "Northline Tools",
    updated_by: "sample_staff",
  },
  {
    sku: "HW-SCREW-2IN",
    name: "2 inch wood screws - 100 pack",
    category: "Fasteners",
    quantity_on_hand: 2,
    minimum_threshold: 8,
    reorder_quantity: 30,
    supplier: "Bulk Fastener Co",
    updated_by: "sample_staff",
  },
  {
    sku: "HW-GLOVE-L",
    name: "Work gloves large",
    category: "Safety",
    quantity_on_hand: 7,
    minimum_threshold: 7,
    reorder_quantity: 18,
    supplier: "SafeGear",
    updated_by: "sample_staff",
  },
  {
    sku: "HW-TAPE-25FT",
    name: "25 ft tape measure",
    category: "Hand Tools",
    quantity_on_hand: 24,
    minimum_threshold: 6,
    reorder_quantity: 10,
    supplier: "Northline Tools",
    updated_by: "sample_staff",
  },
  {
    sku: "HW-PAINT-WHT",
    name: "Interior white paint gallon",
    category: "Paint",
    quantity_on_hand: 16,
    minimum_threshold: 10,
    reorder_quantity: 20,
    supplier: "Prime Paints",
    updated_by: "sample_staff",
  },
  {
    sku: "HW-LADDER-6FT",
    name: "6 ft step ladder",
    category: "Ladders",
    quantity_on_hand: 9,
    minimum_threshold: 3,
    reorder_quantity: 5,
    supplier: "SafeGear",
    updated_by: "sample_staff",
  },
];

function classify(item) {
  if (item.quantity_on_hand <= Math.floor(item.minimum_threshold * 0.5)) {
    return "critical";
  }
  if (item.quantity_on_hand <= item.minimum_threshold) {
    return "low_stock";
  }
  return "ok";
}

function enrich(item) {
  const status = classify(item);
  const suggested = status === "ok" ? 0 : item.reorder_quantity;
  return {
    ...item,
    status,
    suggested_restock_quantity: suggested,
    last_updated_at: new Date().toISOString(),
  };
}

const items = inventory.map(enrich);
const restockItems = items.filter((item) => item.status !== "ok");
const summary = items.reduce(
  (acc, item) => {
    acc.total_items += 1;
    acc[item.status] += 1;
    if (item.status !== "ok") acc.restock_recommended += 1;
    return acc;
  },
  { total_items: 0, ok: 0, low_stock: 0, critical: 0, restock_recommended: 0 },
);

const notificationPayload = {
  subject: `Inventory restock alert: ${restockItems.length} items need attention`,
  priority: restockItems.some((item) => item.status === "critical") ? "high" : "normal",
  channels: ["email", "dashboard"],
  message: [
    `Critical: ${restockItems
      .filter((item) => item.status === "critical")
      .map((item) => item.name)
      .join(", ") || "none"}.`,
    `Low stock: ${restockItems
      .filter((item) => item.status === "low_stock")
      .map((item) => item.name)
      .join(", ") || "none"}.`,
  ].join(" "),
};

console.log(
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      summary,
      items,
      notification_payload: notificationPayload,
    },
    null,
    2,
  ),
);
