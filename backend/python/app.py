import streamlit as st
import os
import re
import pdfplumber
import docx
import sqlite3
import tempfile
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from report_generator import generate_pdf_report
import language_tool_python
import spacy
from spellchecker import SpellChecker

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load dictionary
spell = SpellChecker()


# --------------------------------------------------
# ⭐ FINAL GRAMMAR CHECK (Research-Paper Friendly)
# --------------------------------------------------
def grammar_check(original_text):

    tool = language_tool_python.LanguageTool('en-US')

    # 🔥 Disable rules causing false positives
    tool.disabled_rules = [
        "UPPERCASE_SENTENCE_START",
        "EN_GB_SIMPLE_REPLACE",
        "MORFOLOGIK_RULE_EN_US",
        "ENGLISH_WORD_REPEAT_BEGINNING_RULE",
        "ENGLISH_WORD_REPEAT_RULE",
        "UNPAIRED_BRACKETS",           # 🔥 Fixes the repeated quote issue
        "APOS_UNUSED",
        "WHITESPACE_RULE"
    ]

    matches = tool.check(original_text)

    # spaCy POS tagging
    doc = nlp(original_text)

    words_original = original_text.split()

    # 1️⃣ Name-like words using uppercase pattern
    name_like_words = set()
    for w in words_original:
        if w.isalpha() and w[0].isupper() and len(w) > 2:
            if spell.correction(w.lower()) != w.lower():
                name_like_words.add(w.lower())

    # 2️⃣ Technical CS/NLP vocabulary whitelist
    TECH_WORDS = {
        "stylometric", "behavioural", "token-based", "multilingual",
        "frameworks-for", "semantics-aware", "ai", "nlp",
        "tf-idf", "cosine", "similarity", "transformers", "dataset",
        "deepfake", "embedding", "semantic", "syntactic", "tokenization",
        "pretrained", "opensource", "lightweight", "benchmark",
        "plagiarism", "code-mixed"
    }

    # 3️⃣ British spellings to skip
    BRITISH_SPELLINGS = {
        "behaviour": "behavior",
        "behavioural": "behavioral",
        "colour": "color",
        "optimise": "optimize",
        "organisation": "organization",
        "realise": "realize",
        "analyse": "analyze",
        "labour": "labor"
    }

    # 4️⃣ Hyphenated technical terms allowed
    def is_hyphenated_term(word):
        return "-" in word and len(word) > 4

    # 5️⃣ Uppercase repetition = proper nouns (names)
    uppercase_counts = {}
    for w in words_original:
        if w and w[0].isupper():
            uppercase_counts[w.lower()] = uppercase_counts.get(w.lower(), 0) + 1

    detailed_errors = []

    for m in matches:
        offset = m.offset
        length = m.errorLength

        wrong_word = original_text[offset: offset + length].strip()
        w = wrong_word.lower()

        import string

# Skip empty or punctuation-only tokens
        if not w or w in {"'", '"', "''", '""', "-", "--"}:
            continue

        if all(ch in string.punctuation for ch in w):
            continue


        # ❌ Skip emails, numbers, URLs
        if "@" in w or "." in w or any(ch.isdigit() for ch in w):
            continue

        # ❌ Skip name-like words
        if w in name_like_words:
            continue

        # ❌ Skip repeated uppercase words
        if uppercase_counts.get(w, 0) >= 2:
            continue

        # ❌ Skip known technical words
        if w in TECH_WORDS:
            continue

        # ❌ Skip British spelling
        if w in BRITISH_SPELLINGS:
            continue

        # ❌ Skip hyphenated research terms
        if is_hyphenated_term(w):
            continue

        detailed_errors.append({
            "word": w,
            "issue": m.ruleIssueType,
            "message": m.message,
            "suggestion": m.replacements[0] if m.replacements else "No suggestion"
        })

    return len(detailed_errors), detailed_errors



