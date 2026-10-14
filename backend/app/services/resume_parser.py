
from io import BytesIO

import pymupdf
from docx import Document


class ResumeParsingError(Exception):
    """Raised when a resume cannot be parsed."""


def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        with pymupdf.open(
            stream=file_bytes,
            filetype="pdf",
        ) as pdf:
            text = "\n".join(page.get_text() for page in pdf)

        return text.strip()

    except Exception as exc:
        raise ResumeParsingError(
            "Unable to read the PDF file."
        ) from exc


def extract_docx_text(file_bytes: bytes) -> str:
    try:
        document = Document(BytesIO(file_bytes))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs).strip()

    except Exception as exc:
        raise ResumeParsingError(
            "Unable to read the DOCX file."
        ) from exc


def extract_resume_text(
    filename: str,
    file_bytes: bytes,
) -> str:
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "pdf":
        text = extract_pdf_text(file_bytes)
    elif extension == "docx":
        text = extract_docx_text(file_bytes)
    else:
        raise ResumeParsingError(
            "Unsupported file type. Upload a PDF or DOCX file."
        )

    if not text:
        raise ResumeParsingError(
            "No text found in the resume. "
            "The file may be empty or scanned."
        )

    return text
