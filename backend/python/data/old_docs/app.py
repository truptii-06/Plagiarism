import streamlit as st
from modules.lexical_similarity import lexical_similarity
from modules.structural_similarity import structural_similarity
import difflib
import matplotlib.pyplot as plt
from checker import calculate_similarity
import joblib
import pandas as pd
from modules.stylometric_analysis import extract_features

# App title
st.set_page_config(page_title="Code Analysis Tool", page_icon="💻", layout="wide")
st.title("💻 Code Analysis Tool")

tab1, tab2 = st.tabs(["👥 Plagiarism Checker", "🤖 AI Code Detector"])

# --- TAB 1: Plagiarism Checker ---
with tab1:
    st.header("Code Plagiarism Checker")
    st.markdown("### Upload two code files below to compare similarity")

    # Upload files
    col1, col2 = st.columns(2)
    with col1:
        file1 = st.file_uploader("Upload First File", type=["py", "java"], key="file1")
    with col2:
        file2 = st.file_uploader("Upload Second File", type=["py", "java"], key="file2")

    if st.button("Run Default Test Files"):
        try:
            with open("data/Student1.py", "r") as f1, open("data/Student2.py", "r") as f2:
                code1 = f1.read()
                code2 = f2.read()
            final_score = calculate_similarity(code1, code2)
            st.success(f"Default Test Similarity: {final_score}%")
        except FileNotFoundError:
            st.error("Default test files not found in 'data/' directory.")

    if file1 and file2:
        # Read code from uploaded files
        code1 = file1.read().decode("utf-8")
        code2 = file2.read().decode("utf-8")

        # Save temporary files for processing
        with open("temp1.py", "w", encoding="utf-8") as f:
            f.write(code1)
        with open("temp2.py", "w", encoding="utf-8") as f:
            f.write(code2)

        # Run similarity modules
        lexical_score = lexical_similarity("temp1.py", "temp2.py")
        structural_score = structural_similarity("temp1.py", "temp2.py")

        # Combine scores (you can adjust weights)
        final_score = round((lexical_score * 0.5 + structural_score * 0.5), 2)

        # Show results
        st.subheader("📊 Similarity Results")
        metric_col1, metric_col2, metric_col3 = st.columns(3)
        metric_col1.metric("Lexical Similarity", f"{lexical_score}%")
        metric_col2.metric("Structural Similarity", f"{structural_score}%")
        metric_col3.metric("Final Similarity Score", f"{final_score}%")

        # Highlight plagiarized sections
        st.subheader("🔍 Code Comparison (Highlights)")
        diff = difflib.HtmlDiff().make_table(
            code1.splitlines(),
            code2.splitlines(),
            fromdesc='File 1',
            todesc='File 2',
            context=True, 
            numlines=5
        )
        st.markdown(diff, unsafe_allow_html=True)

# --- TAB 2: AI Code Detector ---
with tab2:
    st.header("🤖 AI-Generated Code Detector")
    st.markdown("Upload a Python or Java file to check if it exhibits patterns common in AI-generated code.")

    ai_file = st.file_uploader("Upload Code File", type=["py", "java"], key="ai_file")

    if ai_file:
        code_ai = ai_file.read().decode("utf-8")
        extension = ai_file.name.split(".")[-1]
        st.subheader(f"Code Preview ({extension})")
        st.code(code_ai, language=extension.lower())

        if st.button("Analyze for AI Patterns"):
            try:
                # Load model(s)
                model_name = "stylometric_model.pkl" # Default to unified model or you'd loop
                model = joblib.load(model_name)
                
                # Extract features
                features = extract_features(code_ai, extension=extension) # Pass extension here
                features_df = pd.DataFrame([features])
                
                # Predict
                prediction = model.predict(features_df)[0]
                proba = model.predict_proba(features_df)[0]
                classes = model.classes_
                
                # Display Results
                st.subheader("Analysis Results")
                
                # Determine index of predicted class
                pred_index = list(classes).index(prediction)
                confidence = proba[pred_index] * 100
                
                if prediction == "AI":
                    st.error(f"⚠️ Detected as **AI-Generated** with {confidence:.2f}% confidence.")
                else:
                    st.success(f"✅ Detected as **Human-Written** with {confidence:.2f}% confidence.")
                
                st.markdown("### Detailed Probabilities")
                prob_df = pd.DataFrame(proba, index=classes, columns=["Probability"])
                st.bar_chart(prob_df)
                
                st.markdown("---")
                st.markdown("**Note:** This detection is based on stylometric features (variable naming, comment density, code structure). It is not 100% accurate.")
                
            except FileNotFoundError:
                st.error("Model file 'stylometric_model.pkl' not found. Please run the training script first.")
            except Exception as e:
                st.error(f"An error occurred: {e}")
