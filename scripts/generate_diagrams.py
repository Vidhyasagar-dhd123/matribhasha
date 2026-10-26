import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("public/diagrams", exist_ok=True)

# -------------------------------------------------------------
# 1. SYSTEM ARCHITECTURE DIAGRAM
# -------------------------------------------------------------
def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    # Background Canvas
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    # Title Banner
    ax.text(50, 96, "Matribhasha — High-Level System Architecture", 
            ha='center', va='center', fontsize=16, fontweight='bold', color='#0F172A', fontfamily='sans-serif')
    ax.text(50, 92.5, "Next.js 15 App Router • MongoDB • IndicTrans AI Microservice • Storage Adapters", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#64748B', fontfamily='sans-serif')

    # 1. Client Layer Box
    rect_client = patches.FancyBboxPatch((5, 73), 90, 15, boxstyle="round,pad=0.8,rounding_size=1.5",
                                         facecolor='#EFF6FF', edgecolor='#3B82F6', linewidth=2)
    ax.add_patch(rect_client)
    ax.text(7, 85, "CLIENT LAYER (Next.js 15 / React 19 / Tailwind CSS v4)", fontsize=11, fontweight='bold', color='#1E40AF')
    
    clients = [
        ("Multilingual Reader UI\n(Dual View & Language Sync)", 20, 77.5),
        ("Translation Workspace\n(AI Assist & Version Polish)", 50, 77.5),
        ("Vivar Short Story Feed\n& Admin Dashboard", 80, 77.5)
    ]
    for text, cx, cy in clients:
        box = patches.FancyBboxPatch((cx-13, cy-3.5), 26, 7, boxstyle="round,pad=0.5,rounding_size=1",
                                     facecolor='#FFFFFF', edgecolor='#93C5FD', linewidth=1.2)
        ax.add_patch(box)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#1E3A8A')

    # Arrow from Client to App Router
    ax.annotate('', xy=(50, 67), xytext=(50, 73),
                arrowprops=dict(arrowstyle="-|>", color='#2563EB', lw=2.5, mutation_scale=15))
    ax.text(51.5, 70, "HTTPS / REST / JWT Bearer", fontsize=8.5, fontweight='bold', color='#1D4ED8')

    # 2. Application Layer Box
    rect_app = patches.FancyBboxPatch((5, 34), 90, 32, boxstyle="round,pad=0.8,rounding_size=1.5",
                                      facecolor='#F0FDF4', edgecolor='#22C55E', linewidth=2)
    ax.add_patch(rect_app)
    ax.text(7, 63, "APPLICATION & DOMAIN SERVICES LAYER (Next.js App Router /api/v1/*)", fontsize=11, fontweight='bold', color='#166534')

    # Middleware badge
    mw_box = patches.FancyBboxPatch((8, 56), 84, 4.5, boxstyle="round,pad=0.4,rounding_size=0.8",
                                   facecolor='#DCFCE7', edgecolor='#86EFAC', linewidth=1)
    ax.add_patch(mw_box)
    ax.text(50, 58.2, "Auth Middleware & JWT Verifier (Stateless Bearer Verification & Role RBAC)",
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#14532D')

    # Micro-Modules
    modules = [
        ("Auth & Users\n(bcrypt / JWT)", 13.5, 45, '#FFFFFF'),
        ("Books & Catalog\n(UUID / Chapters)", 28, 45, '#FFFFFF'),
        ("Page Versioning\n(Crowd Submissions)", 42.5, 45, '#FFFFFF'),
        ("Translation Hub\n(AI Orchestrator)", 57, 45, '#FEF08A'),
        ("Vivar Social Feed\n(Excerpts & Likes)", 71.5, 45, '#FFFFFF'),
        ("Analytics Aggregation\n(MongoDB Pipelines)", 86, 45, '#FFFFFF')
    ]
    for text, cx, cy, bg in modules:
        box = patches.FancyBboxPatch((cx-6.5, cy-6), 13, 12, boxstyle="round,pad=0.4,rounding_size=0.8",
                                     facecolor=bg, edgecolor='#86EFAC', linewidth=1.2)
        ax.add_patch(box)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=7.5, fontweight='bold', color='#0F172A')

    # Bottom Connectors
    # 1. Storage connector
    ax.annotate('', xy=(20, 24), xytext=(28, 34),
                arrowprops=dict(arrowstyle="-|>", color='#059669', lw=2, mutation_scale=12))
    # 2. AI connector
    ax.annotate('', xy=(57, 24), xytext=(57, 34),
                arrowprops=dict(arrowstyle="-|>", color='#EAB308', lw=2, mutation_scale=12))
    # 3. DB connector
    ax.annotate('', xy=(82, 24), xytext=(78, 34),
                arrowprops=dict(arrowstyle="-|>", color='#059669', lw=2, mutation_scale=12))

    # 3. Storage Layer Box
    rect_storage = patches.FancyBboxPatch((5, 4), 28, 19, boxstyle="round,pad=0.6,rounding_size=1.2",
                                          facecolor='#FFF7ED', edgecolor='#F97316', linewidth=1.8)
    ax.add_patch(rect_storage)
    ax.text(19, 20.5, "STORAGE LAYER", ha='center', fontsize=9.5, fontweight='bold', color='#9A3412')
    ax.text(19, 14.5, "Storage Adapter Pattern\n• Local Disk (/uploads)\n• Cloudinary CDN (Prod)", 
            ha='center', va='center', fontsize=8, color='#7C2D12')

    # 4. External AI Services Box
    rect_ai = patches.FancyBboxPatch((36, 4), 30, 19, boxstyle="round,pad=0.6,rounding_size=1.2",
                                     facecolor='#FEFCE8', edgecolor='#EAB308', linewidth=1.8)
    ax.add_patch(rect_ai)
    ax.text(51, 20.5, "AI TRANSLATION PIPELINE", ha='center', fontsize=9.5, fontweight='bold', color='#854D0E')
    ax.text(51, 14.5, "Primary: IndicTrans AI API\n(Python/Django Service)\n↓ [Fallback Cascade]\nSecondary: Local Rule Translator", 
            ha='center', va='center', fontsize=8, color='#713F12')

    # 5. Persistence Layer Box
    rect_db = patches.FancyBboxPatch((69, 4), 26, 19, boxstyle="round,pad=0.6,rounding_size=1.2",
                                     facecolor='#F5F3FF', edgecolor='#8B5CF6', linewidth=1.8)
    ax.add_patch(rect_db)
    ax.text(82, 20.5, "PERSISTENCE (MongoDB)", ha='center', fontsize=9.5, fontweight='bold', color='#5B21B6')
    ax.text(82, 14.5, "Mongoose ODM with Pooling\n• Users & ReadingProgress\n• Books, Chapters & Pages\n• PageVersions & Reviews\n• VivarPosts", 
            ha='center', va='center', fontsize=7.5, color='#4C1D95')

    plt.tight_layout()
    output_path = "public/diagrams/diagram_architecture.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated: {output_path}")

