import { useState, useEffect, useRef } from 'react';
import { User, UserRole, AuthRulesConfig, AuditLogEntry } from './types/auth';
import {
  DEFAULT_USERS,
  DEFAULT_PASSWORDS,
  DEFAULT_AUTH_RULES,
  INITIAL_AUDIT_LOGS,
} from './services/mockData';
import AuthModal from './components/AuthModal';
import StudentBasicsView from './components/StudentBasicsView';
import AdminAcademicView from './components/AdminAcademicView';
import WebsiteAnalyticsModal from './components/WebsiteAnalyticsModal';

// ============================================================
// DATA
// ============================================================

const organisms = [
  {
    id: 'bacteria',
    name: 'Bacteria',
    tagline: 'The Dominant Kingdom',
    emoji: '🦠',
    description:
      'Prokaryotic single-celled organisms comprising the most abundant life on Earth, thriving in every conceivable habitat from ocean floor vents to the stratosphere.',
    details:
      'Bacteria are among the oldest organisms on Earth, with fossil evidence dating to 3.5 billion years ago. They drive all major biogeochemical cycles — carbon, nitrogen, sulfur — and form symbiotic partnerships with virtually all multicellular organisms. The human microbiome contains ~38 trillion bacterial cells, influencing metabolism, immunity, and cognition.',
    size: '1–10 μm',
    domain: 'Bacteria',
    cellType: 'Prokaryotic',
    examples: ['Escherichia coli', 'Lactobacillus acidophilus', 'Mycobacterium tuberculosis', 'Bacillus subtilis'],
    stats: ['~10³⁰ on Earth', '1–10 μm', '~2M species estimated'],
    color: '#14b8a6',
    glowRgb: '20, 184, 166',
    label: 'Prokaryote',
  },
  {
    id: 'viruses',
    name: 'Viruses',
    tagline: 'Genomic Architects',
    emoji: '⬡',
    description:
      'Non-cellular obligate intracellular parasites that hijack host cell machinery to replicate — the smallest known biological entities and the most numerous on Earth.',
    details:
      'Viruses occupy the boundary between living and non-living matter. Unable to replicate independently, they inject their genetic material into host cells and redirect cellular machinery. Their rapid mutation rates drive co-evolution with hosts and represent the primary driver of antibiotic-resistance gene spread via bacteriophage transduction.',
    size: '20–300 nm',
    domain: 'Acellular',
    cellType: 'Non-cellular',
    examples: ['SARS-CoV-2', 'HIV-1', 'Influenza A (H3N2)', 'Bacteriophage T4'],
    stats: ['10³¹ estimated on Earth', '20–300 nm', 'Obligate parasites'],
    color: '#22d3ee',
    glowRgb: '34, 211, 238',
    label: 'Acellular',
  },
  {
    id: 'fungi',
    name: 'Fungi',
    tagline: 'Mycelial Networks',
    emoji: '◎',
    description:
      'Eukaryotic decomposers essential to global nutrient cycling, forest ecosystem connectivity, and the production of life-saving antibiotics.',
    details:
      'Fungi are more closely related to animals than plants. Their mycelial networks connect entire forest ecosystems, enabling trees to share nutrients. The largest known organism on Earth is a honey fungus (Armillaria ostoyae) spanning 9.6 km². Their metabolites gave us penicillin, cyclosporine, lovastatin, and ergotamine — drugs that have saved hundreds of millions of lives.',
    size: '2–100 μm (yeast form)',
    domain: 'Eukarya',
    cellType: 'Eukaryotic',
    examples: ['Saccharomyces cerevisiae', 'Penicillium chrysogenum', 'Aspergillus niger', 'Candida albicans'],
    stats: ['~3.8M species estimated', 'Chitin cell walls', 'Saprophytic nutrition'],
    color: '#a78bfa',
    glowRgb: '167, 139, 250',
    label: 'Eukaryote',
  },
  {
    id: 'archaea',
    name: 'Archaea',
    tagline: 'Ancient Extremophiles',
    emoji: '◈',
    description:
      'A distinct third domain of life thriving in extreme environments — hydrothermal vents, hypersaline lakes, and acidic springs — offering a window into Earth\'s earliest life.',
    details:
      'Archaea were classified as bacteria until 1977, when Carl Woese\'s rRNA sequencing revealed them as an entirely separate domain. Their unique membrane lipids (ether-linked isoprenoids), lack of peptidoglycan, and distinctive RNA polymerases make them biochemically distinct from all other life. Many produce methane as a metabolic byproduct, contributing significantly to global greenhouse gas levels.',
    size: '0.1–15 μm',
    domain: 'Archaea',
    cellType: 'Prokaryotic',
    examples: ['Methanobrevibacter smithii', 'Halobacterium salinarum', 'Sulfolobus acidocaldarius', 'Thermoplasma acidophilum'],
    stats: ['3rd Domain of Life', 'Ether-linked lipids', 'No peptidoglycan'],
    color: '#fbbf24',
    glowRgb: '251, 191, 36',
    label: 'Prokaryote',
  },
  {
    id: 'protozoa',
    name: 'Protozoa',
    tagline: 'Unicellular Predators',
    emoji: '◉',
    description:
      'Single-celled eukaryotic heterotrophs — microscopic predators that engulf bacteria and algae, forming essential links in aquatic and terrestrial food webs.',
    details:
      'Protozoa are among the most complex single-celled organisms ever evolved, with sophisticated organelles for movement, feeding, and defense. Some form elaborate calcium carbonate tests (foraminifera) whose fossil record spans 500 million years. Others — Plasmodium, Trypanosoma, Leishmania — remain among the most devastating pathogens in human history, infecting hundreds of millions annually.',
    size: '10–500 μm',
    domain: 'Eukarya',
    cellType: 'Eukaryotic',
    examples: ['Plasmodium falciparum', 'Paramecium caudatum', 'Amoeba proteus', 'Trypanosoma brucei'],
    stats: ['~50,000+ species', '10–500 μm', 'Complex organelles'],
    color: '#34d399',
    glowRgb: '52, 211, 153',
    label: 'Eukaryote',
  },
  {
    id: 'parasites',
    name: 'Parasites',
    tagline: 'Evolutionary Arms Race',
    emoji: '◑',
    description:
      'Organisms living in or on a host at the host\'s expense, featuring complex multi-host life cycles that have shaped human evolution for millennia.',
    details:
      'Parasites have influenced human civilization more profoundly than any other microbial group — shaping migration patterns, agricultural practices, and immune system evolution. The hygiene hypothesis suggests that the near-elimination of parasites in developed nations correlates with rising rates of autoimmune disease, as immune systems lose their co-evolved targets. Toxoplasma gondii, infecting ~30% of humans globally, demonstrably alters host behavior.',
    size: 'Nanometers to meters',
    domain: 'Various',
    cellType: 'Varied',
    examples: ['Ascaris lumbricoides', 'Taenia solium', 'Leishmania donovani', 'Toxoplasma gondii'],
    stats: ['~300 human parasites', 'Multi-host life cycles', 'nm to meter size range'],
    color: '#f87171',
    glowRgb: '248, 113, 113',
    label: 'Varied',
  },
];

