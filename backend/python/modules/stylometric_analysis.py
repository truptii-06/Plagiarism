import re
import ast
import numpy as np

def extract_features(code, extension="py"):
    """
    Extracts stylometric features from code string (Python or Java).
    """
    features = {}
    
    # Language-specific settings
    if extension == "java":
        # Remove Java style comments
        code_no_comments = re.sub(r'//.*', '', code)
        code_no_comments = re.sub(r'/\*[\s\S]*?\*/', '', code_no_comments)
        comment_count = len(re.findall(r'//', code)) + len(re.findall(r'/\*', code))
        keywords = ["for", "while", "if", "else", "public", "class", "return", "import", "try", "catch", "void", "int", "new"]
        has_docstring = 1 if re.search(r'/\*\*[\s\S]*?\*/', code) else 0
    else:
        # Default to Python
        code_no_comments = re.sub(r'#.*', '', code)
        comment_count = len(re.findall(r'#', code))
        keywords = ["for", "while", "if", "else", "def", "class", "return", "import", "try", "except"]
        has_docstring = 1 if re.search(r'"""[\s\S]*?"""', code) or re.search(r"'''[\s\S]*?'''", code) else 0

    # Token-based features
    lines = code_no_comments.splitlines()
    features["num_lines"] = len(lines)
    features["avg_line_length"] = np.mean([len(line) for line in lines if line.strip()]) if any(line.strip() for line in lines) else 0
    features["comment_density"] = comment_count / (features["num_lines"] + 1)
    features["avg_indent_spaces"] = np.mean([len(line) - len(line.lstrip()) for line in lines if line.strip()]) if any(line.strip() for line in lines) else 0
    
    # Blank lines
    num_blank = len([l for l in code.splitlines() if not l.strip()])
    features["blank_line_density"] = num_blank / (len(code.splitlines()) + 1)

    # Variable naming style
    var_names = re.findall(r'\b[a-zA-Z_]\w*\b', code)
    if var_names:
        features["avg_var_length"] = np.mean([len(v) for v in var_names])
        features["snake_case_count"] = len([v for v in var_names if '_' in v and v.islower()])
        features["camel_case_count"] = len([v for v in var_names if re.match(r'[a-z]+([A-Z][a-z]+)+', v)])
    else:
        features["avg_var_length"] = 0
        features["snake_case_count"] = 0
        features["camel_case_count"] = 0
    
    # Operator spacing consistency (e.g., "x=1" vs "x = 1")
    operators = [r'\+', r'-', r'\*', r'/', r'=', r'==', r'!=', r'<', r'>']
    spaced_ops = 0
    total_ops = 0
    for op in operators:
        total_ops += len(re.findall(op, code))
        spaced_ops += len(re.findall(r'\s' + op + r'\s', code))
    
    features["operator_spacing_ratio"] = spaced_ops / (total_ops + 1)

    # Unified Keyword frequencies
    keywords = ["for", "while", "if", "else", "def", "class", "return", "import", "try", "except", 
                "public", "catch", "void", "int", "new", "private", "static", "extends", "implements"]
                
    for kw in keywords:
        features[f"kw_{kw}"] = len(re.findall(r'\b' + kw + r'\b', code))
    
    # Docstrings and Type hints
    features["has_docstring"] = has_docstring
    if extension == "java":
        features["type_hints"] = len(re.findall(r'\b[A-Z][a-zA-Z0-9_]*\s+[a-z][a-zA-Z0-9_]*', code))
    else:
        features["type_hints"] = len(re.findall(r':\s*[a-zA-Z_]\w*', code)) + len(re.findall(r'->', code))

    # Line length consistency
    active_lines = [len(line) for line in lines if line.strip()]
    features["std_dev_line_length"] = np.std(active_lines) if active_lines else 0

    # AST-level features (Python only)
    if extension == "py":
        try:
            tree = ast.parse(code)
            features["num_nodes"] = len(list(ast.walk(tree)))
            features["num_functions"] = len([n for n in ast.walk(tree) if isinstance(n, ast.FunctionDef)])
            features["num_loops"] = len([n for n in ast.walk(tree) if isinstance(n, (ast.For, ast.While))])
        except:
            features["num_nodes"] = 0
            features["num_functions"] = 0
            features["num_loops"] = 0
    else:
        features["num_nodes"] = 0
        features["num_functions"] = len(re.findall(r'\b(public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\) *(\{?|[^;])', code))
        features["num_loops"] = len(re.findall(r'\b(for|while)\b', code))

    return features
