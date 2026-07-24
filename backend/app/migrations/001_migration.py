"""Create unique indexes on layouts.id and layout_data.id / layout_id.

Run manually:
  cd backend && ./venv/bin/python -m migrations.001_unique_id_indexes
"""
import asyncio
from pymongo import AsyncMongoClient
from app.config.settings import settings

async def migrate() -> None:
    client = AsyncMongoClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]

    for collection_name in ("layouts", "layout_data"):
        col = db[collection_name]
        existing = await col.index_information()
        if "id_1" in existing and not existing["id_1"].get("unique"):
            await col.drop_index("id_1")
        if "id_1" not in await col.index_information():
            await col.create_index("id", unique=True)
            print(f"{collection_name}: created unique index on id")
        else:
            print(f"{collection_name}: unique id index already present — skipped")

    layout_data = db["layout_data"]
    if "layout_id_1" not in await layout_data.index_information():
        await layout_data.create_index("layout_id")
        print("layout_data: created index on layout_id")
    else:
        print("layout_data: layout_id index already present — skipped")

    await client.close()

if __name__ == "__main__":
    asyncio.run(migrate())