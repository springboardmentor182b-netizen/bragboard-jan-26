import sys
import os
sys.path.append(os.getcwd())
from src.core.database import engine
from sqlalchemy import inspect

def inspect_db():
    ins = inspect(engine)
    for table_name in ins.get_table_names():
        print(f"Table: {table_name}")
        for col in ins.get_columns(table_name):
            print(f"  Column: {col['name']} ({col['type']})")

if __name__ == "__main__":
    inspect_db()