# --------------------------------------------------
# TEXT EXTRACTION
# --------------------------------------------------
def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return " ".join([para.text for para in doc.paragraphs])

def extract_text_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def get_text(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    if file_path.endswith(".txt"):
        return extract_text_from_txt(file_path)
    return ""

def preprocess(text):
    return re.sub(r"\s+", " ", text.lower()).strip()



# --------------------------------------------------
# DATABASE
# --------------------------------------------------
DB_PATH = "data/plagiarism_reports.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS plagiarism_reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            file_name TEXT,
            most_similar_doc TEXT,
            similarity_percent REAL,
            grammar_issues INTEGER,
            checked_on TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_report(name, file_name, doc, sim, issues):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO plagiarism_reports 
        (student_name, file_name, most_similar_doc, similarity_percent, grammar_issues, checked_on)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (name, file_name, doc, sim, issues, datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    conn.close()

def fetch_reports():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM plagiarism_reports ORDER BY id DESC")
    return c.fetchall()



# --------------------------------------------------
# STREAMLIT UI
# --------------------------------------------------
st.set_page_config(page_title="Plagiarism Checker", page_icon="🧠", layout="wide")
st.title("Student-to-Student Plagiarism Checker")

init_db()

student_name = st.text_input("Enter Student Name")
uploaded_file = st.file_uploader("Upload Document", type=["pdf", "docx", "txt"])

OLD_DOCS_FOLDER = "data/old_docs"


# --------------------------------------------------
# MAIN EXECUTION
# --------------------------------------------------
if uploaded_file and student_name.strip():

    # Save file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(uploaded_file.name)[1]) as tmp:
        tmp.write(uploaded_file.read())
        new_doc_path = tmp.name

    original_text = get_text(new_doc_path)
    processed_text = preprocess(original_text)

    if not original_text.strip():
        st.error("❌ Could not extract text from document.")
        st.stop()

    # ⭐ GRAMMAR CHECK
    grammar_count, grammar_list = grammar_check(original_text)

    # LOAD OLD DOCS
    old_texts, old_files = [], []
    for file in os.listdir(OLD_DOCS_FOLDER):
     if file.endswith((".pdf", ".docx", ".txt")):
        text = preprocess(get_text(os.path.join(OLD_DOCS_FOLDER, file)))
        
        # NEW: Accept ANY file that has at least SOME extracted text
        if text.strip():   
            old_texts.append(text)
            old_files.append(file)


    if not old_texts:
        st.error("No valid old documents found.")
        st.stop()

    # ⭐ TF-IDF SIMILARITY
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(old_texts + [processed_text])
    sim_scores = cosine_similarity(tfidf_matrix)[-1][:-1]

    results = list(zip(old_files, sim_scores))
    results.sort(key=lambda x: x[1], reverse=True)

    top_doc, top_sim = results[0]
    sim_percent = top_sim * 100


    # --------------------------------------------------
    # UI OUTPUT
    # --------------------------------------------------

    st.subheader("📌 Similarity Results")
    for f, s in results:
        st.write(f"**{f} → {s*100:.2f}%**")

    st.subheader("📝 Grammar Issues")
    st.metric("Total Grammar Mistakes", grammar_count)


    # Save to DB
    insert_report(student_name, uploaded_file.name, top_doc, round(sim_percent, 2), grammar_count)

    # Generate PDF
    report_file = f"report_{student_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    report_path = os.path.join("data", report_file)

    generate_pdf_report(
        student_name,
        uploaded_file.name,
        top_doc,
        sim_percent,
        grammar_count,
        grammar_list,
        report_path
    )

    st.success("📄 Report Generated Successfully!")

    with open(report_path, "rb") as pdf:
        st.download_button("Download Report", pdf.read(), file_name=report_file, mime="application/pdf")


# STORED REPORTS
st.markdown("---")
if st.button("Show Stored Reports"):
    st.dataframe(fetch_reports(), width="stretch")
