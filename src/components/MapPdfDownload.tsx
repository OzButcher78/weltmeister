import { useRef, useState, useCallback } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { content, Language } from '../data';
import { getContinentId } from '../continentMap';
import worldData from '../world.json';
import jsPDF from 'jspdf';

const RUSSIA_SPLIT_X = 530;

// PDF map uses a taller canvas to better fill the A4 landscape page
const PDF_MAP_W = 800;
const PDF_MAP_H = 520;
const PDF_MAP_SCALE = 180;

function svgToDataUrl(svgElement: SVGSVGElement, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgString = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function MapPdfDownload({ lang }: { lang: Language }) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const t = content[lang];

  const generatePdf = useCallback(async () => {
    if (generating) return;
    setGenerating(true);

    try {
      // Wait for SVG to render
      await new Promise(r => setTimeout(r, 100));

      const svgEl = svgContainerRef.current?.querySelector('svg');
      if (!svgEl) throw new Error('SVG not found');

      const mapDataUrl = await svgToDataUrl(svgEl, PDF_MAP_W, PDF_MAP_H);

      // A4 landscape: 297 x 210 mm
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW = 297;
      const pageH = 210;
      const marginX = 3;
      const contentW = pageW - marginX * 2;

      // Header row with continent names
      const headerY = 7;
      const colW = contentW / t.continents.length;
      pdf.setFontSize(9);

      t.continents.forEach((c, i) => {
        const x = marginX + i * colW + colW / 2;
        const [r, g, b] = hexToRgb(c.hexColor);
        pdf.setTextColor(r, g, b);
        pdf.setFont('helvetica', 'bold');
        pdf.text(c.name, x, headerY, { align: 'center' });
      });

      // Dashed fold line
      const foldY = 11;
      pdf.setDrawColor(150, 150, 150);
      pdf.setLineWidth(0.3);
      const dashLen = 3;
      const gapLen = 2;
      let dx = marginX;
      while (dx < pageW - marginX) {
        const end = Math.min(dx + dashLen, pageW - marginX);
        pdf.line(dx, foldY, end, foldY);
        dx = end + gapLen;
      }

      // "Hier falten" / "Fold here" text
      pdf.setFontSize(5);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont('helvetica', 'italic');
      const foldText = lang === 'de' ? '✂ Hier falten' : '✂ Fold here';
      pdf.text(foldText, pageW / 2, foldY + 3, { align: 'center' });

      // Map image — fill as much space as possible
      const mapTop = foldY + 4;
      const availableH = pageH - mapTop - 2;
      const mapAspect = PDF_MAP_W / PDF_MAP_H;
      let mapW = contentW;
      let mapH = mapW / mapAspect;
      if (mapH > availableH) {
        mapH = availableH;
        mapW = mapH * mapAspect;
      }
      const mapX = (pageW - mapW) / 2;

      pdf.addImage(mapDataUrl, 'PNG', mapX, mapTop, mapW, mapH);

      pdf.save(lang === 'de' ? 'Weltkarte-Kontinente.pdf' : 'World-Map-Continents.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }, [generating, lang, t.continents]);

  return (
    <>
      {/* Hidden off-screen map for PDF capture */}
      <div
        ref={svgContainerRef}
        style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: `${PDF_MAP_W}px`, height: `${PDF_MAP_H}px` }}
        aria-hidden="true"
      >
        <ComposableMap projectionConfig={{ scale: PDF_MAP_SCALE }} width={PDF_MAP_W} height={PDF_MAP_H} style={{ width: `${PDF_MAP_W}px`, height: `${PDF_MAP_H}px` }}>
          <defs>
            <clipPath id="clip-pdf-russia-west">
              <rect x="0" y="0" width={RUSSIA_SPLIT_X} height={PDF_MAP_H} />
            </clipPath>
            <clipPath id="clip-pdf-russia-east">
              <rect x={RUSSIA_SPLIT_X} y="0" width={PDF_MAP_W - RUSSIA_SPLIT_X} height={PDF_MAP_H} />
            </clipPath>
          </defs>
          <Geographies geography={worldData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const continentId = getContinentId(countryName);
                const continent = t.continents.find(c => c.id === continentId);

                if (countryName === 'Russia') {
                  const europeContinent = t.continents.find(c => c.id === 'europe');
                  const asiaContinent = t.continents.find(c => c.id === 'asia');
                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        clipPath="url(#clip-pdf-russia-west)"
                        style={{
                          default: { fill: europeContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                          hover: { fill: europeContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                          pressed: { fill: europeContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                        }}
                      />
                      <Geography
                        geography={geo}
                        clipPath="url(#clip-pdf-russia-east)"
                        style={{
                          default: { fill: asiaContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                          hover: { fill: asiaContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                          pressed: { fill: asiaContinent?.hexColor || '#EAEAEC', stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                        }}
                      />
                    </g>
                  );
                }

                const fill = continent ? continent.hexColor : '#EAEAEC';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                      hover: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                      pressed: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
          <line x1={RUSSIA_SPLIT_X} y1="105" x2={RUSSIA_SPLIT_X} y2="215" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        </ComposableMap>
      </div>

      <button
        onClick={generatePdf}
        disabled={generating}
        className="w-full text-left"
      >
        {generating
          ? (lang === 'de' ? 'Erstelle PDF...' : 'Generating PDF...')
          : (lang === 'de' ? 'Karte Herunterladen' : 'Download Map')
        }
      </button>
    </>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}
