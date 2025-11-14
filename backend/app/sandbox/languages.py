from typing import Callable, Dict

LANG_CONFIG: Dict[str, dict] = {
    "python": {
        "image": "python:3.11-slim",
        "file": lambda name=None: name or "main.py",
        "run": lambda f: ["python", f],
    },
    "javascript": {
        "image": "node:18-slim",
        "file": lambda name=None: name or "index.js",
        "run": lambda f: ["node", f],
    },
    "cpp": {
        "image": "gcc:12",
        "file": lambda name=None: name or "main.cpp",
        "compile": lambda src, exe: ["g++", src, "-O2", "-std=c++17", "-o", exe],
        "run": lambda exe: [f"./{exe}"],
    },
    "go": {
        "image": "golang:1.21",
        "file": lambda name=None: name or "main.go",
        "run": lambda f: ["bash", "-lc", f"go run {f}"],
    },
    "java": {
        "image": "openjdk:17",
        "file": lambda name=None: name or "Main.java",
        "compile": lambda src: ["javac", src],
        "run": lambda class_name: ["java", class_name],
    },
}
