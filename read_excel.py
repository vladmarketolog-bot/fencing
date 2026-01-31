import openpyxl
import sys

try:
    # Load the workbook
    wb = openpyxl.load_workbook('schedule.xlsx', data_only=True)
    ws = wb.active
    
    # Print all rows
    for row in ws.iter_rows(values_only=True):
        print('\t'.join([str(cell) if cell is not None else '' for cell in row]))
        
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
