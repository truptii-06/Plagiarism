# utils.py
import difflib

def read_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def show_diff(file1_code, file2_code):
    diff = difflib.HtmlDiff().make_file(
        file1_code.splitlines(),
        file2_code.splitlines(),
        fromdesc='File 1',
        todesc='File 2'
    )
    return diff
