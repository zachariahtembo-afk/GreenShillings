# Databricks notebook source
# MAGIC %md
# MAGIC # RFP Document Analyzer
# MAGIC Analyzes uploaded RFP/grant documents and extracts key information.

# COMMAND ----------

# Widget parameters passed from the job
dbutils.widgets.text("storage_key", "", "S3 Storage Key")
dbutils.widgets.text("proposal_id", "", "Proposal ID")
dbutils.widgets.text("webhook_url", "", "Webhook URL")
dbutils.widgets.text("webhook_secret", "", "Webhook Secret")
dbutils.widgets.text("bucket_name", "", "S3 Bucket Name")
dbutils.widgets.text("aws_region", "", "AWS Region")

storage_key = dbutils.widgets.get("storage_key")
proposal_id = dbutils.widgets.get("proposal_id")
webhook_url = dbutils.widgets.get("webhook_url")
webhook_secret = dbutils.widgets.get("webhook_secret")
bucket_name = dbutils.widgets.get("bucket_name")
aws_region = dbutils.widgets.get("aws_region")

print(f"Analyzing document: {storage_key}")
print(f"Proposal ID: {proposal_id}")

# COMMAND ----------

import boto3
import json
import io

# Download the document from S3
s3_client = boto3.client("s3", region_name=aws_region)
response = s3_client.get_object(Bucket=bucket_name, Key=storage_key)
document_bytes = response["Body"].read()
content_type = response.get("ContentType", "application/octet-stream")

print(f"Downloaded document: {len(document_bytes)} bytes, type: {content_type}")

# COMMAND ----------

# Extract text from the document
document_text = ""

if content_type == "application/pdf":
    try:
        import fitz  # PyMuPDF
        pdf_doc = fitz.open(stream=document_bytes, filetype="pdf")
        for page in pdf_doc:
            document_text += page.get_text() + "\n"
        pdf_doc.close()
    except ImportError:
        # Fallback: try pdfplumber
        import pdfplumber
        with pdfplumber.open(io.BytesIO(document_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    document_text += text + "\n"
elif content_type in [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
]:
    import docx
    doc = docx.Document(io.BytesIO(document_bytes))
    for para in doc.paragraphs:
        document_text += para.text + "\n"
else:
    # Attempt to read as plain text
    try:
        document_text = document_bytes.decode("utf-8")
    except UnicodeDecodeError:
        document_text = document_bytes.decode("latin-1")

print(f"Extracted {len(document_text)} characters of text")
print(f"Preview: {document_text[:500]}...")

# COMMAND ----------

# Analyze the document to extract key RFP information
import re
from datetime import datetime

def extract_funding_amount(text):
    """Extract funding/grant amounts from text."""
    patterns = [
        r"\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|M|B|k|K))?",
        r"USD\s*[\d,]+(?:\.\d{2})?",
        r"(?:up to|maximum of|total of)\s*\$?[\d,]+",
    ]
    amounts = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        amounts.extend(matches)
    return amounts[:5]  # Return top 5

def extract_deadlines(text):
    """Extract deadline dates from text."""
    patterns = [
        r"(?:deadline|due date|submit by|closing date|applications? close)[:\s]*([A-Za-z]+ \d{1,2},?\s*\d{4})",
        r"(?:deadline|due date|submit by|closing date)[:\s]*(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})",
        r"(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})",
    ]
    deadlines = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        deadlines.extend(matches)
    return list(set(deadlines))[:5]

def extract_focus_areas(text):
    """Extract thematic focus areas."""
    climate_keywords = [
        "climate change", "carbon", "renewable energy", "sustainability",
        "biodiversity", "conservation", "reforestation", "afforestation",
        "clean energy", "emissions", "adaptation", "mitigation",
        "resilience", "environmental", "green finance", "carbon credits",
        "carbon markets", "REDD+", "natural capital", "ecosystem",
    ]
    found = []
    text_lower = text.lower()
    for keyword in climate_keywords:
        if keyword in text_lower:
            found.append(keyword)
    return found

def extract_eligibility(text):
    """Extract eligibility criteria sections."""
    patterns = [
        r"(?:eligib(?:le|ility)|qualif(?:y|ication|ied))[:\s]*([^\n]+(?:\n[^\n]+){0,5})",
        r"(?:who (?:can|may|should) apply)[:\s]*([^\n]+(?:\n[^\n]+){0,5})",
        r"(?:applicant(?:s)? must)[:\s]*([^\n]+(?:\n[^\n]+){0,3})",
    ]
    criteria = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for match in matches:
            cleaned = match.strip()[:500]
            if cleaned:
                criteria.append(cleaned)
    return criteria[:5]

# Run analysis
analysis = {
    "proposalId": proposal_id,
    "fundingAmounts": extract_funding_amount(document_text),
    "deadlines": extract_deadlines(document_text),
    "focusAreas": extract_focus_areas(document_text),
    "eligibilityCriteria": extract_eligibility(document_text),
    "documentLength": len(document_text),
    "wordCount": len(document_text.split()),
    "analyzedAt": datetime.utcnow().isoformat(),
}

print(json.dumps(analysis, indent=2))

# COMMAND ----------

# Send results back to the GreenShillings webhook
import requests

if webhook_url and webhook_secret:
    try:
        response = requests.post(
            webhook_url,
            json=analysis,
            headers={
                "Content-Type": "application/json",
                "x-webhook-secret": webhook_secret,
            },
            timeout=30,
        )
        print(f"Webhook response: {response.status_code}")
        print(f"Webhook body: {response.text}")
    except Exception as e:
        print(f"Webhook call failed: {e}")
        raise
else:
    print("No webhook URL configured, skipping callback")

# COMMAND ----------

# Return the analysis result as the notebook output
dbutils.notebook.exit(json.dumps(analysis))
