# checker.py
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def preprocess_code(code):
    # Remove Java/C++ style comments
    code = re.sub(r'//.*', '', code)
    code = re.sub(r'/\*[\s\S]*?\*/', '', code)
    # Remove Python style comments
    code = re.sub(r'#.*', '', code)
    
    # Remove extra whitespace
    code = re.sub(r'\s+', ' ', code)
    return code.strip()

def calculate_similarity(code1, code2):
    # Preprocess both codes
    code1 = preprocess_code(code1)
    code2 = preprocess_code(code2)

    # Use TF-IDF Vectorizer
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([code1, code2])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return round(similarity * 100, 2)