const concepts = [
  {
    id: 'cell-biology',
    label: 'Cell Biology',
    icon: '⬡',
    title: 'Prokaryotic vs. Eukaryotic Architecture',
    blocks: [
      {
        heading: 'Prokaryotic Cells',
        tag: 'Bacteria & Archaea',
        body: 'Prokaryotes lack a membrane-bound nucleus. Their single circular chromosome floats in the cytoplasm in a region called the nucleoid. 70S ribosomes (30S + 50S subunits) are smaller than eukaryotic equivalents — a key antibiotic target. Most bacteria have peptidoglycan cell walls; archaea have unique glycoprotein S-layers. Typical size: 0.1–10 μm.',
      },
      {
        heading: 'Eukaryotic Cells',
        tag: 'Fungi, Protozoa, Algae',
        body: 'Eukaryotes possess a true nucleus enclosed by a double-membrane envelope, housing linear chromosomes. They contain 80S ribosomes (40S + 60S) and a suite of membrane-bound organelles: mitochondria, endoplasmic reticulum, Golgi apparatus, and lysosomes. These compartments enable metabolic specialization. Typical size: 10–100 μm.',
      },
      {
        heading: 'Endosymbiotic Origin',
        tag: 'Evolutionary Insight',
        body: 'Mitochondria and chloroplasts originated as free-living bacteria engulfed by ancestral eukaryotic cells ~1.5–2 billion years ago. Evidence: they have their own circular DNA, 70S ribosomes, reproduce by binary fission, and are susceptible to antibiotics. This merger drove the explosion of eukaryotic complexity and the emergence of multicellular life.',
      },
    ],
  },
  {
    id: 'genetics',
    label: 'Microbial Genetics',
    icon: '◫',
    title: 'DNA, Horizontal Gene Transfer & CRISPR',
    blocks: [
      {
        heading: 'Bacterial Chromosomes & Plasmids',
        tag: 'Genome Organization',
        body: 'Bacteria typically carry one circular chromosome (1–10 Mb) compacted by DNA-binding proteins into a nucleoid. Plasmids are small (1–200 kb) circular DNA molecules carrying accessory genes — antibiotic resistance, toxins, metabolic pathways — that can be transferred between cells and replicate independently of the chromosome.',
      },
      {
        heading: 'Horizontal Gene Transfer',
        tag: 'Evolution Driver',
        body: 'Unlike eukaryotes, bacteria exchange DNA across species boundaries through three mechanisms: Transformation (uptake of naked DNA from the environment), Transduction (bacteriophage-mediated DNA transfer between cells), and Conjugation (direct cell-to-cell transfer via a sex pilus, transferring plasmids or chromosomal DNA). HGT is the primary mechanism driving antibiotic resistance spread.',
      },
      {
        heading: 'CRISPR-Cas9 System',
        tag: 'Nobel Prize 2020',
        body: 'CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) is a natural bacterial adaptive immune system. When bacteria survive phage attack, they incorporate phage DNA sequences as "memory." Future infections trigger Cas nucleases guided by CRISPR RNA to cleave matching sequences. Repurposed by Doudna & Charpentier into the most precise genome editing tool ever created.',
      },
    ],
  },
  {
    id: 'metabolism',
    label: 'Metabolism',
    icon: '⚡',
    title: 'Metabolic Diversity Across Microbial Life',
    blocks: [
      {
        heading: 'Energy Source Classification',
        tag: 'Trophic Strategy',
        body: 'Phototrophs harvest light energy (cyanobacteria produce ~50% of Earth\'s oxygen). Chemolithotrophs oxidize inorganic compounds — H₂S (sulfur bacteria), Fe²⁺ (iron oxidizers), NH₄⁺ (nitrifiers) — driving global element cycles. Chemoorganotrophs oxidize organic molecules. This metabolic breadth allows microbes to colonize every energy gradient on Earth.',
      },
      {
        heading: 'Carbon Fixation Pathways',
        tag: 'CO₂ → Organic Carbon',
        body: 'While plants use only the Calvin cycle, bacteria have evolved at least six distinct CO₂-fixation strategies: Calvin cycle, reverse TCA cycle, Wood-Ljungdahl pathway, 3-hydroxypropionate bicycle, dicarboxylate/4-hydroxybutyrate cycle, and 3-HP/4-HB cycle. Autotrophs fix CO₂; heterotrophs consume organic carbon; mixotrophs do both depending on conditions.',
      },
      {
        heading: 'Oxygen Relationships',
        tag: 'Aerobic vs. Anaerobic',
        body: 'Obligate aerobes require O₂ as a terminal electron acceptor (most fungi). Obligate anaerobes are killed by O₂ — they lack superoxide dismutase (Clostridium, methanogens). Facultative anaerobes switch between aerobic respiration and fermentation based on O₂ availability (E. coli). Methanogenic archaea perform CO₂-reduction to CH₄, a significant greenhouse gas source.',
      },
    ],
  },
  {
    id: 'pathogenesis',
    label: 'Pathogenesis',
    icon: '⊕',
    title: 'Host-Pathogen Interactions & Immunity',
    blocks: [
      {
        heading: 'Virulence Factors',
        tag: 'Molecular Weaponry',
        body: 'Pathogens deploy specialized molecules to colonize and damage hosts: Adhesins (surface proteins enabling specific tissue attachment), Invasins (molecules promoting host cell entry), Exotoxins (secreted proteins directly damaging cells — cholera toxin elevates cAMP; botulinum blocks neurotransmission), and Immune evasion factors like polysaccharide capsules, biofilm matrices, and antigenic variation systems.',
      },
      {
        heading: 'Innate & Adaptive Immunity',
        tag: 'Two-Phase Defense',
        body: 'Innate immunity (minutes-hours): Pattern recognition receptors (TLR4 detects LPS; NOD2 detects muramyl dipeptide) trigger inflammation, phagocytosis by neutrophils and macrophages, and NK cell activation. Adaptive immunity (days-weeks): B cells produce antibodies achieving exquisite specificity; cytotoxic T cells eliminate infected cells via perforin-granzyme. Memory cells enable rapid responses lasting decades.',
      },
      {
        heading: 'Antibiotic Resistance Mechanisms',
        tag: 'WHO Priority Pathogen',
        body: 'Bacteria resist antibiotics through four principal mechanisms: Enzymatic inactivation (β-lactamases hydrolyze the penicillin β-lactam ring); Target modification (altered penicillin-binding proteins in MRSA; methylated 23S rRNA in macrolide resistance); Efflux pumps (AcrAB-TolC expels antibiotics before effective concentration is reached); Reduced permeability (porin loss in Gram-negative outer membranes). AMR may kill 10M people/year by 2050.',
      },
    ],
  },
];

