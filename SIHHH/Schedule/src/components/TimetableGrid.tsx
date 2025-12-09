import React from 'react';
import { TimetableSlot } from '@/types';
import { cn } from '@/lib/utils';

interface TimetableGridProps {
  slots: TimetableSlot[];
  onSlotClick?: (slot: TimetableSlot) => void;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

const courseColors = [
  'bg-primary/30 border-primary/50 text-primary',
  'bg-secondary/30 border-secondary/50 text-secondary',
  'bg-success/30 border-success/50 text-success',
  'bg-info/30 border-info/50 text-info',
  'bg-warning/30 border-warning/50 text-warning-foreground',
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({ slots, onSlotClick }) => {
  const getSlotForCell = (day: string, time: string) => {
    return slots.find(
      (slot) => slot.day === day && slot.startTime === time
    );
  };

  const getCourseColor = (courseId: string) => {
    const index = parseInt(courseId) % courseColors.length;
    return courseColors[index];
  };

  const getSlotDuration = (slot: TimetableSlot) => {
    const start = parseInt(slot.startTime.split(':')[0]);
    const end = parseInt(slot.endTime.split(':')[0]);
    return end - start;
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Desktop Grid View */}
      <div className="hidden md:block">
        <div className="glass-card min-w-[800px]">
          <div className="grid grid-cols-6 gap-1">
            {/* Header */}
            <div className="p-3 font-medium text-muted-foreground text-sm">Time</div>
            {days.map((day) => (
              <div key={day} className="p-3 font-display font-semibold text-center">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="p-3 text-sm text-muted-foreground border-t border-border/20">
                  {time}
                </div>
                {days.map((day) => {
                  const slot = getSlotForCell(day, time);
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="p-1 border-t border-border/20 min-h-[60px]"
                    >
                      {slot && (
                        <button
                          onClick={() => onSlotClick?.(slot)}
                          className={cn(
                            'w-full p-2 rounded-lg border text-left transition-all hover:scale-[1.02]',
                            getCourseColor(slot.course.id),
                            slot.type === 'practical' && 'border-dashed'
                          )}
                          style={{
                            minHeight: `${getSlotDuration(slot) * 60 - 8}px`,
                          }}
                        >
                          <p className="font-semibold text-xs truncate">{slot.course.code}</p>
                          <p className="text-xs opacity-80 truncate">{slot.course.name}</p>
                          <p className="text-xs opacity-60 truncate mt-1">{slot.room.name}</p>
                        </button>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Day-by-Day View */}
      <div className="md:hidden space-y-4">
        {days.map((day) => {
          const daySlots = slots.filter((slot) => slot.day === day);
          return (
            <div key={day} className="glass-card">
              <h3 className="font-display font-semibold mb-4">{day}</h3>
              {daySlots.length > 0 ? (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => onSlotClick?.(slot)}
                      className={cn(
                        'w-full p-3 rounded-xl border text-left transition-all',
                        getCourseColor(slot.course.id)
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{slot.course.code}</p>
                          <p className="text-sm opacity-80">{slot.course.name}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-background/30">
                          {slot.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm opacity-60">
                        <span>{slot.startTime} - {slot.endTime}</span>
                        <span>{slot.room.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No classes scheduled</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