# -------------------------------------------------------------
# 2. DATABASE ENTITY RELATIONSHIP DIAGRAM (ERD)
# -------------------------------------------------------------
def generate_erd_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    ax.text(50, 96, "Matribhasha — Database Entity-Relationship Diagram (ERD)", 
            ha='center', va='center', fontsize=16, fontweight='bold', color='#0F172A')
    ax.text(50, 92.5, "Normalized MongoDB Schema with Compound Indexes & Granular Versioning", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#64748B')

    def draw_entity(x, y, w, h, title, fields, border_col, header_col):
        # Card container
        card = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3,rounding_size=1",
                                      facecolor='#FFFFFF', edgecolor=border_col, linewidth=1.8)
        ax.add_patch(card)
        # Header bar
        header = patches.FancyBboxPatch((x, y+h-4.5), w, 4.5, boxstyle="round,pad=0.2,rounding_size=0.8",
                                       facecolor=header_col, edgecolor=header_col)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - 2.3, title, ha='center', va='center', fontsize=9, fontweight='bold', color='#FFFFFF')
        
        # Fields
        field_text = "\n".join(fields)
        ax.text(x + 1.2, y + h - 6.5, field_text, ha='left', va='top', fontsize=7.5, color='#1E293B', fontfamily='monospace')

    # 1. User
    draw_entity(4, 52, 26, 36, "User", [
        "PK _id: ObjectId",
        "UK email: String",
        "UK username: String",
        "   password: Hash (bcrypt)",
        "   role: 'user'|'admin'",
        "   languages: Array",
        "   isBlocked: Boolean",
        "   bio: String",
        "   timestamps: Date"
    ], '#3B82F6', '#1E40AF')

    # 2. Book
    draw_entity(37, 52, 27, 36, "Book", [
        "PK _id: ObjectId",
        "UK uuid: String (Indexed)",
        "   title, author: String",
        "   originalLanguage: String",
        "   totalPages: Number",
        "   chapters[]: -> Chapter",
        "   pages[]: -> Page",
        "   translatedLangs[]: String",
        "   uploadURI, coverURI: Str"
    ], '#10B981', '#065F46')

    # 3. Chapter
    draw_entity(70, 72, 26, 16, "Chapter", [
        "PK _id: ObjectId",
        "IX bookUUID: String",
        "   title, language: String",
        "   pageStart, pageEnd: Num"
    ], '#059669', '#047857')

    # 4. Page
    draw_entity(70, 48, 26, 18, "Page", [
        "PK _id: ObjectId",
        "FK bookId: -> Book",
        "IX bookUUID: String",
        "   pageNumber: Number",
        "   originalLanguage: String"
    ], '#0D9488', '#115E59')

    # 5. PageVersion
    draw_entity(70, 6, 26, 36, "PageVersion", [
        "PK _id: ObjectId",
        "FK pageId: -> Page (IX)",
        "FK authorId: -> User",
        "   language: String",
        "   content: String (Rich)",
        "   timestamps: Date",
        "",
        "★ Core multi-version",
        "  crowdsource unit"
    ], '#F59E0B', '#B45309')

    # 6. ReadingProgress
    draw_entity(4, 6, 26, 38, "ReadingProgress", [
        "PK _id: ObjectId",
        "FK userId: -> User",
        "   bookUUID: String",
        "   pageNumber: Number",
        "   language: String",
        "   role: 'reader'|'translator'",
        "",
        "UK Compound Index:",
        " {userId, bookUUID, role}"
    ], '#6366F1', '#4338CA')

    # 7. Review & VivarPost
    draw_entity(37, 6, 27, 38, "Review & VivarPost", [
        "[Review]",
        "PK _id, FK userId, bookUUID",
        "rating: 1-5, comment, likes[]",
        "UK {bookUUID, userId}",
        "--------------------------",
        "[VivarPost]",
        "PK _id, FK authorId",
        "selectedText, caption",
        "bookUUID, pageNo, likes[]"
    ], '#EC4899', '#BE185D')

    # Relationships Connectors
    # Book -> Chapter
    ax.annotate('1:N', xy=(70, 80), xytext=(64, 75),
                arrowprops=dict(arrowstyle="->", color='#059669', lw=1.5), fontsize=8, color='#059669', fontweight='bold')
    # Book -> Page
    ax.annotate('1:N', xy=(70, 58), xytext=(64, 60),
                arrowprops=dict(arrowstyle="->", color='#0D9488', lw=1.5), fontsize=8, color='#0D9488', fontweight='bold')
    # Page -> PageVersion
    ax.annotate('1:N (Versions)', xy=(83, 42), xytext=(83, 48),
                arrowprops=dict(arrowstyle="->", color='#F59E0B', lw=1.8), fontsize=8, color='#B45309', fontweight='bold')
    # User -> PageVersion
    ax.annotate('Author Contributes', xy=(70, 20), xytext=(30, 25),
                arrowprops=dict(arrowstyle="->", color='#3B82F6', lw=1.5, ls='--'), fontsize=8, color='#1E40AF')
    # User -> ReadingProgress
    ax.annotate('Tracks Progress', xy=(17, 44), xytext=(17, 52),
                arrowprops=dict(arrowstyle="->", color='#6366F1', lw=1.5), fontsize=8, color='#4338CA')
    # Book -> ReadingProgress
    ax.annotate('', xy=(30, 25), xytext=(37, 52),
                arrowprops=dict(arrowstyle="->", color='#6366F1', lw=1.2, ls=':'))

    plt.tight_layout()
    output_path = "public/diagrams/diagram_erd.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated: {output_path}")

