from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def read_code(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def lexical_similarity(file1, file2):
    # Read both code files
    code1 = read_code(file1)
    code2 = read_code(file2)
    
    # Remove comments and normalize case
    code1 = '\n'.join([line.split('#')[0].strip() for line in code1.splitlines()])
    code2 = '\n'.join([line.split('#')[0].strip() for line in code2.splitlines()])
    
    # Convert to token counts
    vectorizer = CountVectorizer().fit_transform([code1, code2])
    vectors = vectorizer.toarray()
    
    # Compute cosine similarity
    sim_score = cosine_similarity(vectors)[0][1] * 100
    return round(sim_score, 2)
