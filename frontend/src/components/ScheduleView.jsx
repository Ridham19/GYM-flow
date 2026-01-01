import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const ScheduleView = ({ machineId, date }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!machineId) return;

        const fetchBookings = async () => {
            setLoading(true);
            try {
                const formattedDate = new Date(date).toISOString();
                const res = await axios.get(`/api/v1/gym/bookings/${machineId}?date=${formattedDate}`);
                setBookings(res.data.bookings);
            } catch (error) {
                toast.error("Could not load schedule");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [machineId, date]);

    // Generate slots from 5 AM to 10 PM (22:00)
    const slots = [];
    for (let i = 5; i <= 22; i++) {
        slots.push(i);
    }

    const isBooked = (hour) => {
        return bookings.some(b => {
            const start = new Date(b.startTime).getHours();
            const end = new Date(b.endTime).getHours();
            // Simple overlap check for hourly slots
            return hour >= start && hour < end;
        });
    };

    if (loading) return <div className="flex justify-center p-4"><Loader className="animate-spin text-primary" /></div>;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-white">Daily Schedule ({new Date(date).toDateString()})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map(hour => {
                    const booked = isBooked(hour);
                    const timeLabel = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;

                    return (
                        <div key={hour} className={`
                            p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
                            ${booked
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'}
                        `}>
                            <span className="text-sm font-bold">{timeLabel}</span>
                            {booked ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                                {booked ? 'Booked' : 'Open'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleView;
