"""Create unique indexes on user.id, user.email, and layout_data.user_id.

Run manually:
  cd backend && ./venv/bin/python -m app.migrations.002_user_indexes
"""
import asyncio
from pymongo import AsyncMongoClient
from app.config.settings import settings

async def migrate() -> None:
    client = AsyncMongoClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]

    # User indexes
    user_col = db["user"]
    user_indexes = await user_col.index_information()

    if "id_1" not in user_indexes:
        await user_col.create_index("id", unique=True)
        print("user: created unique index on id")
    else:
        print("user: unique id index already present — skipped")

    if "email_1" not in user_indexes:
        await user_col.create_index("email", unique=True)
        print("user: created unique index on email")
    else:
        print("user: unique email index already present — skipped")

    # LayoutData indexes
    layout_data_col = db["layout_data"]
    layout_data_indexes = await layout_data_col.index_information()

    if "user_id_1" not in layout_data_indexes:
        await layout_data_col.create_index("user_id")
        print("layout_data: created index on user_id")
    else:
        print("layout_data: user_id index already present — skipped")

    await client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