const globalStats = [
  { value: '10³⁰', unit: '', label: 'Bacteria on Earth', sub: 'More than all stars in the observable universe combined' },
  { value: '99', unit: '%', label: 'Microbial Species Uncultured', sub: 'Only 1% of microbial life can be grown in laboratory conditions' },
  { value: '38', unit: 'T', label: 'Microbes per Human Body', sub: 'Roughly equal to the number of human cells we contain' },
  { value: '3.5', unit: 'B yrs', label: 'Age of Microbial Life', sub: 'The oldest confirmed microbial fossils are 3.5 billion years old' },
];

const timelineEvents = [
  { year: '1674', person: 'Antonie van Leeuwenhoek', event: 'First direct observation of bacteria using self-crafted microscopes achieving 270× magnification — the birth of microbiology.', milestone: 'Discovery', color: '#14b8a6' },
  { year: '1796', person: 'Edward Jenner', event: 'Developed the first vaccine against smallpox using cowpox material, founding vaccination science and modern immunology.', milestone: 'Immunology', color: '#22d3ee' },
  { year: '1857', person: 'Louis Pasteur', event: 'Proved fermentation is caused by specific living microorganisms, disproving spontaneous generation and establishing germ theory.', milestone: 'Germ Theory', color: '#14b8a6' },
  { year: '1876', person: 'Robert Koch', event: 'Isolated Bacillus anthracis as the causative agent of anthrax, establishing Koch\'s Postulates — the framework for linking pathogens to disease.', milestone: 'Medical Micro.', color: '#22d3ee' },
  { year: '1928', person: 'Alexander Fleming', event: 'Discovered penicillin from Penicillium notatum mold, launching the antibiotic era and saving an estimated 200 million lives.', milestone: 'Antibiotics', color: '#14b8a6' },
  { year: '1953', person: 'Watson & Crick', event: 'Elucidated the double-helix structure of DNA using Franklin\'s X-ray crystallography data, transforming all of biology.', milestone: 'Molecular Biology', color: '#22d3ee' },
  { year: '1983', person: 'Kary Mullis', event: 'Invented PCR — Polymerase Chain Reaction — enabling amplification of any DNA sequence in hours. Revolutionized forensics, diagnostics, and research.', milestone: 'Biotechnology', color: '#14b8a6' },
  { year: '2020', person: 'Doudna & Charpentier', event: 'Awarded the Nobel Prize in Chemistry for developing CRISPR-Cas9 — the most precise and programmable genome editing system ever created.', milestone: 'CRISPR', color: '#22d3ee' },
];

const techniques = [
  {
    name: 'Transmission Electron Microscopy',
    abbr: 'TEM / SEM',
    icon: '⬡',
    description: 'Visualize ultrastructural details at nanometer resolution by transmitting an electron beam through ultra-thin specimen sections. SEM reveals surface topology; TEM reveals internal cross-sections.',
    specs: [{ label: 'Resolution', value: '0.05 nm' }, { label: 'Magnification', value: 'Up to 1,000,000×' }, { label: 'Sample prep', value: 'Fixed & stained' }],
    applications: 'Viral capsid architecture, bacterial ultrastructure, membrane topology, organelle mapping.',
    color: '#14b8a6',
    glowRgb: '20, 184, 166',
  },
  {
    name: 'Polymerase Chain Reaction',
    abbr: 'PCR / qPCR / ddPCR',
    icon: '◫',
    description: 'Exponential amplification of specific DNA or RNA sequences using thermocycling and DNA polymerase. Quantitative PCR enables real-time quantification with fluorescent probes.',
    specs: [{ label: 'Sensitivity', value: '1 copy/reaction' }, { label: 'Time', value: '1–3 hours' }, { label: 'Specificity', value: 'Primer-defined' }],
    applications: 'Pathogen detection, viral load quantification, gene expression, forensics, GMO testing.',
    color: '#22d3ee',
    glowRgb: '34, 211, 238',
  },
  {
    name: 'Flow Cytometry & Cell Sorting',
    abbr: 'FACS / CyTOF',
    icon: '◉',
    description: 'Laser-based interrogation and sorting of individual cells at up to 50,000 cells/second. Multi-parameter fluorescent and mass spectrometry detection enables deep immune phenotyping.',
    specs: [{ label: 'Speed', value: '50,000 cells/sec' }, { label: 'Parameters', value: 'Up to 50+' }, { label: 'Purity', value: '>99% sorted' }],
    applications: 'Immunophenotyping, cell cycle analysis, apoptosis detection, microbial ecology, rare cell sorting.',
    color: '#a78bfa',
    glowRgb: '167, 139, 250',
  },
  {
    name: 'Next-Generation Sequencing',
    abbr: 'NGS / WGS / Metagenomics',
    icon: '⊕',
    description: 'Massively parallel sequencing of millions of DNA fragments simultaneously. Enables whole-genome sequencing, metagenomics (sequencing entire microbial communities), and transcriptomics.',
    specs: [{ label: 'Throughput', value: '6 Tb per run' }, { label: 'Read accuracy', value: '>99.9%' }, { label: 'Time', value: '24–48 hours' }],
    applications: 'Outbreak surveillance, AMR profiling, microbiome characterization, de novo genome assembly.',
    color: '#fbbf24',
    glowRgb: '251, 191, 36',
  },
];

// ============================================================
// COMPONENTS
// ============================================================

interface NavbarProps {
  currentUser: User | null;
  currentView: 'main' | 'student-basics' | 'admin-academic';
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onSwitchView: (view: 'main' | 'student-basics' | 'admin-academic') => void;
  onOpenAnalytics?: () => void;
}

