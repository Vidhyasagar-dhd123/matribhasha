import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout_box(doc, text, title="KEY TAKEAWAY", border_hex="2563EB", bg_hex="EFF6FF"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_hex)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    
    run_title = p.add_run(f"📌 {title}: ")
    run_title.bold = True
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)
    
    run_text = p.add_run(text)
    run_text.font.name = 'Calibri'
    run_text.font.size = Pt(10.5)
    run_text.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

def add_diagram_image(doc, img_path, caption):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(2)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(6.4))
        
        # Caption
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(0)
        p_cap.paragraph_format.space_after = Pt(10)
        r_cap = p_cap.add_run(f"Figure: {caption}")
        r_cap.font.name = 'Calibri'
        r_cap.font.size = Pt(9)
        r_cap.font.italic = True
        r_cap.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

def create_document():
    doc = Document()
    
    # Page setup
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
    primary_color = RGBColor(0x1E, 0x3A, 0x8A) # Deep Blue
    secondary_color = RGBColor(0x02, 0x84, 0xC7) # Sky Blue
    dark_gray = RGBColor(0x33, 0x41, 0x55)
    
    # Header / Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(8)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("🌐 Matribhasha — Interview Master Guide")
    run_title.bold = True
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(22)
    run_title.font.color.rgb = primary_color
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Complete System Architecture, Technical Schemas, Visual Diagrams, and STAR Interview Q&A")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(11.5)
    run_sub.font.italic = True
    run_sub.font.color.rgb = dark_gray

    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(12)
    r_div = p_div.add_run("―" * 58)
    r_div.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
    
    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY & PITCHES
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("1. Executive Summary & Pitch")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    add_callout_box(
        doc,
        '"Matribhasha is an open-source, AI-powered multilingual literature and translation platform designed to preserve and democratize Indian regional literature. Built with Next.js 15, TypeScript, MongoDB, and IndicTrans translation microservices, it enables synchronized multi-language reading, community-driven crowd translation with granular page versioning, and Vivar—a bite-sized cultural story feed."',
        title="30-SECOND ELEVATOR PITCH",
        border_hex="2563EB",
        bg_hex="EFF6FF"
    )
    
    doc.add_paragraph()
    p_prob = doc.add_paragraph()
    p_prob.paragraph_format.space_after = Pt(4)
    r_pb = p_prob.add_run("Problem Statement: ")
    r_pb.bold = True
    p_prob.add_run("India has 22 scheduled languages and hundreds of regional dialects, yet over 80% of digital literature and web content is locked in English or Hindi. Regional literature suffers from low discoverability, high manual translation costs, and an absence of collaborative tooling.")
    
    p_sol = doc.add_paragraph()
    p_sol.paragraph_format.space_after = Pt(8)
    r_sb = p_sol.add_run("The Solution & Core Value: ")
    r_sb.bold = True
    p_sol.add_run("Matribhasha connects readers, AI models, and human contributors into a unified ecosystem with granular page version control, dual-role workflows (reading and translating), real-time progress bookmarks, and cultural quote sharing.")

    # -------------------------------------------------------------
    # SECTION 2: SYSTEM ARCHITECTURE
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("2. High-Level System Architecture")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.space_after = Pt(4)
    p_arch.add_run("The platform follows a modular full-stack architecture leveraging Next.js 15 App Router, combining serverless API endpoints with decoupled domain modules, storage adapters, and an AI translation fallback cascade:")

    # Embed Architecture Image
    add_diagram_image(doc, "public/diagrams/diagram_architecture.png", "Matribhasha Full-Stack System Architecture Diagram")

    # -------------------------------------------------------------
    # SECTION 3: DATABASE SCHEMA & ERD
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("3. Database Schema & Data Models (ERD)")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    p_erd_desc = doc.add_paragraph()
    p_erd_desc.paragraph_format.space_after = Pt(4)
    p_erd_desc.add_run("The database layer utilizes MongoDB with Mongoose ODM. It employs a normalized three-tier model (Book -> Page -> PageVersion) to support granular multi-version crowdsourced translations while maintaining high read throughput:")

    # Embed ERD Image
    add_diagram_image(doc, "public/diagrams/diagram_erd.png", "Entity-Relationship Diagram & MongoDB Schema Architecture")

    # Data Models Table
    p_models = doc.add_paragraph()
    p_models.add_run("Core Schema Reference:").bold = True
    
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    headers = ["Model", "Key Fields & Types", "Indexes / Constraints", "Role in Architecture"]
    widths = [Inches(1.2), Inches(2.2), Inches(1.5), Inches(1.6)]
    
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        hdr_cells[i].width = widths[i]
        set_cell_background(hdr_cells[i], "1E3A8A")
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9.5)
        
    models_data = [
        ("User", "name, username, email, password (hashed), role, languages[], bio, isBlocked", "email (UK), username (UK sparse)", "Auth & community profile management"),
        ("Book", "uuid, title, author, originalLanguage, totalPages, chapters[], pages[], uploadURI, coverURI", "uuid (UK, indexed)", "Core catalog entity & master container"),
        ("Chapter", "bookUUID, title, language, pageStart, pageEnd", "bookUUID (Indexed)", "Logical navigation unit within books"),
        ("Page", "bookId, bookUUID, pageNumber, originalLanguage", "bookUUID + pageNumber", "Physical anchor for granular versioning"),
        ("PageVersion", "pageId (FK), authorId (FK), language, content", "pageId (Indexed)", "Stores independent translation versions per page"),
        ("Review", "bookUUID, userId (FK), rating (1-5), title, comment, likes[]", "bookUUID + userId (UK)", "Book ratings and community reviews"),
        ("ReadingProgress", "userId (FK), bookUUID, pageNumber, language, role", "userId + bookUUID + role (UK)", "Remembers reading & translator page bookmarks"),
        ("VivarPost", "selectedText, caption, bookUUID, bookTitle, pageNumber, language, likes[]", "authorId, createdAt", "Bite-sized social snippet & viral acquisition loop"),
    ]
    
    for row_idx, row_data in enumerate(models_data):
        row = table.add_row()
        bg = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.width = widths[col_idx]
            cell.text = text
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            if len(p.runs) > 0:
                p.runs[0].font.name = 'Calibri'
                p.runs[0].font.size = Pt(9)
                if col_idx == 0:
                    p.runs[0].font.bold = True

    doc.add_paragraph()

    # -------------------------------------------------------------
    # SECTION 4: CORE WORKFLOWS & DATA FLOWS
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("4. Core Workflows & Data Flows")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    doc.add_heading("4.1. Collaborative Translation & Versioning Lifecycle", level=2)
    p_tflow = doc.add_paragraph()
    p_tflow.add_run("The translation workflow connects human contributors with IndicTrans AI inference and resilient local fallbacks:")
    
    # Embed Translation Flow Diagram Image
    add_diagram_image(doc, "public/diagrams/diagram_translation_flow.png", "Sequence Diagram: AI-Assisted Page Translation & Versioning Lifecycle")

    doc.add_heading("4.2. Vivar Social Feed & Reading Engine Loop", level=2)
    p_sflow = doc.add_paragraph()
    p_sflow.add_run("Vivar provides a viral growth loop connecting casual excerpt browsers into active book readers and translators:")

    # Embed Vivar Social Loop Diagram Image
    add_diagram_image(doc, "public/diagrams/diagram_social_loop.png", "Vivar Social Growth Loop & Synchronized Reading Engine")

    # -------------------------------------------------------------
    # SECTION 5: API SPECIFICATIONS
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("5. RESTful API Architecture & Endpoints")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    api_table = doc.add_table(rows=1, cols=5)
    api_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    api_table.autofit = False
    
    api_headers = ["Category", "Method", "Endpoint", "Auth Level", "Description"]
    api_widths = [Inches(1.1), Inches(0.8), Inches(2.2), Inches(1.0), Inches(1.4)]
    
    hdr_cells = api_table.rows[0].cells
    for i, title in enumerate(api_headers):
        hdr_cells[i].text = title
        hdr_cells[i].width = api_widths[i]
        set_cell_background(hdr_cells[i], "1E3A8A")
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=100, right=100)
        p = hdr_cells[i].paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9)
        
    api_data = [
        ("Auth", "POST", "/api/v1/signup", "Public", "Registers user with bcrypt password hash & returns JWT"),
        ("Auth", "POST", "/api/v1/login", "Public", "Authenticates credentials & returns 7-day JWT Bearer token"),
        ("Books", "GET", "/api/v1/books", "Public", "Search, filter by language/genre, and paginate book catalog"),
        ("Books", "POST", "/api/v1/books", "Admin / Auth", "Upload new book metadata, cover art, and document files"),
        ("Books", "GET", "/api/v1/books/:uuid", "Public", "Fetch book metadata, total chapters, pages, and stats"),
        ("Pages", "GET", "/api/v1/pages/:uuid/:pageNo", "Public", "Fetch original page content and available translations"),
        ("Pages", "POST", "/api/v1/pages/:uuid/:pageNo", "Auth", "Submit a new human or AI translation version"),
        ("Translate", "POST", "/api/v1/translate", "Auth", "Real-time AI translation with automatic fallback cascade"),
        ("Vivar", "GET", "/api/v1/vivar", "Public", "Paginated feed of short cultural quotes and snippets"),
        ("Vivar", "POST", "/api/v1/vivar", "Auth", "Post quote excerpt directly from reader highlight"),
        ("Progress", "GET / POST", "/api/v1/users/progress", "Auth", "Sync reader or translator current page bookmark"),
        ("Analytics", "GET", "/api/v1/admin/analytics", "Admin", "Aggregation stats (books, versions, top authors, monthly growth)"),
    ]
    
    for row_idx, row_data in enumerate(api_data):
        row = api_table.add_row()
        bg = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, text in enumerate(row_data):
            cell = row.cells[col_idx]
            cell.width = api_widths[col_idx]
            cell.text = text
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            if len(p.runs) > 0:
                p.runs[0].font.name = 'Calibri'
                p.runs[0].font.size = Pt(8.5)
                if col_idx == 1:
                    p.runs[0].font.bold = True
                    if text == "POST":
                        p.runs[0].font.color.rgb = RGBColor(0x16, 0x65, 0x34)
                    elif text == "GET":
                        p.runs[0].font.color.rgb = RGBColor(0x1E, 0x40, 0xAF)

    doc.add_paragraph()

    # -------------------------------------------------------------
    # SECTION 6: KEY TECHNICAL DECISIONS & TRADE-OFFS
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("6. Key Technical Decisions & Trade-offs")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    decisions = [
        ("1. Granular Page-Level Versioning vs. Monolithic Whole-Book Translation",
         "Translating an entire 300-page book in one go hits LLM context windows, incurs high GPU costs, and overwhelms human volunteers. Splitting books into discrete PageVersion documents lowers the contribution threshold to just 5 minutes per page and allows parallel community translation."),
        ("2. Storage Adapter Pattern (Cloudinary + Local Disk)",
         "Implemented an abstract StorageAdapter interface with LocalStorageAdapter and CloudinaryStorageAdapter. This enables zero-cost, offline local development without external dependencies, while production can effortlessly switch to Cloudinary CDN via environment variables without changing any domain code."),
        ("3. Translation Orchestrator with Graceful Fallback Strategy",
         "Rather than tightly coupling the app to a single AI endpoint, the translation service wraps IndicTrans with an automated fallback to a local rule/dictionary engine. If the AI microservice is down, cold-booting, or rate-limited, the user experience never breaks."),
        ("4. Compound Database Indexes for Concurrency & Zero Data Duplication",
         "Used MongoDB compound unique indexes on Review (bookUUID + userId) and ReadingProgress (userId + bookUUID + role). This enforces data integrity and isolates reader/translator states directly at the database engine level with zero application lock overhead.")
    ]

    for title, desc in decisions:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_t = p.add_run(f"• {title}: ")
        r_t.bold = True
        r_t.font.color.rgb = primary_color
        p.add_run(desc)

    doc.add_paragraph()

    # -------------------------------------------------------------
    # SECTION 7: STAR INTERVIEW Q&A CHEATSHEET
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("7. Interview Q&A Cheatsheet (STAR Format)")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    star_qa = [
        ("Q1: Tell me about Matribhasha and why you built it.",
         "India's regional literary wealth is largely unavailable digitally in native regional languages.",
         "Design an open-source, scalable platform uniting AI translation models with community crowd-polishers.",
         "I built a Next.js 15 App Router platform with MongoDB, structured around granular page versioning, an IndicTrans AI translation microservice, and Vivar (a quote-sharing social loop).",
         "Delivered an accessible reading & translation workspace supporting 10+ Indic languages with sub-second version switching and real-time progress bookmarks."),
        
        ("Q2: How did you design the database to handle multiple community translations per page?",
         "A book can have dozens of translations across languages, and multiple users might submit different translations for the exact same page.",
         "Avoid giant bloated documents while maintaining fast reading queries and full version attribution.",
         "I designed a 3-tier hierarchy: Book (metadata) -> Page (physical book coordinates) -> PageVersion (individual language submissions with authorId).",
         "Enabled concurrent multi-language translation with zero data redundancy and instant version switching."),

        ("Q3: How do you handle failure or latency from external AI translation services?",
         "AI models running on GPU servers can suffer cold starts, network latency, or quota exhaustion.",
         "Ensure contributors never face a broken UI or blocked workflow.",
         "I implemented a Vendor Strategy Pattern in translate.service.ts. If the primary IndicTrans API fails, the orchestrator catches the exception and immediately invokes the local fallback translator.",
         "Achieved continuous availability and a seamless translator experience with automatic error telemetry."),

        ("Q4: How does the Vivar feature drive user growth and engagement?",
         "Casual users often hesitate to commit to reading full books online.",
         "Create a low-friction viral discovery mechanism for regional literature.",
         "I built Vivar—a short-form vertical feed of memorable book quotes. Readers can highlight text in the book reader and publish it in one click. Feed readers can like snippets and click 'Read Full Book' to jump directly to that page.",
         "Created a high-converting acquisition loop converting social feed browsers into active book readers.")
    ]

    for question, sit, task, act, res in star_qa:
        doc.add_heading(question, level=2)
        
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run("• Situation: "); r.bold = True; r.font.color.rgb = secondary_color
        p.add_run(sit)
        
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run("• Task: "); r.bold = True; r.font.color.rgb = secondary_color
        p.add_run(task)
        
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run("• Action: "); r.bold = True; r.font.color.rgb = secondary_color
        p.add_run(act)
        
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        r = p.add_run("• Result: "); r.bold = True; r.font.color.rgb = secondary_color
        p.add_run(res)

    doc.add_paragraph()

    # -------------------------------------------------------------
    # SECTION 8: PRODUCTION READINESS & METRICS
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    h1.paragraph_format.space_before = Pt(16)
    h1.paragraph_format.space_after = Pt(6)
    r1 = h1.add_run("8. Security & Production Engineering Highlights")
    r1.font.name = 'Arial'
    r1.font.size = Pt(15)
    r1.font.color.rgb = primary_color

    sec_points = [
        "Stateless Authentication: Secure JWT signing with 7-day expiration and bcrypt password hashing with salt rounds.",
        "Role-Based Access Control (RBAC): Strict route protections isolating regular users from admin catalog management and platform telemetry.",
        "Connection Pool Caching: Global Mongoose cache singleton preventing connection exhaustion in serverless Next.js edge and lambda environments.",
        "Aggregation Performance: Optimized MongoDB aggregation pipelines for dashboard metrics computing counts, multi-version ratio, and top authors in sub-50ms."
    ]

    for pt in sec_points:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run("✔ ")
        r.bold = True
        r.font.color.rgb = RGBColor(0x16, 0xA3, 0x4A)
        p.add_run(pt)

    output_path = r"c:\Coding Files\files\Projects\matribhasha\Matribhasha_Interview_Architecture_Guide.docx"
    try:
        doc.save(output_path)
        print(f"Successfully saved Word Document with embedded diagram images at: {output_path}")
    except PermissionError:
        fallback_path = r"c:\Coding Files\files\Projects\matribhasha\Matribhasha_Interview_Architecture_Guide_Illustrated.docx"
        doc.save(fallback_path)
        print(f"Original file was open/locked. Successfully saved to fallback file at: {fallback_path}")

if __name__ == "__main__":
    create_document()
