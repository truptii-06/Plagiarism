""" 
CEI – Cognitive Effort Imbalance Detector 
---------------------------------------- 
Purpose: Detects AI-assisted or copy-pasted code by analyzing unnatural consistency 
between structure, naming, and complexity. This is NOT similarity-based plagiarism. 
This is behavioral analysis. 
""" 
import re 
import json
import math 
import numpy as np 
from radon.complexity import cc_visit 
import sys

# ---------------------------------------- # 
# 1. Extract functions from code # 
# ---------------------------------------- # 
def extract_functions(code: str): 
    """ Extract function bodies from Python code """ 
    pattern = r"def\s+\w+\(.*?\):([\s\S]*?)(?=\ndef|\Z)" 
    return re.findall(pattern, code) 

# ---------------------------------------- # 
# 2. Cyclomatic complexity analysis # 
# ---------------------------------------- # 
def complexity_scores(code: str): 
    """ Returns list of cyclomatic complexity scores """ 
    try:
        blocks = cc_visit(code) 
        return [b.complexity for b in blocks]
    except Exception:
        return []

# ---------------------------------------- # 
# 3. Identifier entropy (naming randomness) # 
# ---------------------------------------- # 
def identifier_entropy(code: str): 
    """ Measures how repetitive / uniform variable naming is """ 
    identifiers = re.findall(r"\b[a-zA-Z_][a-zA-Z0-9_]*\b", code) 
    if not identifiers: 
        return 0.0 
    total = len(identifiers) 
    unique = len(set(identifiers)) 
    # Low entropy → repetitive names → AI pattern 
    return unique / total 

# ---------------------------------------- # 
# 4. Formatting consistency (indent variance) # 
# ---------------------------------------- # 
def indentation_variance(code: str): 
    """ Measures indentation consistency """ 
    indents = [ len(line) - len(line.lstrip()) for line in code.splitlines() if line.strip() ] 
    if not indents: 
        return 0.0 
    return np.var(indents) 

# ---------------------------------------- # 
# 5. CEI Score (CORE ALGORITHM) # 
# ---------------------------------------- # 
def cei_score(code: str): 
    """ Computes the Cognitive Effort Imbalance score """ 
    
    # Check for short files
    lines = [l for l in code.splitlines() if l.strip()]
    if len(lines) < 10:
        return {
            "CEI_score": 0.0, 
            "label": "Insufficient code for AI Analysis", 
            "metrics": { 
                "complexity_variance": 0, 
                "identifier_entropy": 0, 
                "indent_variance": 0
            } 
        }

    complexities = complexity_scores(code) 
    
    # Allow analysis even if no functions detected, use whole code complexity if empty? 
    # For now strictly following provided logic but handling empty case gracefully
    if not complexities: 
         # Fallback to at least some basic metric or return unable to analyze
         pass

    local_complexity_variance = np.var(complexities) if complexities else 0.0
    name_entropy = identifier_entropy(code) 
    indent_var = indentation_variance(code) 
    
    # If code is very simple (complexity variance ~ 0), it's likely human beginner or test code, NOT necessarily AI.
    # AI tends to have UNIFORM complexity but HIGH structural consistency.
    # However, short snippets also have these. 
    
    # Safeguard: If variance is extremely low, cap the score to avoid false positives on simple scripts
    if local_complexity_variance < 0.01 and len(lines) < 20:
         return {
            "CEI_score": 0.5, 
            "label": "Likely Human-written (Simple)", 
            "metrics": { 
                "complexity_variance": round(local_complexity_variance, 3), 
                "identifier_entropy": round(name_entropy, 3), 
                "indent_variance": round(indent_var, 3) 
            } 
        }

    # Global style consistency 
    global_consistency = 1 / (name_entropy + indent_var + 0.01) 

    # CEI formula 
    cei = global_consistency / (local_complexity_variance + 0.01) 
    cei = round(cei, 2) 

    # Interpretation 
    if cei > 2.2: 
        label = "Likely AI-assisted / Copy-Paste Suspicion" 
    elif cei > 1.2: 
        label = "Possibly AI-assisted" 
    else: 
        label = "Likely Human-written" 

    return { 
        "CEI_score": cei, 
        "label": label, 
        "metrics": { 
            "complexity_variance": round(local_complexity_variance, 3), 
            "identifier_entropy": round(name_entropy, 3), 
            "indent_variance": round(indent_var, 3) 
        } 
    } 

# ---------------------------------------- # 
# 6. CLI Runner (for testing) # 
# ---------------------------------------- # 
if __name__ == "__main__": 
    if len(sys.argv) < 2: 
        print(json.dumps({"error": "Usage: python cei_detector.py <code_file.py>"}))
        sys.exit(1) 
    
    file_path = sys.argv[1] 
    try:
        with open(file_path, "r", encoding="utf-8") as f: 
            code_text = f.read() 
        
        result = cei_score(code_text) 
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
