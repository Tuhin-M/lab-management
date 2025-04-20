import { useDrag } from 'react-dnd';

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export const TimeSlot = ({ time, isSelected, isAvailable, onClick }: TimeSlotProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TIMESLOT',
    item: { time },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      onClick={onClick}
      disabled={!isAvailable}
      className={`
        p-3 rounded-lg border transition-all
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          : isAvailable 
            ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-900/20'
            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/50'
        }
      `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {time}
      {!isAvailable && (
        <span className="block text-xs mt-1 text-gray-500 dark:text-gray-400">Booked</span>
      )}
    </button>
  );
};
