import ast

def get_structure(code):
    try:
        tree = ast.parse(code)
        structure = []
        for node in ast.walk(tree):
            structure.append(type(node).__name__)
        return structure
    except:
        return []

def structural_similarity(file1, file2):
    code1 = open(file1, 'r').read()
    code2 = open(file2, 'r').read()
    
    struct1 = get_structure(code1)
    struct2 = get_structure(code2)
    
    common = len(set(struct1).intersection(set(struct2)))
    total = len(set(struct1).union(set(struct2)))
    if total == 0:
        return 0
    return round((common / total) * 100, 2)
