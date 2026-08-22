import React from 'react';

export interface StepIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * 1. Feed Starter Icon
 * Jar of starter with flour + water droplet being added from above with feeding motion arrows
 */
export const FeedStarterIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Jar Body & Rim */}
    <path d="M10 11H22" />
    <path d="M11 11V8C11 7.44772 11.4477 7 12 7H20C20.5523 7 21 7.44772 21 8V11" />
    <path d="M10 11L9 15C8.4 17.5 8 20 8 23C8 26.3137 10.6863 29 14 29H18C21.3137 29 24 26.3137 24 23C24 20 23.6 17.5 23 15L22 11" />
    {/* Starter level with bubbles */}
    <path d="M9.5 20C12 19 14 21 16 20C18 19 20 21 22.5 20" />
    <circle cx="12.5" cy="24.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="23.5" r="1" fill="currentColor" />
    <circle cx="15" cy="26.5" r="0.75" fill="currentColor" />
    {/* Feeding motion: droplet & flour falling from above */}
    <path d="M16 2V6M16 6L14.5 4.5M16 6L17.5 4.5" />
    <path d="M24 3L23 5M25 5L24 7" />
  </svg>
);

/**
 * 2. Mix Dough Icon
 * Bowl with flour/water combined using a spatula / dough scraper in a stirring motion
 */
export const MixDoughIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Mixing Bowl */}
    <path d="M5 14H27C27 21.1797 21.1797 27 14 27H18C10.8203 27 5 21.1797 5 14Z" />
    <path d="M11 27H21" strokeWidth="2.5" />
    {/* Dough mass in bowl */}
    <path d="M9 18C11 16 14 16 16 18C18 20 21 20 23 18" />
    {/* Spatula / Mixing Scraper & motion arc */}
    <path d="M20 5L14 17" strokeWidth="2.5" />
    <path d="M12 16L16 20" strokeWidth="2.5" />
    <path d="M8 8C10 6.5 13 6 16 7" strokeDasharray="1.5 2.5" />
  </svg>
);

/**
 * 3. Rest / Autolyse Icon
 * Covered bowl with a subtle clock symbol
 */
export const RestAutolyseIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Bowl */}
    <path d="M6 16H26C26 22 21.5 26.5 16 26.5C10.5 26.5 6 22 6 16Z" />
    <path d="M12 26.5H20" />
    {/* Towel / Cover draped over bowl */}
    <path d="M4 14C8 12.5 14 12.5 16 12.5C18 12.5 24 12.5 28 14" strokeWidth="2.5" />
    <path d="M4 14V17M28 14V17" />
    {/* Subtle Clock Symbol */}
    <circle cx="23" cy="8" r="5" />
    <path d="M23 5.5V8L25 9.5" />
  </svg>
);

/**
 * 4. Add Salt Icon
 * Bowl with small salt crystals being sprinkled into dough
 */
export const AddSaltIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Dough Bowl */}
    <path d="M5 16H27C27 22.5 21.5 27 16 27C10.5 27 5 22.5 5 16Z" />
    <path d="M11 27H21" />
    <path d="M8 19C11 18 14 18 16 19.5C18 21 21 20 24 19" />
    {/* Salt Pinch / Cellar dispenser */}
    <path d="M19 4L22 7L16 10L14 7L19 4Z" />
    {/* Sprinkling Salt Crystals */}
    <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    <circle cx="15" cy="14" r="0.75" fill="currentColor" />
    <circle cx="17" cy="12" r="0.75" fill="currentColor" />
    <circle cx="19" cy="14.5" r="0.75" fill="currentColor" />
    <circle cx="21" cy="12.5" r="0.75" fill="currentColor" />
  </svg>
);

/**
 * 5. Stretch & Fold Icon
 * Hands stretching dough upward and folding it back over into the bowl
 */
export const StretchFoldIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Bowl Base */}
    <path d="M6 20H26C26 25 21.5 28 16 28C10.5 28 6 25 6 20Z" />
    <path d="M11 28H21" />
    {/* Dough being pulled upward into a high tension fold */}
    <path d="M10 20C10 15 13 8 16 5C19 8 22 15 22 20" strokeWidth="2.5" />
    {/* Hands / Pulling arrows at top */}
    <path d="M16 4V9M16 4L13 7M16 4L19 7" strokeWidth="2" />
    {/* Folding curve over */}
    <path d="M13 14C15 12 18 12 20 15" strokeDasharray="1.5 2" />
  </svg>
);

/**
 * 6. Bulk Fermentation Icon
 * Covered dough container with rising arrows and active bubbles
 */
