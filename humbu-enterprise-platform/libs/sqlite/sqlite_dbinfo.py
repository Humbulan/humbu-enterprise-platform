#!/usr/bin/env python3
import sys, struct

if len(sys.argv) != 3 or sys.argv[2] != '.dbinfo':
    print("Usage: python sqlite_dbinfo.py <database_file> .dbinfo", file=sys.stderr)
    sys.exit(1)

try:
    with open(sys.argv[1], 'rb') as f:
        header = f.read(18)
        if len(header) >= 18 and header[:16] == b'SQLite format 3\x00':
            page_size = struct.unpack('>H', header[16:18])[0]
            print(f"database page size: {page_size}")
        else:
            print("Error: Not a valid SQLite database file", file=sys.stderr)
            sys.exit(1)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
