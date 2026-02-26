from multilingual.multilingual_checker import multilingual_plagiarism

text_1 = "This project detects plagiarism in documents."
text_2 = "हा प्रकल्प कागदपत्रांमधील plagiarism शोधतो."

result = multilingual_plagiarism(text_1, text_2)

print(f"Multilingual Plagiarism Percentage: {result:.2f}%")