function Navbar({
  currentUser,
  currentView,
  onOpenAuthModal,
  onSignOut,
  onSwitchView,
  onOpenAnalytics,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const generalLinks = ['Organisms', 'Concepts', 'Timeline', 'Techniques'];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(2, 11, 24, 0.94)' : 'rgba(2, 11, 24, 0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(20, 184, 166, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            if (currentUser?.role === 'student') onSwitchView('student-basics');
            else if (currentUser?.role === 'admin') onSwitchView('admin-academic');
            else onSwitchView('main');
          }}
          className="flex items-center gap-2.5 text-left group"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center relative transition-transform group-hover:scale-105"
            style={{
              background: 'radial-gradient(circle, rgba(20,184,166,0.35), rgba(20,184,166,0.05))',
              border: '1px solid rgba(20, 184, 166, 0.5)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="#14b8a6" opacity="0.9" />
              <circle cx="8" cy="8" r="6.5" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
              <circle cx="8" cy="2" r="1.2" fill="#22d3ee" opacity="0.7" />
              <circle cx="14" cy="11" r="0.8" fill="#22d3ee" opacity="0.7" />
              <circle cx="2" cy="11" r="0.8" fill="#22d3ee" opacity="0.7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-wide text-white leading-none">
              Micro<span style={{ color: '#14b8a6' }}>Sphere</span>
            </span>
            <span className="text-[10px] font-mono text-teal-400/80 tracking-widest uppercase">
              {currentUser?.role === 'admin'
                ? 'Academic Administration'
                : currentUser?.role === 'student'
                ? 'Student Learning'
                : 'Educational Portal'}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-5">
          {currentUser?.role === 'student' && (
            <button
              onClick={() => onSwitchView('student-basics')}
              className={`text-xs font-display font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'student-basics'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-teal-300'
              }`}
            >
              <span>📖</span>
              <span>The Basics (Student)</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onSwitchView('admin-academic')}
              className={`text-xs font-display font-semibold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'admin-academic'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <span>📊</span>
              <span>Academic Information (Admin)</span>
            </button>
          )}

          <button
            onClick={() => onSwitchView('main')}
            className={`text-xs font-display font-medium px-3 py-1.5 rounded-full transition-all ${
              currentView === 'main'
                ? 'text-teal-400 border border-teal-500/30 bg-teal-950/40'
                : 'text-slate-400 hover:text-teal-300'
            }`}
          >
            Full Website
          </button>

          {currentView === 'main' &&
            generalLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs text-slate-400 hover:text-teal-400 transition-colors font-medium tracking-wide"
              >
                {link}
              </a>
            ))}
        </div>

        {/* Right Section: Auth State / Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* User Profile Pill */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background:
                    currentUser.role === 'admin'
                      ? 'rgba(34, 211, 238, 0.12)'
                      : 'rgba(20, 184, 166, 0.12)',
                  border:
                    currentUser.role === 'admin'
                      ? '1px solid rgba(34, 211, 238, 0.35)'
                      : '1px solid rgba(20, 184, 166, 0.35)',
                }}
              >
                <span className="text-sm">{currentUser.avatar || (currentUser.role === 'admin' ? '🛡️' : '🎓')}</span>
                <div className="text-left leading-tight">
                  <div className="text-xs font-display font-semibold text-white truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div
                    className="text-[9px] font-mono uppercase tracking-wider font-semibold"
                    style={{ color: currentUser.role === 'admin' ? '#67e8f9' : '#2dd4bf' }}
                  >
                    {currentUser.role}
                  </div>
                </div>
              </div>

              {/* Owner Analytics Button - Only for Admin */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAnalytics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all shadow-sm group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(99, 102, 241, 0.25))',
                    border: '1px solid rgba(14, 165, 233, 0.6)',
                    color: '#38bdf8',
                  }}
                  title="Website Analytics & Statistical Analysis (Only for you)"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                  <span>📈 Analytics & Stats</span>
                </button>
              )}

              {/* Sign Out */}
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-full text-xs font-mono text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors"
                title="Sign out of your account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="px-5 py-2 text-xs font-semibold rounded-full transition-all duration-200 font-display tracking-wide flex items-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(20,184,166,0.3), rgba(34,211,238,0.2))',
                  border: '1px solid rgba(20, 184, 166, 0.6)',
                  color: '#2dd4bf',
                  boxShadow: '0 0 16px rgba(20, 184, 166, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(20,184,166,0.45), rgba(34,211,238,0.3))';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(20, 184, 166, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(20,184,166,0.3), rgba(34,211,238,0.2))';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(20, 184, 166, 0.2)';
                }}
              >
                <span>🔐</span>
                <span>Sign In / Rules</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-teal-400 transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            {menuOpen ? (
              <path d="M4 4l14 14M4 18L18 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <rect x="3" y="5" width="16" height="1.5" rx="0.75" />
                <rect x="3" y="10.25" width="16" height="1.5" rx="0.75" />
                <rect x="3" y="15.5" width="16" height="1.5" rx="0.75" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu dropdown */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-3 flex flex-col gap-3.5"
          style={{ background: 'rgba(2, 11, 24, 0.98)', borderBottom: '1px solid rgba(20, 184, 166, 0.2)' }}
        >
          {currentUser ? (
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentUser.avatar || '👤'}</span>
                <div>
                  <div className="text-sm font-display font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[10px] font-mono text-teal-400 uppercase">{currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onSignOut();
                  setMenuOpen(false);
                }}
                className="text-xs text-red-400 font-mono px-3 py-1 rounded-lg border border-red-900/50 bg-red-950/30"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuthModal();
                setMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl font-display font-semibold text-xs text-center text-slate-950 bg-teal-400 mb-2"
            >
              Sign In with Name & Password
            </button>
          )}

          {currentUser?.role === 'student' && (
            <button
              onClick={() => {
                onSwitchView('student-basics');
                setMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold flex items-center gap-2 ${
                currentView === 'student-basics' ? 'text-teal-300' : 'text-slate-300'
              }`}
            >
              <span>📖</span>
              <span>The Basics (Student)</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                onSwitchView('admin-academic');
                setMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold flex items-center gap-2 ${
                currentView === 'admin-academic' ? 'text-cyan-300' : 'text-slate-300'
              }`}
            >
              <span>📊</span>
              <span>Academic Information (Admin)</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                onOpenAnalytics?.();
                setMenuOpen(false);
              }}
              className="text-left text-sm font-semibold flex items-center gap-2 text-sky-300"
            >
              <span>📈</span>
              <span>Website Analytics & Stats (Owner)</span>
            </button>
          )}

          <button
            onClick={() => {
              onSwitchView('main');
              setMenuOpen(false);
            }}
            className={`text-left text-sm ${currentView === 'main' ? 'text-teal-400' : 'text-slate-400'}`}
          >
            Full Educational Platform
          </button>

          {currentView === 'main' &&
            generalLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-slate-400 hover:text-teal-400 transition-colors font-medium text-xs pl-2"
                onClick={() => setMenuOpen(false)}
              >
                &bull; {link}
              </a>
            ))}
        </div>
      )}
    </nav>
  );
}

function FloatingCell({ size, x, y, delay, duration, anim, color, filled }: {
  size: number; x: string; y: string; delay: number; duration: number;
  anim: 1 | 2 | 3; color: string; filled?: boolean;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        border: filled ? 'none' : `1px solid ${color}`,
        background: filled ? color : 'transparent',
        animation: `float${anim} ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

function Hero({
  currentUser,
  onOpenAuthModal,
  onSwitchView,
}: {
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onSwitchView: (view: 'main' | 'student-basics' | 'admin-academic') => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-grid">
      {/* Deep radial glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, rgba(34,211,238,0.04) 35%, transparent 65%)',
          }}
        />
      </div>

      {/* Right-side large ring */}
      <FloatingCell size={520} x="85%" y="50%" delay={0} duration={22} anim={1} color="rgba(20,184,166,0.06)" />
      <FloatingCell size={320} x="80%" y="35%" delay={3} duration={16} anim={2} color="rgba(34,211,238,0.08)" />
      <FloatingCell size={160} x="12%" y="25%" delay={1} duration={11} anim={3} color="rgba(20,184,166,0.12)" />
      <FloatingCell size={90} x="70%" y="75%" delay={2} duration={9} anim={1} color="rgba(34,211,238,0.14)" />
      <FloatingCell size={50} x="25%" y="70%" delay={0.5} duration={8} anim={2} color="rgba(20,184,166,0.18)" />
      <FloatingCell size={200} x="5%" y="65%" delay={4} duration={15} anim={3} color="rgba(20,184,166,0.07)" />
      <FloatingCell size={24} x="55%" y="15%" delay={1.5} duration={7} anim={1} color="rgba(34,211,238,0.3)" filled />
      <FloatingCell size={16} x="40%" y="85%" delay={3.5} duration={6} anim={2} color="rgba(20,184,166,0.4)" filled />
      <FloatingCell size={12} x="88%" y="70%" delay={2} duration={9} anim={3} color="rgba(34,211,238,0.5)" filled />
      <FloatingCell size={380} x="90%" y="80%" delay={6} duration={20} anim={2} color="rgba(20,184,166,0.04)" />

      {/* Rotating ring (large, decorative) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 420,
          height: 420,
          left: '78%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          border: '1px dashed rgba(20,184,166,0.15)',
          borderRadius: '50%',
          animation: 'rotate-slow 40s linear infinite',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 260,
          height: 260,
          left: '78%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          border: '1px dashed rgba(34,211,238,0.1)',
          borderRadius: '50%',
          animation: 'rotate-slow-rev 28s linear infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 pt-16" style={{ animation: 'slide-up 0.8s ease-out both' }}>
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono tracking-widest mb-6 uppercase"
          style={{
            border: '1px solid rgba(20, 184, 166, 0.35)',
            background: 'rgba(20, 184, 166, 0.08)',
            color: '#2dd4bf',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#14b8a6', animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          Interactive Microbiology Platform
        </div>

        <h1 className="font-display font-black leading-none mb-6" style={{ fontSize: 'clamp(2.75rem, 7.5vw, 6rem)' }}>
          <span className="block text-white mb-2">Explore the</span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(130deg, #f0f9ff 0%, #14b8a6 40%, #22d3ee 75%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Invisible World
          </span>
        </h1>

        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ color: '#94a3b8' }}
        >
          Journey through Earth's microbial universe — from ancient archaea to genomic parasites.
          Interactive science education crafted for researchers, students, and curious minds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href="#organisms"
            className="px-7 py-3 rounded-full font-semibold font-display text-sm tracking-wide transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: '#020b18',
              boxShadow: '0 0 24px rgba(20,184,166,0.35)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 40px rgba(20,184,166,0.55)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(20,184,166,0.35)'; }}
          >
            Explore Organisms →
          </a>
          <a
            href="#concepts"
            className="px-7 py-3 rounded-full font-medium font-display text-sm tracking-wide transition-all duration-200"
            style={{
              border: '1px solid rgba(20, 184, 166, 0.3)',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(20, 184, 166, 0.6)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#2dd4bf';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(20, 184, 166, 0.3)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
            }}
          >
            Core Concepts
          </a>
        </div>

        {/* Role-Based Gateway Banner */}
        <div
          className="max-w-2xl mx-auto rounded-3xl p-5 md:p-6 text-left mb-8"
          style={{
            background: 'linear-gradient(145deg, rgba(7, 21, 37, 0.95), rgba(4, 13, 26, 0.98))',
            border: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.1)',
          }}
        >
          {currentUser ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentUser.avatar || (currentUser.role === 'admin' ? '🛡️' : '🎓')}</span>
                <div>
                  <div className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
                    Active Session: {currentUser.role}
                  </div>
                  <div className="text-base font-display font-bold text-white">
                    Signed in as {currentUser.name}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentUser.role === 'student'
                      ? 'Access foundational microbiology modules, flashcards & knowledge quiz.'
                      : 'Access student rosters, GPA management, course curriculum & announcements.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  onSwitchView(currentUser.role === 'student' ? 'student-basics' : 'admin-academic')
                }
                className="px-5 py-2.5 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap shadow-md"
                style={{
                  background:
                    currentUser.role === 'student'
                      ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                      : 'linear-gradient(135deg, #22d3ee, #0891b2)',
                  color: '#020b18',
                }}
              >
                {currentUser.role === 'student' ? 'Open The Basics →' : 'Open Academic Info →'}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <span>🔐</span>
                  <span>Role-Based Sign-In Rules</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Name + Password Required</span>
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                Sign in by name and password: when <strong className="text-teal-300 font-semibold">students</strong> sign in appear{' '}
                <strong className="text-teal-300 font-semibold">The Basics</strong> (study guides, interactive flashcards, quiz), and when{' '}
                <strong className="text-cyan-300 font-semibold">admins</strong> sign in show{' '}
                <strong className="text-cyan-300 font-semibold">Academic Information</strong> (student rosters, GPA tracking, courses).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onOpenAuthModal}
                  className="p-3.5 rounded-2xl text-left transition-all group"
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid rgba(20, 184, 166, 0.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.35)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🎓</span>
                    <span className="font-display font-bold text-xs text-teal-300 group-hover:text-white">
                      Students &rarr; The Basics
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Sign in to view fundamental cell modules, flashcards & quiz
                  </span>
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="p-3.5 rounded-2xl text-left transition-all group"
                  style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 211, 238, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(34, 211, 238, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.35)';
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🛡️</span>
                    <span className="font-display font-bold text-xs text-cyan-300 group-hover:text-white">
                      Admins &rarr; Academic Info
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    Sign in to manage student rosters, GPAs, courses & notices
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating stat chips */}
        <div className="flex flex-wrap gap-2.5 justify-center">
          {[
            { label: '6 Microbial Domains', icon: '⬡' },
            { label: '4 Core Concepts', icon: '◫' },
            { label: 'Key Lab Techniques', icon: '🔬' },
            { label: '8 Milestone Events', icon: '⏱' },
          ].map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(7, 21, 37, 0.8)',
                border: '1px solid rgba(20, 184, 166, 0.15)',
                color: '#64748b',
              }}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-[10px] font-mono tracking-widest" style={{ color: '#334155' }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(20,184,166,0.4), transparent)', animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
      </div>
    </section>
  );
}