export const BulkFermentationIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Container / Tub */}
    <path d="M6 10H26V25C26 26.6569 24.6569 28 23 28H9C7.34315 28 6 26.6569 6 25V10Z" />
    <path d="M5 10H27" strokeWidth="2.5" />
    {/* Domed aerated dough rising */}
    <path d="M7 21C10 17 22 17 25 21" strokeWidth="2.2" />
    {/* Active bubbles */}
    <circle cx="11" cy="24" r="1.2" fill="currentColor" />
    <circle cx="16" cy="22" r="1.5" fill="currentColor" />
    <circle cx="21" cy="24.5" r="1.2" fill="currentColor" />
    {/* Rising Upward Arrows */}
    <path d="M12 7V4M12 4L10.5 5.5M12 4L13.5 5.5" />
    <path d="M16 6V2M16 2L14.5 3.5M16 2L17.5 3.5" strokeWidth="2.2" />
    <path d="M20 7V4M20 4L18.5 5.5M20 4L21.5 5.5" />
  </svg>
);

/**
 * 7. Pre-Shape Icon
 * Hands gently cupping and forming dough into a loose round
 */
export const PreShapeIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Worktable bench line */}
    <path d="M4 27H28" strokeWidth="2.5" />
    {/* Rounding Dough Mass */}
    <path d="M9 27C9 20 12 16 16 16C20 16 23 20 23 27" strokeWidth="2.2" />
    {/* Left cupped hand arrow */}
    <path d="M6 18C8 14 11 12 14 13" />
    <path d="M14 13L11.5 11M14 13L12 15.5" />
    {/* Right cupped hand arrow */}
    <path d="M26 18C24 14 21 12 18 13" />
    <path d="M18 13L20.5 11M18 13L20 15.5" />
  </svg>
);

/**
 * 8. Bench Rest Icon
 * Dough ball resting on counter with a small clock
 */
export const BenchRestIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Counter Table line */}
    <path d="M4 26H28" strokeWidth="2.5" />
    {/* Resting Dough Ball with relaxed dome */}
    <path d="M7 26C7 19 11 15 16 15C21 15 25 19 25 26" strokeWidth="2.2" />
    {/* Clock icon in corner */}
    <circle cx="23" cy="8" r="5" />
    <path d="M23 5.5V8L25 9.5" />
  </svg>
);

/**
 * 9. Final Shape Icon
 * Hands shaping a smooth, taut boule / batard creating surface tension
 */
export const FinalShapeIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Work table */}
    <path d="M4 26H28" strokeWidth="2.5" />
    {/* Perfectly Taut Boule */}
    <path d="M8 26C8 17 11.5 13 16 13C20.5 13 24 17 24 26" strokeWidth="2.5" />
    {/* Surface tension curves & tucking motions */}
    <path d="M12 26C12 21 14 18 16 18C18 18 20 21 20 26" />
    {/* Left tuck hand */}
    <path d="M5 22C7 24 9 25 12 25" strokeWidth="2" />
    {/* Right tuck hand */}
    <path d="M27 22C25 24 23 25 20 25" strokeWidth="2" />
  </svg>
);

/**
 * 10. Proof / Cold Retard Icon
 * Shaped dough inside a ridged banneton proofing basket with subtle cold/rise markers
 */
export const ProofIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Banneton Cane Basket Rim & Base */}
    <path d="M5 14H27L24 26C23.5 27.5 22 28 20 28H12C10 28 8.5 27.5 8 26L5 14Z" strokeWidth="2.2" />
    {/* Banneton Cane Coil Ridges */}
    <path d="M6.2 18H25.8" strokeWidth="1.5" />
    <path d="M7.4 22H24.6" strokeWidth="1.5" />
    {/* Dough crowned inside basket */}
    <path d="M7 14C7 8.5 11 6 16 6C21 6 25 8.5 25 14" strokeWidth="2.5" />
    {/* Subtle snowflake cold symbol */}
    <path d="M16 2V4M16 3L14.5 2M16 3L17.5 2" strokeWidth="1.5" />
  </svg>
);

/**
 * 11. Score Icon
 * Razor lame making a clean slash across the dough surface
 */
export const ScoreIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Dough Loaf */}
    <path d="M4 25C4 16 9 12 16 12C23 12 28 16 28 25" strokeWidth="2.2" />
    <path d="M3 25H29" strokeWidth="2.5" />
    {/* Slashed Ear Cut line */}
    <path d="M10 20C13 16 19 16 22 20" strokeWidth="2.5" />
    {/* Razor Lame Blade entering angle */}
    <path d="M22 6L16 15" strokeWidth="2.5" />
    <path d="M20 4L24 8L20 12L16 8L20 4Z" strokeWidth="2" />
    <path d="M18 6L22 10" strokeWidth="1.5" />
  </svg>
);

/**
 * 12. Bake Icon
 * Dutch oven inside oven with rising radiant heat lines
 */
