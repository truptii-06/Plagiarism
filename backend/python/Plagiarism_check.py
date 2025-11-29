import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import docx
import json
import sys

# --------------------------------------
# 1. Extract text
# --------------------------------------
def extract_text_from_pdf(file_path):
    text = ""
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print(json.dumps({"error": f"PDF read error: {str(e)}"}))
        sys.exit()
    return text

def extract_text_from_docx(file_path):
    try:
        doc = docx.Document(file_path)
        return " ".join([p.text for p in doc.paragraphs])
    except:
        return ""

def extract_text_from_txt(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except:
        return ""

def get_text(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    if file_path.endswith(".txt"):
        return extract_text_from_txt(file_path)
    return ""

# --------------------------------------
# 2. Preprocess
# --------------------------------------
def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# --------------------------------------
# 3. Main plagiarism function
# --------------------------------------
def check_plagiarism(new_doc_path, old_docs_folder):
    new_text = preprocess(get_text(new_doc_path))

    if not new_text.strip():
        return {
            "status": "error",
            "message": "Cannot extract text from uploaded file."
        }

    old_texts = []
    filenames = []

    for file in os.listdir(old_docs_folder):
        if file.endswith((".pdf", ".docx", ".txt")):
            path = os.path.join(old_docs_folder, file)
            text = preprocess(get_text(path))
            if text.strip():
                old_texts.append(text)
                filenames.append(file)

    if not old_texts:
        return {
            "status": "error",
            "message": "No old documents found."
        }

    all_docs = old_texts + [new_text]

    vectorizer = TfidfVectorizer(stop_words='english')
    matrix = vectorizer.fit_transform(all_docs)
    similarity_scores = cosine_similarity(matrix)[-1][:-1]

    # find highest similarity
    max_sim = float(max(similarity_scores))
    max_index = similarity_scores.tolist().index(max_sim)
    most_similar_file = filenames[max_index]

    # Create JSON result
    result = {
        "status": "success",
        "similarity": round(max_sim * 100, 2),
        "most_similar_doc": most_similar_file,
    }

    return result

# --------------------------------------
# 4. MAIN ENTRY FOR NODE BACKEND
# --------------------------------------
if __name__ == "__main__":
    new_doc = sys.argv[1]
    old_docs_folder = os.path.join(os.path.dirname(__file__), "data/old_docs")

    output = check_plagiarism(new_doc, old_docs_folder)
    print(json.dumps(output))    # Node reads this JSON
