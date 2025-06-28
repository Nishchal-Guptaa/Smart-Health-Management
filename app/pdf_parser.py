import pdfplumber
import json
import re

def extract_medical_data_to_json(pdf_path, output_json_path="extracted_data.json"):
    results = {}

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            # Extract all tables from the page
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    # Skip short or malformed rows
                    if not row or len(row) < 2:
                        continue
                    
                    # Attempt to extract test name and value
                    test = row[0].strip() if row[0] else ""
                    value = row[1].strip() if len(row) > 1 and row[1] else ""

                    # Very simple filter: ignore empty or headers
                    if test and value and not re.search(r'(Interval|Ref|Test Name|Unit)', test, re.IGNORECASE):
                        results[test] = value

    with open(output_json_path, "w") as f:
        json.dump(results, f, indent=2)

    return results
