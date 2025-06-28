import fitz  # PyMuPDF

def extract_narrative_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_section(text, section_title):
    # Extract text under a given heading
    import re
    pattern = rf"{section_title}[\s\S]*?(?=\n[A-Z][^\n]+?:|\n\n|\Z)"
    match = re.search(pattern, text, re.IGNORECASE)
    return match.group(0).strip() if match else ""

def parse_clinical_report(pdf_path):
    full_text = extract_narrative_from_pdf(pdf_path)

    # Extract key sections for summary
    sections = {
        "Chief Complaint": extract_section(full_text, "Chief Complaint"),
        "History of Present Illness": extract_section(full_text, "History of Present Illness"),
        "Past Medical History": extract_section(full_text, "Past Medical History"),
        "Assessment": extract_section(full_text, "Assessment and Differential Diagnosis"),
        "Plan": extract_section(full_text, "Plan"),
    }

    return sections