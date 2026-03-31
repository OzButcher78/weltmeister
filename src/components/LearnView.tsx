import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, Language, Continent, Ocean } from '../data';
import { playSound } from '../sounds';
import { ArrowLeft, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { getContinentId } from '../continentMap';
import worldData from '../world.json';

export default function LearnView({ lang, onBack }: { lang: Language, onBack: () => void, key?: string }) {
  const t = content[lang];
  const [selected, setSelected] = useState<Continent | Ocean | null>(null);
  const [factStep, setFactStep] = useState(0);
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  const handleSelect = (item: Continent | Ocean) => {
    playSound('pop');
    setSelected(item);
    setFactStep(0);
  };

  const close = () => {
    playSound('click');
    setSelected(null);
  };

  const nextFact = () => {
    playSound('pop');
    setFactStep(s => s + 1);
  };

  const prevFact = () => {
    playSound('pop');
    setFactStep(s => s - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-5xl h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-5.5rem)] md:h-[calc(100dvh-6rem)] flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white/50 border-b border-white/20 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-1.5 sm:gap-2 text-indigo-600 font-bold bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.backBtn}</span>
        </motion.button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-800">{t.learnBtn}</h2>
        <div className="w-16 sm:w-24"></div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scrollbar p-2 sm:p-3 md:p-5 flex flex-col">
        {/* World Map */}
        <div className="relative w-full max-w-4xl mx-auto mb-2 sm:mb-3 md:mb-4 aspect-[2/1] bg-sky-100 rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-white shadow-inner flex-shrink-0">
          <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
            <Geographies geography={worldData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const continentId = getContinentId(countryName);
                  const continent = t.continents.find(c => c.id === continentId);
                  
                  const isSelected = selected?.id === continentId;
                  const isHovered = hoveredContinent === continentId;
                  
                  const fill = continent ? continent.hexColor : "#EAEAEC";
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (continent) setHoveredContinent(continent.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredContinent(null);
                      }}
                      onClick={() => {
                        if (continent) handleSelect(continent);
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "#fff" : fill,
                          stroke: "#FFF",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 250ms",
                          opacity: isSelected ? 1 : (isHovered ? 1 : 0.85),
                        },
                        hover: {
                          fill: isSelected ? "#fff" : fill,
                          stroke: "#FFF",
                          strokeWidth: 1,
                          outline: "none",
                          opacity: 1,
                          cursor: continent ? "pointer" : "default"
                        },
                        pressed: {
                          fill: isSelected ? "#fff" : fill,
                          stroke: "#FFF",
                          strokeWidth: 1,
                          outline: "none",
                          opacity: 1,
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          
          {/* Continent Labels on Map */}
          {t.continents.map(c => (
            <div
              key={`label-${c.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-200"
              style={{
                left: `${c.mapX}%`,
                top: `${c.mapY}%`,
                opacity: hoveredContinent === c.id ? 1 : 0,
              }}
            >
              <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs sm:text-sm font-bold px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
                {c.name}
              </span>
            </div>
          ))}

          {/* Oceans on Map */}
          {t.oceans.map(o => (
            <div key={o.id} className="group absolute transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${o.mapX}%`, top: `${o.mapY}%` }}>
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className="text-2xl sm:text-3xl md:text-4xl drop-shadow-md"
                onClick={() => handleSelect(o)}
              >
                {o.emoji}
              </motion.button>
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs sm:text-sm font-bold px-2 py-1 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {o.name}
              </span>
            </div>
          ))}
        </div>

        {/* Continent Cards */}
        <h3 className="text-base sm:text-lg font-bold text-indigo-800 mb-1.5 sm:mb-2">{lang === 'de' ? 'Kontinente' : 'Continents'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-1.5 sm:gap-2.5 mb-2 sm:mb-3">
          {t.continents.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredContinent(c.id)}
              onMouseLeave={() => setHoveredContinent(null)}
              onClick={() => handleSelect(c)}
              className={`${c.color} cursor-pointer rounded-xl sm:rounded-2xl p-2 sm:p-3 text-white shadow-md relative overflow-hidden group touch-manipulation`}
            >
              <div className="absolute -right-3 -bottom-3 text-4xl sm:text-5xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                {c.emoji}
              </div>
              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2.5">
                <span className="text-2xl sm:text-3xl">{c.emoji}</span>
                <h3 className="text-sm sm:text-base font-bold leading-tight">{c.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ocean Cards */}
        <h3 className="text-base sm:text-lg font-bold text-indigo-800 mb-1.5 sm:mb-2">{lang === 'de' ? 'Ozeane' : 'Oceans'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2.5">
          {t.oceans.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(o)}
              className={`${o.color} cursor-pointer rounded-xl sm:rounded-2xl p-2 sm:p-3 text-white shadow-md relative overflow-hidden group touch-manipulation`}
            >
              <div className="absolute -right-3 -bottom-3 text-4xl sm:text-5xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                {o.emoji}
              </div>
              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2.5">
                <span className="text-2xl sm:text-3xl">{o.emoji}</span>
                <h3 className="text-sm sm:text-base font-bold leading-tight">{o.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-8rem)]"
            >
              <div className={`${selected.color} p-4 sm:p-6 text-center relative flex-shrink-0`}>
                <button onClick={close} className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 sm:p-2 transition-colors">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <span className="text-4xl sm:text-5xl md:text-6xl block mb-1 sm:mb-2">{selected.emoji}</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{selected.name}</h3>
              </div>

              <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-center min-h-[180px] sm:min-h-[250px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={factStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4 sm:gap-6"
                  >
                    <div className="flex items-start gap-2.5 sm:gap-4">
                      <span className="text-2xl sm:text-4xl leading-none mt-1">✨</span>
                      <p className="text-lg sm:text-xl md:text-2xl text-slate-700 font-bold leading-snug">
                        {selected.facts[factStep]}
                      </p>
                    </div>
                    
                    {/* Show Animals on the last fact step if it has animals */}
                    {factStep === selected.facts.length - 1 && 'animals' in selected && selected.animals && selected.animals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 sm:mt-4 bg-slate-100 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200"
                      >
                        <h4 className="font-bold text-slate-600 mb-1.5 sm:mb-2 uppercase tracking-wide text-xs sm:text-sm">
                          {lang === 'de' ? 'Tiere hier:' : 'Animals here:'}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {selected.animals.map((animal, idx) => (
                            <span key={idx} className="bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-slate-700 text-sm sm:text-base font-medium shadow-sm border border-slate-200">
                              {animal}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-3 sm:p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0">
                {/* Progress Dots */}
                <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-6">
                  {selected.facts.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${i === factStep ? selected.color : 'bg-slate-300'}`}
                    />
                  ))}
                </div>

                <div className="flex justify-between gap-2 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevFact}
                    disabled={factStep === 0}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-colors touch-manipulation ${factStep === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t.prevFact}
                  </motion.button>

                  {factStep < selected.facts.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextFact}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white transition-colors touch-manipulation ${selected.color} hover:brightness-110`}
                    >
                      {t.nextFact}
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={close}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white bg-indigo-500 hover:bg-indigo-600 transition-colors touch-manipulation"
                    >
                      {t.finishFacts}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