export const BakeIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Dutch Oven Pot Body */}
    <path d="M7 17H25L23.5 27C23.2 28 22 28.5 20 28.5H12C10 28.5 8.8 28 8.5 27L7 17Z" strokeWidth="2.2" />
    <path d="M4 18H7M25 18H28" strokeWidth="2.5" />
    {/* Dutch Oven Domed Lid with Handle */}
    <path d="M6 17C6 12 10 10 16 10C22 10 26 12 26 17H6Z" strokeWidth="2.2" />
    <path d="M14 10V8C14 7.5 14.5 7 15 7H17C17.5 7 18 7.5 18 8V10" strokeWidth="2" />
    {/* Radiant Oven Heat waves from above */}
    <path d="M10 3C10 4 12 4 12 5" strokeWidth="2" />
    <path d="M16 2C16 3.5 18 3.5 18 5" strokeWidth="2" />
    <path d="M22 3C22 4 24 4 24 5" strokeWidth="2" />
  </svg>
);

/**
 * 13. Cool Icon
 * Finished loaf on a wire cooling rack with airflow steam lines
 */
export const CoolIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Wire Cooling Rack */}
    <path d="M3 24H29" strokeWidth="2.5" />
    <path d="M6 24V28M13 24V28M19 24V28M26 24V28" strokeWidth="2" />
    {/* Beautifully Baked Loaf with Ear */}
    <path d="M7 24C7 16 10 12 16 12C22 12 25 16 25 24" strokeWidth="2.2" />
    <path d="M11 18C13 15 19 15 21 18" strokeWidth="2" />
    {/* Delicate cooling airflow / steam lines drifting up */}
    <path d="M12 8C12 6.5 13.5 6 13.5 4.5" strokeWidth="1.8" />
    <path d="M16 9C16 7 17.5 6.5 17.5 4.5" strokeWidth="1.8" />
    <path d="M20 8C20 6.5 21.5 6 21.5 4.5" strokeWidth="1.8" />
  </svg>
);

/**
 * 14. Slice Icon
 * Bread knife slicing diagonally through a golden sourdough loaf
 */
export const SliceIcon: React.FC<StepIconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Sourdough Loaf Half */}
    <path d="M5 26H27C27 18 23 13 16 13C9 13 5 18 5 26Z" strokeWidth="2.2" />
    {/* Cut Cross-section line */}
    <path d="M16 13V26" strokeWidth="2.2" />
    {/* Crumb air pocket bubbles */}
    <circle cx="11" cy="20" r="1.2" fill="currentColor" />
    <circle cx="13.5" cy="23" r="0.8" fill="currentColor" />
    {/* Bread Knife slicing down */}
    <path d="M28 4L16 16" strokeWidth="2.5" />
    <path d="M24 3L29 8" strokeWidth="2" />
  </svg>
);

/**
 * Generic Map Helper: returns the dedicated line-art instructional icon
 * matching any step ID, name, or action verb
 */
export const StepInstructionIcon: React.FC<{
  stepId?: string;
  stepName?: string;
  phase?: string;
  size?: number;
  className?: string;
}> = ({ stepId = '', stepName = '', phase = '', size = 24, className = '' }) => {
  const query = `${stepId} ${stepName} ${phase}`.toLowerCase();

  if (query.includes('feed') || query.includes('starter') || query.includes('levain')) {
    return <FeedStarterIcon size={size} className={className} />;
  }
  if (query.includes('bench') && query.includes('rest')) {
    return <BenchRestIcon size={size} className={className} />;
  }
  if (query.includes('autolyse') || query.includes('rest')) {
    return <RestAutolyseIcon size={size} className={className} />;
  }
  if (query.includes('mix') || query.includes('combine')) {
    return <MixDoughIcon size={size} className={className} />;
  }
  if (query.includes('salt')) {
    return <AddSaltIcon size={size} className={className} />;
  }
  if (query.includes('stretch') || query.includes('fold') || query.includes('coil')) {
    return <StretchFoldIcon size={size} className={className} />;
  }
  if (query.includes('bulk') || query.includes('ferment')) {
    return <BulkFermentationIcon size={size} className={className} />;
  }
  if (query.includes('pre-shape') || query.includes('preshape')) {
    return <PreShapeIcon size={size} className={className} />;
  }
  if (query.includes('shape') || query.includes('batard') || query.includes('boule')) {
    return <FinalShapeIcon size={size} className={className} />;
  }
  if (query.includes('proof') || query.includes('retard') || query.includes('refrigerator') || query.includes('banneton')) {
    return <ProofIcon size={size} className={className} />;
  }
  if (query.includes('preheat') || query.includes('oven')) {
    return <BakeIcon size={size} className={className} />;
  }
  if (query.includes('score') || query.includes('slash') || query.includes('lame')) {
    return <ScoreIcon size={size} className={className} />;
  }
  if (query.includes('bake')) {
    return <BakeIcon size={size} className={className} />;
  }
  if (query.includes('cool')) {
    return <CoolIcon size={size} className={className} />;
  }
  if (query.includes('slice') || query.includes('ready') || query.includes('enjoy') || query.includes('cut')) {
    return <SliceIcon size={size} className={className} />;
  }

  // Default fallback to MixDoughIcon
  return <MixDoughIcon size={size} className={className} />;
};
