import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, Language, Continent, Ocean } from '../data';
import { playSound } from '../sounds';
import { ArrowLeft, Info, X, ChevronRight, ChevronLeft } from 'lucide-react';
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
      className="w-full max-w-5xl h-[90vh] flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
    >
      <div className="px-4 py-2 sm:px-6 sm:py-3 bg-white/50 border-b border-white/20 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t.backBtn}</span>
        </motion.button>
        <h2 className="text-2xl font-extrabold text-indigo-800">{t.learnBtn}</h2>
        <div className="w-24"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col">
        {/* General Info Section */}
        <div className="mb-4 bg-indigo-50 p-3 sm:p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-800 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5" />
            {lang === 'de' ? 'Wusstest du schon?' : 'Did you know?'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-indigo-900/80 text-sm">
            <div className="bg-white/60 p-2.5 rounded-xl">
              <span className="font-bold block mb-0.5">🌍 {lang === 'de' ? 'Wie viele gibt es?' : 'How many are there?'}</span>
              {lang === 'de' ? 'Es gibt 7 Kontinente und 5 Ozeane auf unserer Erde.' : 'There are 7 continents and 5 oceans on our Earth.'}
            </div>
            <div className="bg-white/60 p-2.5 rounded-xl">
              <span className="font-bold block mb-0.5">🐘 {lang === 'de' ? 'Größter & Kleinster:' : 'Largest & Smallest:'}</span>
              {lang === 'de' ? 'Asien ist der größte und Ozeanien der kleinste Kontinent.' : 'Asia is the largest and Oceania is the smallest continent.'}
            </div>
            <div className="bg-white/60 p-2.5 rounded-xl">
              <span className="font-bold block mb-0.5">🌊 {lang === 'de' ? 'Größter Ozean:' : 'Largest Ocean:'}</span>
              {lang === 'de' ? 'Der Pazifische Ozean ist der größte und tiefste Ozean.' : 'The Pacific Ocean is the largest and deepest ocean.'}
            </div>
            <div className="bg-white/60 p-2.5 rounded-xl">
              <span className="font-bold block mb-0.5">🧊 {lang === 'de' ? 'Kältester Kontinent:' : 'Coldest Continent:'}</span>
              {lang === 'de' ? 'Antarktika ist fast vollständig mit Eis bedeckt.' : 'Antarctica is almost completely covered in ice.'}
            </div>
            <div className="bg-white/60 p-2.5 rounded-xl">
              <span className="font-bold block mb-0.5">👨‍👩‍👧‍👦 {lang === 'de' ? 'Die meisten Menschen:' : 'Most People:'}</span>
              {lang === 'de' ? 'In Asien leben die meisten Menschen der Welt.' : 'Most people in the world live in Asia.'}
            </div>
          </div>
        </div>

        {/* World Map */}
        <div className="relative w-full max-w-4xl mx-auto mb-4 aspect-[2/1] bg-sky-100 rounded-3xl overflow-hidden border-4 border-white shadow-inner flex-shrink-0">
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
          
          {/* Oceans on Map */}
          {t.oceans.map(o => (
            <motion.button
              key={o.id}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl drop-shadow-md z-10"
              style={{ left: `${o.mapX}%`, top: `${o.mapY}%` }}
              onClick={() => handleSelect(o)}
              title={o.name}
            >
              {o.emoji}
            </motion.button>
          ))}
        </div>

        {/* Continent Cards */}
        <h3 className="text-lg font-bold text-indigo-800 mb-2">{lang === 'de' ? 'Kontinente' : 'Continents'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 mb-4">
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
              className={`${c.color} cursor-pointer rounded-2xl p-2.5 text-white shadow-md relative overflow-hidden group touch-manipulation`}
            >
              <div className="absolute -right-3 -bottom-3 text-4xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                {c.emoji}
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{c.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ocean Cards */}
        <h3 className="text-lg font-bold text-indigo-800 mb-2">{lang === 'de' ? 'Ozeane' : 'Oceans'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {t.oceans.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(o)}
              className={`${o.color} cursor-pointer rounded-2xl p-2.5 text-white shadow-md relative overflow-hidden group touch-manipulation`}
            >
              <div className="absolute -right-3 -bottom-3 text-4xl opacity-30 group-hover:scale-110 transition-transform duration-300">
                {o.emoji}
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">{o.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{o.name}</h3>
                </div>
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className={`${selected.color} p-6 text-center relative`}>
                <button onClick={close} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors">
                  <X className="w-6 h-6" />
                </button>
                <span className="text-6xl block mb-2">{selected.emoji}</span>
                <h3 className="text-3xl font-extrabold text-white">{selected.name}</h3>
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-center min-h-[250px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={factStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl leading-none mt-1">✨</span>
                      <p className="text-2xl text-slate-700 font-bold leading-snug">
                        {selected.facts[factStep]}
                      </p>
                    </div>
                    
                    {/* Show Animals on the last fact step if it has animals */}
                    {factStep === selected.facts.length - 1 && 'animals' in selected && selected.animals && selected.animals.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 bg-slate-100 p-4 rounded-2xl border border-slate-200"
                      >
                        <h4 className="font-bold text-slate-600 mb-2 uppercase tracking-wide text-sm">
                          {lang === 'de' ? 'Tiere hier:' : 'Animals here:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selected.animals.map((animal, idx) => (
                            <span key={idx} className="bg-white px-3 py-1 rounded-full text-slate-700 font-medium shadow-sm border border-slate-200">
                              {animal}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {selected.facts.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-3 h-3 rounded-full transition-colors ${i === factStep ? selected.color : 'bg-slate-300'}`}
                    />
                  ))}
                </div>

                <div className="flex justify-between gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevFact}
                    disabled={factStep === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-colors ${factStep === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    {t.prevFact}
                  </motion.button>
                  
                  {factStep < selected.facts.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextFact}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white transition-colors ${selected.color} hover:brightness-110`}
                    >
                      {t.nextFact}
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={close}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
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
