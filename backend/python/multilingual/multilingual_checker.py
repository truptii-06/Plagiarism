from .language_utils import detect_language
from .translation_utils import translate_to_english
from .preprocess import preprocess_text
from .similarity import calculate_similarity

def multilingual_plagiarism(text1, text2):

    lang1 = detect_language(text1)
    lang2 = detect_language(text2)

    if lang1 != 'en':
        text1 = translate_to_english(text1)

    if lang2 != 'en':
        text2 = translate_to_english(text2)

    text1 = preprocess_text(text1)
    text2 = preprocess_text(text2)

    similarity = calculate_similarity(text1, text2)

    return similarity
