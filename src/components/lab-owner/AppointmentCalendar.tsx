import { useState } from 'react';
import { format, startOfWeek, getDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimeSlot } from './TimeSlot';
import { AppointmentForm } from './AppointmentForm';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  getDay,
  locales,
});

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patient: string;
  test: string;
  status: 'pending' | 'confirmed' | 'completed';
}

type AppointmentFormData = {
  patientName: string;
  testType: string;
  date: string;
  time: string;
  duration: string;
  notes?: string;
};

const TimeSlotsPanel = () => {
  const slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];
  
  return (
    <div className="w-32 p-4 bg-gray-50 border-r">
      <h3 className="font-medium mb-4">Available Slots</h3>
      {slots.map((slot) => (
        <TimeSlot 
          key={slot} 
          time={slot} 
          isSelected={false}
          isAvailable={true} 
          onClick={() => console.log('Selected:', slot)}
        />
      ))}
    </div>
  );
};

export const AppointmentCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{start: Date, end: Date} | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedSlot({ start, end });
    setIsFormOpen(true);
  };

  const handleSubmit = (data: AppointmentFormData) => {
    // Create new appointment
    setIsFormOpen(false);
  };

  return (
    <>
      <AppointmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="flex">
          <TimeSlotsPanel />
          <div className="h-[600px] mt-4">
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              date={date}
              onNavigate={setDate}
              selectable
              onSelectSlot={handleSelectSlot}
              eventPropGetter={(event) => {
                const backgroundColor = {
                  pending: '#FEF08A',
                  confirmed: '#BBF7D0',
                  completed: '#BFDBFE'
                }[event.status];
                
                return { style: { backgroundColor } };
              }}
            />
          </div>
        </div>
      </DndProvider>
    </>
  );
};
