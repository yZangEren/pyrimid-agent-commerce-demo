# Inventory Monitoring and Restock Starter

A bounded same-day starter for a small inventory tracking system where staff can update product counts, see low-stock items, and trigger restock actions.

## Scope

This starter assumes the buyer wants a lightweight internal tool, not a full ERP. It keeps the first delivery verifiable with fake inventory data before any private store data is shared.

## Data Model

| Field | Type | Purpose |
| --- | --- | --- |
| `sku` | string | Stable product identifier. |
| `name` | string | Human-readable product name. |
| `category` | string | Grouping for filters and reports. |
| `quantity_on_hand` | number | Current staff-updated count. |
| `minimum_threshold` | number | Quantity below or equal to this value triggers restock. |
| `reorder_quantity` | number | Suggested purchase/order amount. |
| `supplier` | string | Supplier or internal owner. |
| `last_updated_at` | ISO date | Audit field for the latest count update. |
| `updated_by` | string | Staff/admin who updated the count. |

## Restock Rules

1. `ok`: `quantity_on_hand > minimum_threshold`.
2. `low_stock`: `quantity_on_hand <= minimum_threshold`.
3. `critical`: `quantity_on_hand <= floor(minimum_threshold * 0.5)`.
4. Suggested restock quantity defaults to `reorder_quantity`, but can be raised to cover two threshold cycles.

## First Deliverable

- Admin inventory table with inline count updates.
- Low-stock and critical filters.
- Restock suggestion list.
- JSON export for email/webhook notifications.
- README with deployment and staff handoff notes.

## Safe Starting Path

The project can start from a sanitized CSV/JSON file with 10-20 fake products. Once the workflow is approved, the same schema can be wired to SQLite, Supabase, Airtable, Google Sheets, or a small Postgres backend.

## Sample Output

See [`outputs/inventory-restock-sample.json`](../outputs/inventory-restock-sample.json).

## Runnable Demo Script

See [`scripts/inventory-restock-demo.mjs`](../scripts/inventory-restock-demo.mjs). It computes item status, suggested restock actions, and notification payloads from inline sample data.