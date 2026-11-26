const BoardingKpiCards = ({ cards }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {cards.map((card, idx) => (
      <div
        key={idx}
        className="bg-white p-5 rounded-lg shadow transition-shadow flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute -top-[10%] -left-[18%] h-[170px] w-[170px] bg-[#1C7D5A18] rounded-full pointer-events-none" />
        <div className="relative z-10 min-w-0 pr-2">
          <p className="text-xs font-semibold text-slate-500">{card.title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">{card.value}</h3>
          <p className="text-[11px] font-medium text-slate-500 mt-1.5 truncate" title={card.subtitle}>
            {card.subtitle}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${card.bg} ${card.color} shrink-0 relative z-10`}>
          <card.icon className="w-6 h-6" />
        </div>
      </div>
    ))}
  </div>
);

export default BoardingKpiCards;
