const productCatalog = [
  {
    sku: "HW-ANCHOR-50",
    name: "Drywall anchor kit - 50 pack",
    category: "Fasteners",
    aliases: ["wall anchor", "drywall plug", "shelf anchor"],
    use_cases: ["hang shelves", "mount brackets", "drywall mounting"],
    availability: "in_stock",
    related_items: ["stud finder", "level", "2 inch screws"],
  },
  {
    sku: "HW-LEVEL-24",
    name: "24 inch level",
    category: "Hand Tools",
    aliases: ["level", "spirit level"],
    use_cases: ["shelf alignment", "picture hanging"],
    availability: "low_stock",
    related_items: ["drywall anchor kit", "tape measure"],
  },
];

const ticket = {
  subject: "Charged twice for my order",
  body: "My card shows two charges for the same order number. Can someone fix this today?",
  channel: "email",
};

const appointmentRequest = {
  requested_window: "2026-06-06 09:00-11:00",
  service_type: "personal training intro session",
  staff_member: "trainer_a",
};

const availability = {
  trainer_a: ["2026-06-06 13:00", "2026-06-07 10:00", "2026-06-07 15:00"],
};

function productAssistant(question) {
  const normalized = question.toLowerCase();
  const scored = productCatalog.map((product) => {
    const terms = [product.name, product.category, ...product.aliases, ...product.use_cases]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
    const hits = terms.filter((term) => normalized.includes(term)).length;
    const confidence = Math.min(0.98, hits / 4 + (normalized.includes("shelf") ? 0.42 : 0));
    return { product, confidence };
  });
  return scored
    .filter((entry) => entry.confidence >= 0.35)
    .sort((a, b) => b.confidence - a.confidence)
    .map(({ product, confidence }) => ({
      sku: product.sku,
      name: product.name,
      confidence: Number(confidence.toFixed(2)),
      availability: product.availability,
      related_items: product.related_items,
    }));
}

function classifyTicket(input) {
  const text = `${input.subject} ${input.body}`.toLowerCase();
  const category = text.includes("charge") || text.includes("card") || text.includes("refund")
    ? "billing"
    : text.includes("login") || text.includes("password")
      ? "account"
      : text.includes("broken") || text.includes("error")
        ? "technical"
        : "general";
  const priority = text.includes("today") || text.includes("twice") || text.includes("urgent")
    ? "high"
    : "normal";
  return {
    subject: input.subject,
    category,
    priority,
    routing_queue: `${category}_support`,
    reasoning_notes: [
      "Classifier uses explicit customer intent signals first.",
      "Staff can override category and priority before automation sends a reply.",
    ],
  };
}

function evaluateAppointment(request) {
  const slots = availability[request.staff_member] ?? [];
  const isAvailable = slots.some((slot) => request.requested_window.includes(slot.slice(0, 10)) && request.requested_window.includes(slot.slice(11, 13)));
  return {
    requested_window: request.requested_window,
    service_type: request.service_type,
    status: isAvailable ? "available" : "conflict",
    suggested_slots: isAvailable ? [] : slots.slice(0, 2),
    admin_payload: {
      action: isAvailable ? "approve_requested" : "approve_alternative",
      needs_staff_review: !isAvailable,
    },
  };
}

console.log(
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      hardware_assistant: {
        question: "I need something to hang shelves on drywall.",
        matches: productAssistant("I need something to hang shelves on drywall."),
        staff_note: "Confirm shelf weight before final recommendation.",
      },
      ticket_classifier: classifyTicket(ticket),
      appointment_request: evaluateAppointment(appointmentRequest),
    },
    null,
    2,
  ),
);
