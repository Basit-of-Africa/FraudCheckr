"""
Quick start script for EFCC Convictions Explorer.

This script sets up the environment and provides guidance for running the API.
"""

import os
import sys
from pathlib import Path


def main():
    """Print quick start instructions."""
    
    project_root = Path(__file__).parent
    
    print("\n" + "="*70)
    print("  EFCC Convictions Explorer - Quick Start")
    print("="*70 + "\n")
    
    print("📁 Project Location:")
    print(f"   {project_root}\n")
    
    print("📋 Files Created:")
    files = [
        "main.py (FastAPI application)",
        "models.py (Pydantic models)",
        "dataset.py (Loads data/convictions.csv)",
        "scripts/build_dataset.py (Rebuilds the dataset from EFCC source tables)",
        "requirements.txt (Dependencies)",
        "README.md (Full documentation)",
        ".gitignore (Git ignore rules)"
    ]
    for f in files:
        print(f"   ✓ {f}")
    
    print("\n" + "-"*70)
    print("🚀 To get started:\n")
    
    print("1. Create a virtual environment (recommended):")
    print("   python -m venv venv")
    print("")
    
    print("2. Activate the virtual environment:")
    if sys.platform == "win32":
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("")
    
    print("3. Install dependencies:")
    print("   pip install -r requirements.txt")
    print("")
    
    print("4. (Optional) Rebuild the dataset from the EFCC source tables:")
    print("   python scripts/build_dataset.py")
    print("")
    
    print("5. Run the server:")
    print("   python main.py")
    print("")
    print("   OR:")
    print("   uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print("")
    
    print("-"*70)
    print("📡 API Endpoints (once running):\n")
    
    endpoints = [
        ("GET /", "Health check"),
        ("GET /convictions", "Get all records (paginated)"),
        ("GET /search?name=X", "Search by defendant name"),
        ("GET /offense?type=X", "Filter by offense type"),
        ("GET /court?name=X", "Filter by court"),
        ("GET /stats", "Get statistics"),
    ]
    
    for method, desc in endpoints:
        print(f"   {method:30} {desc}")
    
    print("\n📖 API Documentation:")
    print("   • Swagger UI: http://localhost:8000/docs")
    print("   • ReDoc: http://localhost:8000/redoc")
    
    print("\n" + "="*70)
    print("For detailed information, see README.md\n")


if __name__ == "__main__":
    main()
