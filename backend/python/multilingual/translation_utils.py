from deep_translator import GoogleTranslator

def translate_to_english(text):
    return GoogleTranslator(source='auto', target='en').translate(text)
