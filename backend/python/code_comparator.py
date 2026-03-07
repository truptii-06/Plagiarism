import sys
import json
import re
import difflib

def normalize_code(code):
    # Remove single line comments (// or #)
    code = re.compile(r'//.*', re.MULTILINE).sub('', code)
    code = re.compile(r'#.*', re.MULTILINE).sub('', code)
    
    # Remove multi-line comments (/* ... */)
    code = re.compile(r'/\*.*?\*/', re.DOTALL).sub('', code)
    
    # Remove python docstrings (""" ... """ or ''' ... ''')
    code = re.compile(r'\"\"\"(.*?)\"\"\"', re.DOTALL).sub('', code)
    code = re.compile(r"\'\'\'(.*?)\'\'\'", re.DOTALL).sub('', code)
    
    # Remove strings
    code = re.compile(r'".*?"').sub('', code)
    code = re.compile(r"'.*?'").sub('', code)
    
    # Remove whitespace
    code = re.sub(r'\s+', '', code)
    
    return code

def compare_files(file1, file2):
    try:
        with open(file1, 'r', encoding='utf-8') as f1, open(file2, 'r', encoding='utf-8') as f2:
            code1 = f1.read()
            code2 = f2.read()
            
        norm1 = normalize_code(code1)
        norm2 = normalize_code(code2)
        
        if not norm1 and not norm2:
            return {"similarity": 100.0, "status": "success"}
        
        if not norm1 or not norm2:
            return {"similarity": 0.0, "status": "success"}
            
        matcher = difflib.SequenceMatcher(None, norm1, norm2)
        similarity = matcher.ratio() * 100
        
        return {
            "similarity": round(similarity, 2),
            "status": "success"
        }
    except Exception as e:
        return {
            "similarity": 0,
            "error": str(e),
            "status": "error"
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing file arguments", "status": "error"}))
        sys.exit(1)
        
    file1 = sys.argv[1]
    file2 = sys.argv[2]
    
    result = compare_files(file1, file2)
    print(json.dumps(result))