function OrganismCard({
  org,
  isSelected,
  onClick,
}: {
  org: (typeof organisms)[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl p-6 transition-all duration-300 group"
      style={{
        background: isSelected
          ? `rgba(${org.glowRgb}, 0.1)`
          : 'rgba(7, 21, 37, 0.6)',
        border: isSelected
          ? `1px solid rgba(${org.glowRgb}, 0.5)`
          : '1px solid rgba(20, 184, 166, 0.1)',
        boxShadow: isSelected ? `0 0 40px rgba(${org.glowRgb}, 0.12)` : 'none',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.border = `1px solid rgba(${org.glowRgb}, 0.3)`;
          (e.currentTarget as HTMLButtonElement).style.background = `rgba(${org.glowRgb}, 0.06)`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(20, 184, 166, 0.1)';
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(7, 21, 37, 0.6)';
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className="text-xs font-mono font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
            style={{ color: org.color, background: `rgba(${org.glowRgb}, 0.12)` }}
          >
            {org.label}
          </span>
          <h3 className="font-display font-bold text-xl text-white">{org.name}</h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: org.color }}>
            {org.tagline}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{
            background: `rgba(${org.glowRgb}, 0.12)`,
            border: `1px solid rgba(${org.glowRgb}, 0.25)`,
          }}
        >
          <span style={{ color: org.color, fontSize: '1.4rem' }}>{org.emoji}</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
        {org.description}
      </p>

      {/* Stats row */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {org.stats.map((stat) => (
          <span
            key={stat}
            className="text-xs font-mono px-2 py-1 rounded-lg"
            style={{
              background: 'rgba(2, 11, 24, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#64748b',
            }}
          >
            {stat}
          </span>
        ))}
      </div>

      {/* Expanded content */}
      {isSelected && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: `1px solid rgba(${org.glowRgb}, 0.2)`, animation: 'slide-up 0.3s ease-out' }}
        >
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#cbd5e1' }}>
            {org.details}
          </p>
          <div>
            <p className="text-xs font-mono tracking-wider mb-2 uppercase" style={{ color: '#475569' }}>
              Notable Examples
            </p>
            <div className="flex flex-wrap gap-2">
              {org.examples.map((ex) => (
                <span
                  key={ex}
                  className="text-xs px-2.5 py-1 rounded-full italic"
                  style={{
                    background: `rgba(${org.glowRgb}, 0.1)`,
                    border: `1px solid rgba(${org.glowRgb}, 0.25)`,
                    color: org.color,
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs font-mono" style={{ color: '#64748b' }}>
            <span>Domain: <span style={{ color: org.color }}>{org.domain}</span></span>
            <span>Cell type: <span style={{ color: org.color }}>{org.cellType}</span></span>
            <span>Size: <span style={{ color: org.color }}>{org.size}</span></span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 mt-4 text-xs font-mono" style={{ color: `rgba(${org.glowRgb}, 0.6)` }}>
        {isSelected ? '▲ Collapse' : '▼ Learn more'}
      </div>
    </button>
  );
}

function OrganismsSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="organisms" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ color: '#14b8a6', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}
          >
            Domains of Microbial Life
          </span>
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white' }}
          >
            Six Kingdoms of the{' '}
            <span className="teal-gradient-text">Microscopic World</span>
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#64748b' }}>
            Click any card to reveal deep-dive details, notable species, and key biological properties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {organisms.map((org) => (
            <OrganismCard
              key={org.id}
              org={org}
              isSelected={selected === org.id}
              onClick={() => setSelected(selected === org.id ? null : org.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConceptsSection() {
  const [active, setActive] = useState('cell-biology');
  const concept = concepts.find((c) => c.id === active)!;

  return (
    <section
      id="concepts"
      className="py-24 px-6"
      style={{ background: 'rgba(4, 13, 26, 0.8)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ color: '#22d3ee', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
          >
            Core Concepts
          </span>
          <h2
            className="font-display font-bold text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            Foundational Microbiology
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color: '#64748b' }}>
            Essential concepts distilled for clarity — select a topic to explore.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {concepts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium font-display tracking-wide transition-all duration-200"
              style={
                active === c.id
                  ? {
                      background: 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(34,211,238,0.15))',
                      border: '1px solid rgba(20,184,166,0.5)',
                      color: '#2dd4bf',
                    }
                  : {
                      background: 'rgba(7, 21, 37, 0.5)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#64748b',
                    }
              }
              onMouseEnter={(e) => {
                if (active !== c.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(20,184,166,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (active !== c.id) {
                  (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }
              }}
            >
              <span className="text-base">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          key={active}
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(7, 21, 37, 0.7)',
            border: '1px solid rgba(20, 184, 166, 0.12)',
            backdropFilter: 'blur(12px)',
            animation: 'fade-in 0.35s ease-out',
          }}
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-8">
            {concept.title}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {concept.blocks.map((block, i) => (
              <div
                key={block.heading}
                className="rounded-xl p-6"
                style={{
                  background: 'rgba(2, 11, 24, 0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderTop: `2px solid ${i === 0 ? '#14b8a6' : i === 1 ? '#22d3ee' : 'rgba(167,139,250,0.7)'}`,
                }}
              >
                <span
                  className="text-xs font-mono tracking-wider uppercase block mb-3"
                  style={{ color: i === 0 ? '#14b8a6' : i === 1 ? '#22d3ee' : '#a78bfa' }}
                >
                  {block.tag}
                </span>
                <h4 className="font-display font-semibold text-white text-base mb-3">
                  {block.heading}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={`transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {value}{suffix}
    </span>
  );
}

function StatsSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,184,166,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2
            className="font-display font-bold text-white mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            The Scale of Microbial Life
          </h2>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Numbers that reframe how we understand life on Earth
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {globalStats.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl p-7 text-center"
              style={{
                background: 'rgba(7, 21, 37, 0.6)',
                border: '1px solid rgba(20, 184, 166, 0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="font-display font-black text-4xl md:text-5xl mb-2"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #14b8a6, #2dd4bf)'
                    : 'linear-gradient(135deg, #22d3ee, #67e8f9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <CountUp value={stat.value} suffix={stat.unit} />
              </div>
              <div className="font-semibold text-white text-sm mb-2 font-display">{stat.label}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#475569' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section id="timeline" className="py-24 px-6" style={{ background: 'rgba(4, 13, 26, 0.9)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ color: '#14b8a6', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}
          >
            History of Discovery
          </span>
          <h2
            className="font-display font-bold text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            Milestones in Microbiology
          </h2>
          <p className="max-w-md mx-auto text-sm" style={{ color: '#64748b' }}>
            Three centuries of discoveries that transformed medicine, ecology, and our understanding of life itself.
          </p>
        </div>

        <div className="relative timeline-line">
          {timelineEvents.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={event.year}
                className={`relative flex mb-10 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row gap-0`}
              >
                {/* Connector dot */}
                <div
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10"
                  style={{ top: 20 }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: event.color,
                      boxShadow: `0 0 12px ${event.color}`,
                    }}
                  />
                </div>

                {/* Mobile dot */}
                <div
                  className="md:hidden shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1"
                  style={{ background: `rgba(${event.color === '#14b8a6' ? '20,184,166' : '34,211,238'}, 0.12)`, border: `1px solid ${event.color}` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: event.color }} />
                </div>

                {/* Content */}
                <div className={`md:w-[calc(50%-2rem)] w-full ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div
                    className="rounded-2xl p-5 group hover:border-teal-500/30 transition-all duration-200"
                    style={{
                      background: 'rgba(7, 21, 37, 0.7)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${event.color === '#14b8a6' ? '20,184,166' : '34,211,238'}, 0.25)`;
                      (e.currentTarget as HTMLDivElement).style.background = `rgba(${event.color === '#14b8a6' ? '20,184,166' : '34,211,238'}, 0.05)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(7, 21, 37, 0.7)';
                    }}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
                      <span
                        className="font-display font-black text-2xl"
                        style={{ color: event.color }}
                      >
                        {event.year}
                      </span>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{
                          background: `rgba(${event.color === '#14b8a6' ? '20,184,166' : '34,211,238'}, 0.1)`,
                          color: event.color,
                          border: `1px solid rgba(${event.color === '#14b8a6' ? '20,184,166' : '34,211,238'}, 0.3)`,
                        }}
                      >
                        {event.milestone}
                      </span>
                    </div>
                    <p className="text-xs font-mono mb-2" style={{ color: '#475569' }}>
                      {event.person}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      {event.event}
                    </p>
                  </div>
                </div>

                {/* Spacer for opposite side on desktop */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechniquesSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="techniques" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-4"
            style={{ color: '#22d3ee', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
          >
            The Microbiologist's Toolkit
          </span>
          <h2
            className="font-display font-bold text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            Essential Lab Techniques
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color: '#64748b' }}>
            The tools that transformed microbiology from observation to precision molecular engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {techniques.map((tech, i) => (
            <div
              key={tech.name}
              className="rounded-2xl p-7 transition-all duration-300 cursor-default"
              style={{
                background: hovered === i ? `rgba(${tech.glowRgb}, 0.06)` : 'rgba(7, 21, 37, 0.65)',
                border: hovered === i
                  ? `1px solid rgba(${tech.glowRgb}, 0.4)`
                  : '1px solid rgba(20, 184, 166, 0.08)',
                backdropFilter: 'blur(10px)',
                boxShadow: hovered === i ? `0 0 40px rgba(${tech.glowRgb}, 0.08)` : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div
                    className="text-xs font-mono tracking-widest uppercase mb-1.5 px-2.5 py-1 rounded-full inline-block"
                    style={{
                      color: tech.color,
                      background: `rgba(${tech.glowRgb}, 0.12)`,
                      border: `1px solid rgba(${tech.glowRgb}, 0.25)`,
                    }}
                  >
                    {tech.abbr}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white">{tech.name}</h3>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                  style={{
                    background: `rgba(${tech.glowRgb}, 0.1)`,
                    border: `1px solid rgba(${tech.glowRgb}, 0.2)`,
                  }}
                >
                  {tech.icon}
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#94a3b8' }}>
                {tech.description}
              </p>

              {/* Specs table */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: 'rgba(2, 11, 24, 0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {tech.specs.map((spec) => (
                    <div key={spec.label}>
                      <div className="text-xs font-mono mb-1" style={{ color: '#475569' }}>
                        {spec.label}
                      </div>
                      <div className="text-sm font-mono font-semibold" style={{ color: tech.color }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#334155' }}>
                  Applications:{' '}
                </span>
                <span className="text-xs" style={{ color: '#64748b' }}>
                  {tech.applications}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="py-16 px-6"
      style={{
        background: 'rgba(2, 7, 14, 0.98)',
        borderTop: '1px solid rgba(20, 184, 166, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(20,184,166,0.25), rgba(20,184,166,0.05))',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="#14b8a6" opacity="0.9" />
                  <circle cx="8" cy="8" r="6.5" stroke="#14b8a6" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
                  <circle cx="8" cy="2" r="1.2" fill="#22d3ee" opacity="0.7" />
                  <circle cx="14" cy="11" r="0.8" fill="#22d3ee" opacity="0.7" />
                  <circle cx="2" cy="11" r="0.8" fill="#22d3ee" opacity="0.7" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Micro<span style={{ color: '#14b8a6' }}>Sphere</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#475569' }}>
              An interactive microbiology education platform for students, researchers, and science enthusiasts exploring the invisible living world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2.5">
              {['Organisms', 'Core Concepts', 'Timeline', 'Lab Techniques'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#475569' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#14b8a6'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#475569'; }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 tracking-wide">Domains</h4>
            <ul className="space-y-2.5">
              {['Bacteria', 'Viruses', 'Fungi', 'Archaea', 'Protozoa', 'Parasites'].map((domain) => (
                <li key={domain}>
                  <a
                    href="#organisms"
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#475569' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#22d3ee'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#475569'; }}
                  >
                    {domain}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-xs font-mono" style={{ color: '#334155' }}>
            © 2026 MicroSphere — Explore the Invisible World
          </p>
          <div className="flex gap-4">
            {['Bacteria', 'Viruses', 'Archaea'].map((tag, i) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{
                  color: i === 0 ? '#14b8a6' : i === 1 ? '#22d3ee' : '#a78bfa',
                  border: `1px solid ${i === 0 ? 'rgba(20,184,166,0.2)' : i === 1 ? 'rgba(34,211,238,0.2)' : 'rgba(167,139,250,0.2)'}`,
                  background: i === 0 ? 'rgba(20,184,166,0.06)' : i === 1 ? 'rgba(34,211,238,0.06)' : 'rgba(167,139,250,0.06)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('microsphere_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<'main' | 'student-basics' | 'admin-academic'>(() => {
    const savedUser = localStorage.getItem('microsphere_auth_user');
    if (savedUser) {
      try {
        const parsed: User = JSON.parse(savedUser);
        if (parsed.role === 'student') return 'student-basics';
        if (parsed.role === 'admin') return 'admin-academic';
      } catch (e) {}
    }
    return 'main';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('microsphere_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USERS;
  });

  const [passwordsMap, setPasswordsMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('microsphere_passwords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PASSWORDS;
  });

  // Dynamic Auth Rules State (Connected to Dashboard)
  const [authRules, setAuthRules] = useState<AuthRulesConfig>(() => {
    const saved = localStorage.getItem('microsphere_auth_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_AUTH_RULES;
  });

  // Audit Logs State (Connected to Dashboard)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('microsphere_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const handleAddAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('microsphere_audit_logs', JSON.stringify(updated));
  };

  const handleUpdateRules = (newRules: AuthRulesConfig) => {
    setAuthRules(newRules);
    localStorage.setItem('microsphere_auth_rules', JSON.stringify(newRules));
    handleAddAuditLog({
      userName: currentUser?.name || 'admin',
      role: 'admin',
      action: 'rule_update',
      status: 'success',
      details: `Authentication rules updated: Min Name=${newRules.minNameLength}, Min Pass=${newRules.minPasswordLength}, SpecialChar=${newRules.requireSpecialChar}, SelfReg=${newRules.allowRegistration}.`,
    });
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem('microsphere_audit_logs');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const targetUser = registeredUsers.find((u) => u.id === userId);
    const updated = registeredUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setRegisteredUsers(updated);
    localStorage.setItem('microsphere_registered_users', JSON.stringify(updated));

    handleAddAuditLog({
      userName: currentUser?.name || 'admin',
      role: 'admin',
      action: 'role_change',
      status: 'success',
      details: `User "${targetUser?.name || userId}" role updated to "${newRole}". New rule route effective upon sign in.`,
    });

    // If changing role of the currently logged-in user:
    if (currentUser && currentUser.id === userId) {
      const updatedCurr = { ...currentUser, role: newRole };
      setCurrentUser(updatedCurr);
      localStorage.setItem('microsphere_auth_user', JSON.stringify(updatedCurr));
      setCurrentView(newRole === 'student' ? 'student-basics' : 'admin-academic');
    }
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = registeredUsers.find((u) => u.id === userId);
    if (confirm(`Remove account "${targetUser?.name}" from the system?`)) {
      const updated = registeredUsers.filter((u) => u.id !== userId);
      setRegisteredUsers(updated);
      localStorage.setItem('microsphere_registered_users', JSON.stringify(updated));
      handleAddAuditLog({
        userName: currentUser?.name || 'admin',
        role: 'admin',
        action: 'role_change',
        status: 'success',
        details: `Account "${targetUser?.name}" deleted from registered users directory.`,
      });
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('microsphere_auth_user', JSON.stringify(user));
    // When student signs in appear the basics; when admin signs in show academic information
    if (user.role === 'student') {
      setCurrentView('student-basics');
    } else if (user.role === 'admin') {
      setCurrentView('admin-academic');
    } else {
      setCurrentView('main');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    if (currentUser) {
      handleAddAuditLog({
        userName: currentUser.name,
        role: currentUser.role,
        action: 'sign_out',
        status: 'success',
        details: 'User logged out cleanly. Session returned to guest mode.',
      });
    }
    setCurrentUser(null);
    localStorage.removeItem('microsphere_auth_user');
    setCurrentView('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterUser = (newUser: User, password: string) => {
    const updatedUsers = [...registeredUsers, newUser];
    const updatedPasswords = {
      ...passwordsMap,
      [newUser.name]: password,
      [newUser.name.toLowerCase()]: password,
    };
    setRegisteredUsers(updatedUsers);
    setPasswordsMap(updatedPasswords);
    localStorage.setItem('microsphere_registered_users', JSON.stringify(updatedUsers));
    localStorage.setItem('microsphere_passwords', JSON.stringify(updatedPasswords));
  };

  return (
    <div
      className="min-h-full overflow-x-hidden"
      style={{ background: '#020b18', color: '#f0f9ff' }}
    >
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onSwitchView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Role-Based Dynamic Views */}
      {currentView === 'student-basics' && currentUser?.role === 'student' ? (
        <StudentBasicsView
          user={currentUser}
          onExploreFullSite={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          rules={authRules}
        />
      ) : currentView === 'admin-academic' && currentUser?.role === 'admin' ? (
        <AdminAcademicView
          user={currentUser}
          onExploreFullSite={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          rules={authRules}
          onUpdateRules={handleUpdateRules}
          registeredUsers={registeredUsers}
          onUpdateUserRole={handleUpdateUserRole}
          onDeleteUser={handleDeleteUser}
          auditLogs={auditLogs}
          onClearAuditLogs={handleClearAuditLogs}
        />
      ) : (
        <>
          <Hero
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchView={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
          <OrganismsSection />
          <ConceptsSection />
          <StatsSection />
          <TimelineSection />
          <TechniquesSection />
        </>
      )}

      {/* Owner/Admin Only Floating Analytics & Statistical Analysis Button */}
      {currentUser?.role === 'admin' && (
        <button
          onClick={() => setIsAnalyticsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 md:px-5 py-3 rounded-full font-display font-bold text-xs tracking-wide shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(14, 165, 233, 0.4), 0 0 25px rgba(99, 102, 241, 0.25)',
          }}
          title="Website Analytics & Statistical Analysis Dashboard (Only appears for you)"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>📈</span>
            <span>Analytics & Stats</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/40 text-cyan-200 border border-white/10 hidden sm:inline-block">
            Only for you
          </span>
        </button>
      )}

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
        passwordsMap={passwordsMap}
        rules={authRules}
        onAddAuditLog={handleAddAuditLog}
      />

      <WebsiteAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={currentUser}
        registeredUsersCount={registeredUsers.length}
        rules={authRules}
        auditLogs={auditLogs}
      />
    </div>
  );
}
