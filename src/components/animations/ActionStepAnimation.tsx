import React, { useEffect, useState } from 'react';
import { StepPhase } from '../../types/timeline';

interface ActionStepAnimationProps {
  phase: StepPhase;
  stepId?: string;
  stepName?: string;
  isInteractive?: boolean;
}

export const ActionStepAnimation: React.FC<ActionStepAnimationProps> = ({
  phase,
  stepId = '',
  stepName = '',
  isInteractive = true
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 1. STARTER FEEDING / GROWTH ANIMATION
  if (phase === 'starter' || stepId.includes('starter') || stepId.includes('levain')) {
    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-amber-50/60 to-emerald-50/50 dark:from-[#1c1916] dark:to-[#141a16] border border-amber-200/70 dark:border-stone-700/80 flex items-center justify-center overflow-hidden p-4">
        {/* Ambient Warmth Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />

        {/* Starter Jar Canvas */}
        <div className="relative w-28 h-32 flex flex-col items-center justify-end">
          {/* Glass Jar Outline */}
          <div className="absolute inset-0 rounded-2xl border-2 border-stone-400/50 dark:border-stone-500/50 bg-white/20 dark:bg-stone-900/30 backdrop-blur-[1px] shadow-inner overflow-hidden">
            {/* Height Measurement Lines */}
            <div className="absolute right-1.5 top-6 bottom-4 flex flex-col justify-between items-end opacity-40">
              <span className="w-2.5 h-[1px] bg-stone-500" />
              <span className="w-1.5 h-[1px] bg-stone-500" />
              <span className="w-3.5 h-[1.5px] bg-amber-600 font-mono text-[7px] text-amber-700 dark:text-amber-300 font-bold -mr-0.5">2x Peak</span>
              <span className="w-1.5 h-[1px] bg-stone-500" />
              <span className="w-2.5 h-[1px] bg-stone-500" />
            </div>

            {/* Rising Starter Liquid Body */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-200/90 via-amber-100/90 to-[#fcf5e5] dark:from-amber-900/70 dark:via-amber-800/60 dark:to-stone-800/80 transition-all duration-700 ease-out flex flex-col justify-between"
              style={{
                height: `${42 + Math.sin(frame * 0.06) * 12}%`,
                borderTopLeftRadius: '14px',
                borderTopRightRadius: '14px'
              }}
            >
              {/* Domed Crest at Top */}
              <div 
                className="w-full h-3.5 bg-amber-200 dark:bg-amber-700/80 rounded-full -mt-1.5 shadow-2xs transition-all"
                style={{
                  transform: `scaleY(${1 + Math.sin(frame * 0.08) * 0.25})`
                }}
              />

              {/* Internal Aeration Micro-bubbles */}
              <div className="relative w-full flex-1 overflow-hidden">
                {[
                  { left: '20%', bottom: '25%', size: 4, delay: 0 },
                  { left: '45%', bottom: '50%', size: 6, delay: 15 },
                  { left: '70%', bottom: '35%', size: 5, delay: 30 },
                  { left: '32%', bottom: '70%', size: 4, delay: 45 },
                  { left: '60%', bottom: '65%', size: 5.5, delay: 60 },
                  { left: '15%', bottom: '40%', size: 3.5, delay: 75 }
                ].map((b, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-white/70 dark:bg-amber-300/40 border border-amber-300/50 shadow-2xs transition-transform"
                    style={{
                      left: b.left,
                      bottom: `calc(${b.bottom} + ${Math.sin((frame + b.delay) * 0.1) * 6}px)`,
                      width: `${b.size}px`,
                      height: `${b.size}px`,
                      opacity: 0.6 + Math.sin((frame + b.delay) * 0.1) * 0.35
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Starting Rubber Band Marker (Baseline) */}
            <div className="absolute bottom-[35%] left-0 right-0 h-[2.5px] bg-red-500/80 dark:bg-red-400/80 shadow-xs z-10">
              <span className="absolute -top-3.5 left-1.5 text-[8px] font-bold text-red-600 dark:text-red-300 uppercase tracking-tighter">
                Fed Level
              </span>
            </div>
          </div>

          {/* Jar Lid Ring */}
          <div className="absolute -top-2 w-20 h-2.5 rounded-full bg-stone-300 dark:bg-stone-600 border border-stone-400 dark:border-stone-500 shadow-xs" />
        </div>

        {/* Live Biological Status Tag */}
        <div className="absolute top-2.5 right-3 text-right">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Fermenting & Rising</span>
          </span>
        </div>
      </div>
    );
  }

  // 2. MIX DOUGH / AUTOLYSE ANIMATION (Circular Stirring Motion)
  if (phase === 'mix' || stepName.toLowerCase().includes('mix') || stepName.toLowerCase().includes('autolyse') || stepName.toLowerCase().includes('salt')) {
    const isSalt = stepName.toLowerCase().includes('salt');
    const angle = (frame * 0.07);
    const stirX = Math.cos(angle) * 16;
    const stirY = Math.sin(angle) * 8;

    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-amber-50/50 to-stone-100/70 dark:from-[#1b1916] dark:to-[#151413] border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center overflow-hidden p-4">
        {/* Mixing Bowl */}
        <div className="relative w-40 h-28 flex flex-col items-center justify-center">
          {/* Bowl Rim */}
          <div className="absolute top-4 w-36 h-12 rounded-full border-2 border-stone-300 dark:border-stone-600 bg-stone-50/80 dark:bg-stone-800/80 shadow-inner" />
          
          {/* Dough Mass in Bowl with subtle circular deformation */}
          <div 
            className="absolute top-6 w-28 h-10 rounded-full bg-amber-100 dark:bg-stone-700/90 border border-amber-200/90 dark:border-stone-600 shadow-md transition-transform"
            style={{
              transform: `translate(${stirX * 0.3}px, ${stirY * 0.3}px) scale(${1 + Math.sin(angle) * 0.04}, ${1 - Math.sin(angle) * 0.04})`
            }}
          />

          {/* Mixing Utensil / Dough Whisk in Circular Motion */}
          {!isSalt && (
            <div 
              className="absolute z-10 transition-transform pointer-events-none"
              style={{
                transform: `translate(${stirX}px, ${stirY - 4}px) rotate(${stirX * 1.5}deg)`
              }}
            >
              {/* Wooden Handle */}
              <div className="w-3.5 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full border border-amber-950/40 shadow-md transform -rotate-12" />
              {/* Spatula / Scraper Head */}
              <div className="w-8 h-4 bg-stone-200 dark:bg-stone-400 rounded-t-md -mt-2 -ml-2 border border-stone-400 shadow-xs transform -rotate-12" />
            </div>
          )}

          {/* Salt Particles Falling Animation */}
          {isSalt && (
            <div className="absolute inset-0 pointer-events-none">
              {[
                { x: '35%', delay: 0 },
                { x: '45%', delay: 20 },
                { x: '55%', delay: 40 },
                { x: '65%', delay: 60 },
                { x: '40%', delay: 80 }
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white dark:bg-stone-100 border border-stone-300 shadow-xs"
                  style={{
                    left: p.x,
                    top: `${15 + ((frame + p.delay) % 70)}%`,
                    opacity: 1 - (((frame + p.delay) % 70) / 70),
                    transform: `scale(${0.8 + (((frame + p.delay) % 70) / 100)})`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-extrabold border border-stone-300 dark:border-stone-700">
            {isSalt ? 'Incorporating Salt' : 'Hydrating & Mixing'}
          </span>
        </div>
      </div>
    );
  }

  // 3. STRETCH & FOLD ANIMATION (Spring Dough Elasticity)
  if (stepName.toLowerCase().includes('stretch') || stepName.toLowerCase().includes('fold')) {
    const cycle = (frame % 80) / 80; // 0 to 1
    // Stretch phase (0 to 0.5), Fold & settle phase (0.5 to 1.0)
    const isStretching = cycle < 0.5;
    const stretchProgress = isStretching ? cycle * 2 : 1 - (cycle - 0.5) * 2;
    const doughHeight = 24 + stretchProgress * 42; // stretch upward
    const doughWidth = 80 - stretchProgress * 28; // narrows as it stretches

    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-amber-50/70 to-stone-100/70 dark:from-[#1c1916] dark:to-[#141312] border border-amber-200/70 dark:border-stone-700/80 flex items-center justify-center overflow-hidden p-4">
        {/* Bowl Surface */}
        <div className="relative w-44 h-28 flex flex-col items-center justify-end pb-3">
          {/* Bowl Base Line */}
          <div className="absolute bottom-2 w-40 h-8 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-200/50 dark:bg-stone-800/50 shadow-inner" />

          {/* Elastic Stretching Dough Mesh */}
          <div 
            className="relative bg-gradient-to-b from-[#fff8e7] via-[#f5e6c8] to-[#e8d5b0] dark:from-stone-700 dark:via-stone-800 dark:to-stone-900 border-2 border-amber-300/80 dark:border-amber-700/80 shadow-md flex items-center justify-center transition-all ease-out"
            style={{
              width: `${doughWidth}px`,
              height: `${doughHeight}px`,
              borderRadius: isStretching ? '18px 18px 30px 30px' : '30px 30px 20px 20px',
              transform: `translateY(-${stretchProgress * 12}px)`
            }}
          >
            {/* Gluten Tension Fiber Strands */}
            <div className="w-full h-full flex flex-col justify-around px-2 opacity-50">
              <span className="w-full h-[1px] bg-amber-400 dark:bg-stone-500 rounded-full" />
              <span className="w-full h-[1px] bg-amber-400 dark:bg-stone-500 rounded-full" />
              {isStretching && <span className="w-full h-[1px] bg-amber-400 dark:bg-stone-500 rounded-full" />}
            </div>
          </div>

          {/* Hands Grasping Top Fold Indicator */}
          <div 
            className="absolute z-10 transition-transform"
            style={{
              bottom: `${doughHeight + 14 - stretchProgress * 12}px`
            }}
          >
            <div className="flex space-x-4 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-stone-800/90 border border-amber-300/70 shadow-xs">
              <span>{isStretching ? '↑ Stretch Up' : '↓ Fold & Tuck'}</span>
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold border border-amber-300/70">
            Building Gluten Tension
          </span>
        </div>
      </div>
    );
  }

  // 4. BULK FERMENTATION ANIMATION (Organic Expansion & Gelatinous Bubble Rise)
  if (phase === 'ferment' || stepName.toLowerCase().includes('bulk')) {
    const expansion = 1 + Math.sin(frame * 0.05) * 0.12;

    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-amber-50/60 to-emerald-50/40 dark:from-[#1b1916] dark:to-[#121814] border border-emerald-200/70 dark:border-emerald-900/60 flex items-center justify-center overflow-hidden p-4">
        {/* Transparent Fermentation Container */}
        <div className="relative w-44 h-28 flex flex-col items-center justify-end pb-2">
          {/* Glass / Poly Tub Outline */}
          <div className="absolute inset-0 rounded-2xl border-2 border-stone-300/60 dark:border-stone-700/60 bg-white/20 dark:bg-stone-900/20 backdrop-blur-[1px] shadow-inner overflow-hidden">
            {/* Target 50-75% Rise Line */}
            <div className="absolute top-[28%] left-0 right-0 h-[1.5px] border-b border-dashed border-emerald-500/80 z-10">
              <span className="absolute -top-3.5 right-2 text-[8px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Target 75% Rise
              </span>
            </div>

            {/* Rising Aerated Dough Mass */}
            <div 
              className="absolute bottom-0 left-2 right-2 bg-gradient-to-t from-[#f5e4c4] to-[#fff3db] dark:from-stone-800 dark:to-stone-700 rounded-t-3xl border-t-2 border-amber-300/90 dark:border-amber-600/80 shadow-md transition-transform duration-300"
              style={{
                height: `${55 * expansion}%`,
                transform: `scale(${expansion}, 1)`
              }}
            >
              {/* Trapped Subsurface Aeration Bubbles */}
              <div className="relative w-full h-full">
                {[
                  { l: '20%', t: '20%', s: 7 },
                  { l: '50%', t: '15%', s: 9 },
                  { l: '75%', t: '25%', s: 6 },
                  { l: '35%', t: '45%', s: 8 },
                  { l: '65%', t: '50%', s: 7.5 }
                ].map((bub, idx) => (
                  <div
                    key={idx}
                    className="absolute rounded-full bg-white/60 dark:bg-amber-300/30 border border-amber-200/60 shadow-2xs"
                    style={{
                      left: bub.l,
                      top: bub.t,
                      width: `${bub.s}px`,
                      height: `${bub.s}px`,
                      transform: `scale(${1 + Math.sin((frame + idx * 20) * 0.08) * 0.15})`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300/70">
            50–75% Volume Expansion
          </span>
        </div>
      </div>
    );
  }

  // 5. SHAPE ANIMATION (Rounding slack dough into taut boule)
  if (phase === 'shape' || stepName.toLowerCase().includes('shape')) {
    const shapeProgress = (Math.sin(frame * 0.06) + 1) / 2; // 0 to 1
    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-stone-50 to-amber-50/50 dark:from-[#1b1916] dark:to-[#151413] border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center overflow-hidden p-4">
        <div className="relative w-44 h-28 flex flex-col items-center justify-center">
          {/* Work Surface / Floured Bench */}
          <div className="absolute bottom-4 w-36 h-2 rounded-full bg-stone-300 dark:bg-stone-700 opacity-60" />

          {/* Dough Morphing into Taut Rounded Boule */}
          <div 
            className="bg-gradient-to-b from-[#fff6e0] to-[#ecd7b0] dark:from-stone-700 dark:to-stone-800 border-2 border-amber-300 dark:border-amber-700 shadow-md transition-all duration-300 flex items-center justify-center"
            style={{
              width: `${75 + (1 - shapeProgress) * 20}px`,
              height: `${45 + shapeProgress * 15}px`,
              borderRadius: `${30 + shapeProgress * 20}px ${30 + shapeProgress * 20}px ${20 + shapeProgress * 10}px ${20 + shapeProgress * 10}px`,
              transform: `rotate(${Math.sin(frame * 0.06) * 4}deg)`
            }}
          >
            {/* Taut Surface Tension Lines */}
            <div className="w-full flex justify-center space-x-2 opacity-40">
              <span className="w-4 h-[1.5px] bg-amber-500 rounded-full" />
              <span className="w-6 h-[1.5px] bg-amber-500 rounded-full" />
              <span className="w-4 h-[1.5px] bg-amber-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-extrabold border border-stone-300 dark:border-stone-700">
            Tension Shaping
          </span>
        </div>
      </div>
    );
  }

  // 6. SCORE & BAKE ANIMATION (Razor Lame Slash & Dramatic Oven Spring)
  if (phase === 'bake' || stepName.toLowerCase().includes('bake') || stepName.toLowerCase().includes('score') || stepName.toLowerCase().includes('preheat')) {
    const isScore = stepName.toLowerCase().includes('score');
    const bladeX = ((frame % 60) / 60) * 80 - 40; // -40 to 40 px

    return (
      <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-orange-50/60 to-amber-100/50 dark:from-[#241a14] dark:to-[#181310] border border-orange-200/80 dark:border-orange-950/80 flex items-center justify-center overflow-hidden p-4">
        {/* Radiant Heat Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(249,115,22,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative w-44 h-28 flex flex-col items-center justify-center">
          {/* Baking Loaf Expanding (Oven Spring) */}
          <div 
            className="relative bg-gradient-to-t from-[#c67c38] via-[#e59b56] to-[#ffdb9e] dark:from-amber-950 dark:via-orange-900 dark:to-amber-700 border-2 border-orange-400 dark:border-orange-600 rounded-t-full shadow-lg transition-transform duration-500"
            style={{
              width: '100px',
              height: `${48 + Math.sin(frame * 0.08) * 6}px`
            }}
          >
            {/* Scored Ear Opening */}
            <div 
              className="absolute top-2 left-4 right-4 h-2 rounded-full bg-amber-100 dark:bg-amber-300 border border-amber-900/30 shadow-inner"
              style={{
                transform: `scaleY(${1 + Math.sin(frame * 0.08) * 0.3})`
              }}
            />

            {/* Radiant Heat Shimmer Lines */}
            <div className="absolute -top-3 left-0 right-0 flex justify-around opacity-60">
              <span className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>

          {/* Razor Blade / Lame Slicing Motion */}
          {isScore && (
            <div 
              className="absolute z-20 pointer-events-none"
              style={{
                transform: `translate(${bladeX}px, -18px) rotate(30deg)`
              }}
            >
              {/* Lame Handle & Razor */}
              <div className="w-1.5 h-12 bg-stone-700 rounded-full shadow-md" />
              <div className="w-6 h-3 bg-stone-200 border border-stone-400 rounded-xs -mt-1 -ml-2 shadow-xs" />
            </div>
          )}
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-3">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100/90 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 text-[10px] font-extrabold border border-orange-300/70">
            {isScore ? '30° Lame Angle' : 'Radiant Oven Spring'}
          </span>
        </div>
      </div>
    );
  }

  // 7. COOLING & SLICING ANIMATION (Settling Crumb & Knife Slice)
  return (
    <div className="relative w-full h-36 sm:h-40 rounded-2xl bg-gradient-to-b from-indigo-50/50 to-amber-50/40 dark:from-[#17161f] dark:to-[#161413] border border-indigo-200/70 dark:border-stone-700/80 flex items-center justify-center overflow-hidden p-4">
      <div className="relative w-44 h-28 flex flex-col items-center justify-center">
        {/* Wire Cooling Rack Lines */}
        <div className="absolute bottom-4 w-36 h-2 flex justify-between px-2">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="w-[1.5px] h-3 bg-stone-400 dark:bg-stone-600 rounded-full" />
          ))}
        </div>

        {/* Finished Loaf with Cut Open Open-Crumb Slice */}
        <div className="relative flex items-end space-x-2">
          {/* Main Loaf Body */}
          <div className="w-20 h-14 rounded-t-full bg-gradient-to-t from-[#8b4513] via-[#cd853f] to-[#deb887] border-2 border-amber-800 dark:border-amber-600 shadow-md flex items-center justify-center" />

          {/* Separated Slice Revealing Lustrous Open Crumb */}
          <div 
            className="w-10 h-14 rounded-t-xl bg-[#fff8e7] dark:bg-stone-800 border-2 border-amber-800 dark:border-amber-600 shadow-sm p-1 flex flex-col justify-around transition-transform duration-700"
            style={{
              transform: `translateX(${3 + Math.sin(frame * 0.05) * 2}px)`
            }}
          >
            {/* Open Aerated Holes in Crumb */}
            <div className="w-2 h-2 rounded-full bg-amber-200 dark:bg-stone-700 self-center" />
            <div className="flex justify-between">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200 dark:bg-stone-700" />
              <span className="w-2 h-2 rounded-full bg-amber-200 dark:bg-stone-700" />
            </div>
            <div className="w-2.5 h-1.5 rounded-full bg-amber-200 dark:bg-stone-700 self-center" />
          </div>
        </div>
      </div>

      {/* Status Tag */}
      <div className="absolute top-2.5 right-3">
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 text-[10px] font-extrabold border border-indigo-300/70">
          Internal Crumb Set
        </span>
      </div>
    </div>
  );
};
