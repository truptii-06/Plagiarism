import os
import re
import json
import sys
import PyPDF2
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --------------------------------------
# 0. Multilingual Support Imports
# --------------------------------------
try:
    from multilingual.language_utils import detect_language
    from multilingual.translation_utils import translate_to_english
    MULTILINGUAL_AVAILABLE = True
except ImportError:
    MULTILINGUAL_AVAILABLE = False

def translate_if_needed(text):
    if not text or not text.strip(): return text
    if not MULTILINGUAL_AVAILABLE: return text
    
    try:
        lang = detect_language(text)
        if lang != 'en' and lang != 'unknown':
            # googletrans allows up to 5000 characters per request, splitting into 4000 char chunks to be safe
            chunks = [text[i:i+4000] for i in range(0, len(text), 4000)]
            
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
                translated_chunks = list(executor.map(translate_to_english, chunks))
                
            return " ".join(translated_chunks)
    except Exception as e:
        sys.stderr.write(f"Translation Error: {str(e)}\n")
    
    return text

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
# 3. AI & Web Pattern Detection (Intrinsic)
# --------------------------------------
def analyze_individual_plagiarism(text):
    if not text or len(text.split()) < 10:
        return 0.0

    # 1. Sentence Length Variance (Human writing is "bursty")
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.split()) > 2]
    
    if len(sentences) < 2:
        return 5.0
    
    lengths = [len(s.split()) for s in sentences]
    avg_len = sum(lengths)/len(lengths)
    variance = sum((l - avg_len)**2 for l in lengths) / len(lengths)
    
    # 2. AI Cliche Phrases
    ai_cliches = [
        "in conclusion", "it is important to note", "a testament to", 
        "not only", "but also", "on the other hand", "furthermore",
        "moreover", "delve into", "comprehensive", "essential",
        "overall", "significant", "vital", "represents", "various"
    ]
    cliche_count = sum(1 for phrase in ai_cliches if phrase in text.lower())
    cliche_score = cliche_count * 3

    # 3. Lexical Diversity
    words = text.lower().split()
    unique_words = len(set(words))
    lexical_diversity = unique_words / len(words) if words else 0
    
    # 4. Starting Baseline
    # Plagiarism is rarely 0 in academic context due to common formatting
    score = 10.0 
    
    # Heuristic adjustments
    if variance < 20: score += 30  # Low variance = AI likelihood
    if lexical_diversity < 0.5: score += 15 # Low diversity
    score += cliche_score
    
    # Limit score
    return min(round(score, 2), 98.0)

def calculate_containment(new_text, ref_text):
    """How much of the reference text is contained in the new text?"""
    new_words = set(new_text.split())
    ref_words = set(ref_text.split())
    if not ref_words: return 0.0
    overlap = ref_words.intersection(new_words)
    return len(overlap) / len(ref_words)

# --------------------------------------
# 4. Main plagiarism function
# --------------------------------------
def check_plagiarism(new_doc_path, old_docs_folder, extra_dataset_path=None):
    new_text_raw = extract_text(new_doc_path)
    new_text_raw = translate_if_needed(new_text_raw)
    new_text = preprocess(new_text_raw)

    if not new_text:
        return {"status": "error", "message": "Cannot extract text from uploaded file or file is empty."}

    # Individual Concept: AI & Web Check
    plag_score = analyze_individual_plagiarism(new_text_raw)

    old_texts = []
    filenames = []
    local_count = 0

    # 1. Load files from local folder
    if os.path.exists(old_docs_folder):
        for file in os.listdir(old_docs_folder):
            if file.endswith((".pdf", ".docx", ".txt")):
                path = os.path.join(old_docs_folder, file)
                if os.path.abspath(path) == os.path.abspath(new_doc_path):
                    continue
                text_raw = extract_text(path)
                text_raw = translate_if_needed(text_raw)
                text = preprocess(text_raw)
                if text:
                    old_texts.append(text)
                    filenames.append(file)
                    local_count += 1

    # 2. Load entries from extra dataset JSON
    if extra_dataset_path and os.path.exists(extra_dataset_path):
        try:
            with open(extra_dataset_path, "r", encoding="utf-8") as f:
                extra_data = json.load(f)
                for item in extra_data:
                    raw_content = item.get("content", "")
                    raw_content = translate_if_needed(raw_content)
                    text = preprocess(raw_content)
                    if text:
                        old_texts.append(text)
                        filenames.append(item.get("sourceInfo", "Reference Item"))
        except Exception as e:
            sys.stderr.write(f"Error reading extra dataset: {str(e)}\n")

    if not old_texts:
        return {
            "status": "success",
            "similarity": 0,
            "plagiarism_score": plag_score,
            "most_similar_doc": "None",
            "grammar_issues": 0
        }

    try:
        # Break new_text into windows
        words = new_text.split()
        window_size = 150 # Smaller windows for better local matching
        step = 50
        windows = [" ".join(words[i:i+window_size]) for i in range(0, max(1, len(words)-window_size+1), step)]
        
        vectorizer = TfidfVectorizer(stop_words='english')
        all_corpus = old_texts + windows
        matrix = vectorizer.fit_transform(all_corpus)
        
        # TF-IDF Cosine Similarity
        sim_matrix = cosine_similarity(matrix[len(old_texts):], matrix[:len(old_texts)])
        max_tfidf_sim = float(sim_matrix.max())
        max_ref_index = int(sim_matrix.max(axis=0).argmax())
        
        # ⭐ IMPROVEMENT: Containment Check for short items
        # If the matched reference doc is short, check how much of it is in ANY window
        # We also check the whole document for containment to be safe
        best_containment = 0.0
        
        # Check against the WHOLE document first (useful for metadata spread across cover page)
        c_whole = calculate_containment(new_text, old_texts[max_ref_index])
        best_containment = c_whole

        for win in windows:
            c = calculate_containment(win, old_texts[max_ref_index])
            if c > best_containment: best_containment = c
            
        # Final similarity is the max of TF-IDF or Containment
        # Containment is better for short metadata strings
        final_similarity = max(max_tfidf_sim, best_containment)

        return {
            "status": "success",
            "similarity": round(final_similarity * 100, 2),
            "plagiarism_score": plag_score,
            "most_similar_doc": "".join(c for c in filenames[max_ref_index] if c.isprintable()),
            "matched_snippet": old_texts[max_ref_index][:200] + "..." if len(old_texts[max_ref_index]) > 200 else old_texts[max_ref_index],
            "match_index": max_ref_index,
            "local_count": local_count,
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
