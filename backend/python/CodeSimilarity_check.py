import os
import sys
import json
import re
from modules.lexical_similarity import lexical_similarity
from modules.structural_similarity import structural_similarity

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python CodeSimilarity_check.py <file1> <file2_or_folder>"}))
        sys.exit(1)

    file1 = sys.argv[1]
    target = sys.argv[2]

    if not os.path.exists(file1):
        print(json.dumps({"error": f"File not found: {file1}"}))
        sys.exit(1)

    # If target is a folder, we compare file1 against all files in target and find the max
    if os.path.isdir(target):
        max_sim = 0
        most_similar_file = "None"
        best_lex = 0
        best_struct = 0
        
        for file in os.listdir(target):
            # Only compare against code files
            if file.endswith(('.py', '.java', '.cpp', '.c', '.js')):
                file2_path = os.path.join(target, file)
                if os.path.abspath(file1) == os.path.abspath(file2_path):
                    continue
                
                try:
                    lex_sim = lexical_similarity(file1, file2_path)
                    struct_sim = structural_similarity(file1, file2_path)
                    
                    combined = (lex_sim + struct_sim) / 2
                    
                    if combined > max_sim:
                        max_sim = combined
                        most_similar_file = file
                        best_lex = lex_sim
                        best_struct = struct_sim
                except Exception as e:
                    sys.stderr.write(f"Error comparing {file1} and {file2_path}: {str(e)}\n")

        print(json.dumps({
            "status": "success",
            "similarity": round(max_sim, 2),
            "lexical_similarity": best_lex,
            "structural_similarity": best_struct,
            "most_similar_doc": most_similar_file
        }))

    else:
        # Direct file-to-file comparison
        if not os.path.exists(target):
            print(json.dumps({"error": f"File not found: {target}"}))
            sys.exit(1)
            
        try:
            lex_sim = lexical_similarity(file1, target)
            struct_sim = structural_similarity(file1, target)
            combined = (lex_sim + struct_sim) / 2
            
            print(json.dumps({
                "status": "success",
                "lexical_similarity": lex_sim,
                "structural_similarity": struct_sim,
                "similarity": round(combined, 2)
            }))
        except Exception as e:
            print(json.dumps({"error": str(err)}))

if __name__ == "__main__":
    main()
