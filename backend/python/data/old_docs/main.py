from modules.lexical_similarity import lexical_similarity
from modules.structural_similarity import structural_similarity

file1 = "data/Student1.py"
file2 = "data/Student2.py"

score = lexical_similarity(file1, file2)
print(f"Lexical Similarity: {score}%")

struct_score = structural_similarity(file1, file2)
print(f"Structural Similarity: {struct_score}%")