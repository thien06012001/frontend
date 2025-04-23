const stats = [
  {
    icon: 'icons/invite.png',
    label: 'Invitations/Requests',
    value: 13550,
  },
  {
    icon: 'icons/event-check.png',
    label: 'Total Events',
    value: 271,
  },
  {
    icon: 'icons/public.png',
    label: 'Public Events',
    value: 229,
  },
  {
    icon: 'icons/private.png',
    label: 'Private Events',
    value: 42,
  },
];

function Statistic() {
  return (
    <section className="p-5 bg-white space-y-2 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="font-semibold text-3xl">Statistic</h2>
      <div className="flex space-x-5 justify-between">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-1 items-center space-x-2 border border-gray-200 rounded-md p-2 pr-4"
          >
            <img src={stat.icon} alt={`${stat.label.toLowerCase()} icon`} />
            <div className="flex flex-col justify-around h-full">
              <span className="text-lg">{stat.label}</span>
              <span className="text-[#ACACAC] font-semibold text-2xl">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistic;