# -------------------------------------------------------------
# 3. COLLABORATIVE TRANSLATION & AI SEQUENCE DIAGRAM
# -------------------------------------------------------------
def generate_translation_flow_diagram():
    fig, ax = plt.subplots(figsize=(12, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    ax.text(50, 96, "Matribhasha — AI-Assisted Translation & Versioning Lifecycle", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
    ax.text(50, 92.5, "Step-by-step sequence from raw page ingestion to human-verified version publish", 
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color='#64748B')

    actors = [
        ("Contributor\n(Translator)", 10, '#3B82F6'),
        ("Frontend UI\n(/workspace)", 30, '#10B981'),
        ("API Router\n(/api/v1/translate)", 50, '#6366F1'),
        ("IndicTrans AI\n(Microservice)", 70, '#F59E0B'),
        ("MongoDB\n(PageVersion)", 90, '#EC4899')
    ]

    for name, x, col in actors:
        # Actor header
        box = patches.FancyBboxPatch((x-8, 79), 16, 8, boxstyle="round,pad=0.4,rounding_size=1",
                                     facecolor=col, edgecolor=col)
        ax.add_patch(box)
        ax.text(x, 83, name, ha='center', va='center', fontsize=8, fontweight='bold', color='#FFFFFF')
        # Lifeline
        ax.plot([x, x], [8, 79], color='#CBD5E1', linestyle='--', linewidth=1.5)

    def draw_msg(y, x1, x2, text, num, col='#1E293B', is_return=False):
        style = "<|-" if is_return else "-|>"
        ls = ':' if is_return else '-'
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(arrowstyle=style, color=col, lw=1.6, ls=ls, mutation_scale=10))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 1.6, f"{num}. {text}", ha='center', va='bottom', fontsize=8, fontweight='bold', color=col)

    draw_msg(73, 10, 30, "Selects Book & Page (e.g., Page 4: EN -> HI)", "1", '#1E3A8A')
    draw_msg(66, 30, 50, "GET /api/v1/pages/:uuid/:pageNo", "2", '#4338CA')
    draw_msg(59, 50, 90, "Query Page + Existing PageVersions", "3", '#BE185D')
    draw_msg(52, 90, 30, "Returns Page Content & Existing Versions", "4", '#047857', is_return=True)
    draw_msg(45, 10, 30, "Clicks 'Translate with AI'", "5", '#B45309')
    draw_msg(38, 30, 50, "POST /api/v1/translate {text, src, tgt}", "6", '#4338CA')
    draw_msg(31, 50, 70, "IndicTrans API Invocations (with Local fallback)", "7", '#B45309')
    draw_msg(24, 70, 30, "Returns AI Translation Draft to Editor", "8", '#047857', is_return=True)
    draw_msg(17, 10, 30, "Refines text & clicks 'Publish Translation'", "9", '#1E3A8A')
    draw_msg(10, 30, 90, "POST PageVersion.create({pageId, authorId, language, content})", "10", '#BE185D')

    plt.tight_layout()
    output_path = "public/diagrams/diagram_translation_flow.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated: {output_path}")

