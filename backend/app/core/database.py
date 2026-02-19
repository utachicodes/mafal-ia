"""
Async SQLite helpers that read from the same database file as Next.js/Prisma.
DATABASE_URL is expected in the form  file:/absolute/path/to/dev.db
or  file:../prisma/dev.db  (relative paths are resolved from the project root).
"""
import json
import os
import aiosqlite
from app.core.config import settings


def _db_path() -> str:
    """Resolve the SQLite file path from DATABASE_URL."""
    url = settings.DATABASE_URL
    # Strip leading "file:" prefix
    path = url[len("file:"):] if url.startswith("file:") else url
    # Resolve relative paths from the backend directory's parent (project root)
    if not os.path.isabs(path):
        base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        path = os.path.normpath(os.path.join(base, path))
    return path


DB_PATH = _db_path()


async def get_restaurant(restaurant_id: str) -> dict | None:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, name, description, apiKeyHash FROM Restaurant WHERE id = ?",
            (restaurant_id,),
        ) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None


async def get_menu_items(restaurant_id: str) -> list[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, name, description, price, category FROM MenuItem WHERE restaurantId = ?",
            (restaurant_id,),
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]


async def verify_api_key(restaurant_id: str, key_hash: str) -> bool:
    """Return True if key_hash matches the stored apiKeyHash for the restaurant."""
    restaurant = await get_restaurant(restaurant_id)
    if not restaurant:
        return False
    stored = restaurant.get("apiKeyHash")
    return stored is not None and stored == key_hash


async def insert_message_log(
    restaurant_id: str,
    phone_number: str,
    message_id: str,
    direction: str,
    status: str,
    raw: dict,
) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO MessageLog
                (id, restaurantId, phoneNumber, whatsappMessageId, direction, status, raw, createdAt)
            VALUES
                (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, datetime('now'))
            """,
            (
                restaurant_id,
                phone_number,
                message_id,
                direction,
                status,
                json.dumps(raw),
            ),
        )
        await db.commit()
