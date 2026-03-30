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
      className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
    >
      <div className="p-4 sm:p-6 bg-white/50 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{content[lang].backBtn}</span>
        </motion.button>
        <h2 className="text-2xl font-extrabold text-indigo-800">{t.title}</h2>
        <div className="w-24"></div>
      </div>

      <div className="p-6 sm:p-10 overflow-y-auto">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
          {t.content}
        </div>
      </div>
    </motion.div>
  );
}
