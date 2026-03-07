from langdetect import detect

def detect_language(text):
    if not text or not text.strip(): return "unknown"
    try:
        # Only detect on the first 1000 chars to save time
        return detect(text[:1000])
    except Exception:
        return "unknown"
