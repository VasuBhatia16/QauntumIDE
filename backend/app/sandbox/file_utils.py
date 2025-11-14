import tempfile
import shutil
import os
from typing import Tuple

def make_tempdir(prefix: str = "qide-run-") -> str:
    return tempfile.mkdtemp(prefix=prefix)

def cleanup_dir(path: str):
    try:
        shutil.rmtree(path)
    except Exception:
        pass

def write_file(dirpath: str, filename: str, content: str) -> str:
    os.makedirs(dirpath, exist_ok=True)
    path = os.path.join(dirpath, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path
