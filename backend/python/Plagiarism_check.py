import os
import re
import json
import sys
import PyPDF2
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --------------------------------------
# 1. Extract text
# --------------------------------------
def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    try:
        if ext == ".pdf":
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() or ""
        elif ext == ".docx":
            doc = docx.Document(file_path)
            text = " ".join([p.text for p in doc.paragraphs])
        elif ext == ".txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
    except Exception as e:
        # Log error to stderr, don't pollute stdout
        sys.stderr.write(f"Error reading {file_path}: {str(e)}\n")
    return text

# --------------------------------------
# 2. Preprocess
# --------------------------------------
def preprocess(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# --------------------------------------
# 3. Main plagiarism function
# --------------------------------------
def check_plagiarism(new_doc_path, old_docs_folder, extra_dataset_path=None):
    new_text_raw = extract_text(new_doc_path)
    new_text = preprocess(new_text_raw)

    if not new_text:
        return {"status": "error", "message": "Cannot extract text from uploaded file or file is empty."}

    old_texts = []
    filenames = []

    # 1. Load files from local folder
    if os.path.exists(old_docs_folder):
        for file in os.listdir(old_docs_folder):
            if file.endswith((".pdf", ".docx", ".txt")):
                path = os.path.join(old_docs_folder, file)
                if os.path.abspath(path) == os.path.abspath(new_doc_path):
                    continue
                text_raw = extract_text(path)
                text = preprocess(text_raw)
                if text:
                    old_texts.append(text)
                    filenames.append(file)

    # 2. Load entries from extra dataset JSON if provided
    if extra_dataset_path and os.path.exists(extra_dataset_path):
        try:
            with open(extra_dataset_path, "r", encoding="utf-8") as f:
                extra_data = json.load(f)
                for item in extra_data:
                    text = preprocess(item.get("content", ""))
                    if text:
                        old_texts.append(text)
                        filenames.append(item.get("sourceInfo", "Reference Dataset Item"))
        except Exception as e:
            sys.stderr.write(f"Error reading extra dataset: {str(e)}\n")

    if not old_texts:
        return {
            "status": "success",
            "similarity": 0,
            "most_similar_doc": "None (Database empty)",
            "grammar_issues": 0
        }

    try:
        all_docs = old_texts + [new_text]
        vectorizer = TfidfVectorizer(stop_words='english')
        matrix = vectorizer.fit_transform(all_docs)
        
        similarity_scores = cosine_similarity(matrix[-1], matrix[:-1])[0]
        
        max_sim = float(max(similarity_scores))
        max_index = similarity_scores.tolist().index(max_sim)
        
        return {
            "status": "success",
            "similarity": round(max_sim * 100, 2),
            "most_similar_doc": "".join(c for c in filenames[max_index] if c.isprintable()),
            "grammar_issues": 0 
        }
    except Exception as e:
        return {"status": "error", "message": f"Similarity calculation error: {str(e)}"}

# --------------------------------------
# 4. MAIN ENTRY
# --------------------------------------
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"status": "error", "message": "No file path provided."}))
            sys.exit()

        new_doc = sys.argv[1]
        old_docs_folder = os.path.join(os.path.dirname(__file__), "data", "old_docs")
        
        # Optional third argument: path to JSON file with extra dataset content
        extra_dataset = sys.argv[2] if len(sys.argv) > 2 else None

        output = check_plagiarism(new_doc, old_docs_folder, extra_dataset)
        sys.stdout.write(json.dumps(output) + "\n")
        sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({"status": "error", "message": f"System Error: {str(e)}"}) + "\n")
        sys.stdout.flush()
