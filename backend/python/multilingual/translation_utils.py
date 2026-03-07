import os
import json
import hashlib
from googletrans import Translator

CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "translation_cache.json")

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache):
    # Ensure directory exists
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# Load cache into memory
_translation_cache = load_cache()

def translate_to_english(text):
    if not text.strip(): return text
    
    # Hash the text to create a short, unique key for the cache
    text_hash = hashlib.md5(text.encode('utf-8')).hexdigest()
    
    if text_hash in _translation_cache:
        return _translation_cache[text_hash]
    
    # Not in cache, so we call the API
    try:
        translator = Translator()
        translated = translator.translate(text, dest='en').text
    except Exception as e:
        import sys
        sys.stderr.write(f"Translation API Error: {str(e)}\n")
        return text # fallback to original text if translation fails
    
    # Save to cache
    _translation_cache[text_hash] = translated
    try:
        save_cache(_translation_cache)
    except Exception as e:
        import sys
        sys.stderr.write(f"Cache Save Error: {str(e)}\n")
        
    return translated
