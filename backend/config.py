import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load .env from backend directory or project root
base_dir = Path(__file__).resolve().parent
env_paths = [
    base_dir / ".env",
    base_dir / "venv" / ".env",
    base_dir.parent / ".env",
]

for env_path in env_paths:
    if env_path.is_file():
        load_dotenv(dotenv_path=env_path)
        break
else:
    load_dotenv()

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "sefron_house")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Rahul@2008")

# Admin credentials
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "Rahul")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Rahul@2008")

# JWT configuration
SECRET_KEY = os.getenv("SECRET_KEY", "sefron-house-secret-key-super-secure-token-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days