# -------------------------------------------------------------
# 4. VIVAR SOCIAL LOOP & READING PROGRESS
# -------------------------------------------------------------
def generate_social_loop_diagram():
    fig, ax = plt.subplots(figsize=(12, 6.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    ax.text(50, 95, "Matribhasha — Vivar Viral Social Loop & Reading Engine", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
    ax.text(50, 91, "Converting Casual Social Scrollers into Active Multilingual Readers", 
            ha='center', va='center', fontsize=9.5, fontstyle='italic', color='#64748B')

    steps = [
        ("1. Active Reading (/read/:uuid)", "Reader highlights an inspiring quote\nand clicks 'Share to Vivar'", 16, 68, '#3B82F6', '#EFF6FF'),
        ("2. Vivar Post Ingestion", "VivarPost created with excerpt,\nbookUUID, pageNumber & language", 50, 68, '#6366F1', '#EEF2FF'),
        ("3. Bite-Sized Social Feed", "Users scroll infinite cards in /vivar,\nlike & engage across languages", 84, 68, '#EC4899', '#FDF2F8'),
        ("4. High-Intent Deep Link", "User clicks 'Read Full Book'\non any quote in the Vivar feed", 84, 25, '#F59E0B', '#FEFCE8'),
        ("5. Synchronized Reader Resume", "Reader loads exact page bookmark\nvia ReadingProgress API", 50, 25, '#10B981', '#F0FDF4'),
        ("6. Translator Conversion", "Reader switches to /workspace\nto translate newly discovered pages", 16, 25, '#8B5CF6', '#F5F3FF')
    ]

    for title, desc, cx, cy, border_col, bg_col in steps:
        box = patches.FancyBboxPatch((cx-14, cy-12), 28, 24, boxstyle="round,pad=0.5,rounding_size=1.2",
                                     facecolor=bg_col, edgecolor=border_col, linewidth=2)
        ax.add_patch(box)
        # Header text
        ax.text(cx, cy+7, title, ha='center', va='center', fontsize=9, fontweight='bold', color=border_col)
        # Description text
        ax.text(cx, cy-2, desc, ha='center', va='center', fontsize=8, color='#334155')

    # Flow arrows
    # 1 -> 2
    ax.annotate('', xy=(36, 68), xytext=(30, 68),
                arrowprops=dict(arrowstyle="-|>", color='#3B82F6', lw=2.5, mutation_scale=15))
    # 2 -> 3
    ax.annotate('', xy=(70, 68), xytext=(64, 68),
                arrowprops=dict(arrowstyle="-|>", color='#6366F1', lw=2.5, mutation_scale=15))
    # 3 -> 4 (Down)
    ax.annotate('', xy=(84, 37), xytext=(84, 56),
                arrowprops=dict(arrowstyle="-|>", color='#EC4899', lw=2.5, mutation_scale=15))
    # 4 -> 5 (Left)
    ax.annotate('', xy=(64, 25), xytext=(70, 25),
                arrowprops=dict(arrowstyle="-|>", color='#F59E0B', lw=2.5, mutation_scale=15))
    # 5 -> 6 (Left)
    ax.annotate('', xy=(30, 25), xytext=(36, 25),
                arrowprops=dict(arrowstyle="-|>", color='#10B981', lw=2.5, mutation_scale=15))
    # 6 -> 1 (Up loop)
    ax.annotate('', xy=(16, 56), xytext=(16, 37),
                arrowprops=dict(arrowstyle="-|>", color='#8B5CF6', lw=2.5, mutation_scale=15))

    plt.tight_layout()
    output_path = "public/diagrams/diagram_social_loop.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated: {output_path}")

if __name__ == "__main__":
    generate_architecture_diagram()
    generate_erd_diagram()
    generate_translation_flow_diagram()
    generate_social_loop_diagram()
