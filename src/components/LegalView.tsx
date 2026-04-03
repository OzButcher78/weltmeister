import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { content, Language } from '../data';

export default function LegalView({ lang, page, onBack }: { lang: Language, page: 'impressum' | 'datenschutz' | 'nutzungsbedingungen', onBack: () => void, key?: string }) {
  const t = content[lang].legal[page];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ backgroundColor: 'rgba(255,255,255,0.9)', WebkitBackdropFilter: 'blur(24px)', backdropFilter: 'blur(24px)' }}
      className="w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-5rem)] sm:max-h-[calc(100dvh-5.5rem)] md:max-h-[80dvh]"
    >
      <div className="px-3 py-2 sm:p-4 md:p-6 bg-white/50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 font-bold bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{content[lang].backBtn}</span>
        </motion.button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-800">{t.title}</h2>
        <div className="w-12 sm:w-24"></div>
      </div>

      <div className="p-4 sm:p-6 md:p-10 overflow-y-auto thin-scrollbar">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 font-medium leading-relaxed text-sm sm:text-base">
          {t.content}
        </div>
      </div>
    </motion.div>
  );
}
