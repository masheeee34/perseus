import React from 'react';

export default function MythologyEditorialBlockSlot() {
  return (
    <section className="w-full bg-[#FFFFFF] py-48 lg:py-64 px-6 sm:px-12 border-b-[0.5px] border-black/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
        <span className="text-[10px] font-mont uppercase tracking-[0.45em] text-[#C5A044] font-light">
          Manifeste d&apos;Atelier • Philosophie
        </span>
        
        <div className="w-16 h-[0.5px] bg-black/20" />
        
        <h2 className="font-serif text-5xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-[#0A0A0A] font-normal leading-[1.08] pb-2">
          RELIQUES <br />
          <span className="italic normal-case text-liquid-gold font-normal block mt-2 sm:mt-3 pb-1">éternelles</span>
        </h2>
        
        <p className="font-serif italic text-black/70 text-xl sm:text-2xl lg:text-3xl font-light leading-[1.85] max-w-3xl pt-6">
          &ldquo;Sur Portola Drive, dans l&apos;ombre dorée des vitrines blindées, Perseus façonne ce que le temps ne peut altérer. Nos artisans ne créent pas des ornements — ils forgent des armures pour ceux qui refusent l&apos;ordinaire. Chaque pierre sertie est un acte de souveraineté.&rdquo;
        </p>
        
        <div className="w-16 h-[0.5px] bg-black/20 mt-8" />
        
        <span className="font-mont text-[9px] uppercase tracking-[0.35em] text-black/40">
          Maison Perseus — Los Santos (2026)
        </span>
      </div>
    </section>
  );
}
