import React, { useState, useEffect, useMemo } from 'react';
import { useSchedules } from '../hooks/firebase.hooks';
import { LoadingSpinner } from './loading';

const useCaliforniaTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeZone = 'America/Los_Angeles';
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        timeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    return {
        dateString: dateFormatter.format(time),
        timeString: timeFormatter.format(time),
        currentDate: time
    };
};

const Dashboard = () => {
    const { data: schedules, loading, error, updateSchedule } = useSchedules();
    const { dateString, timeString, currentDate } = useCaliforniaTime();

    if (loading) return <LoadingSpinner />;
    if (error) console.error('Error loading schedules:', error);

    const parseTime = (timeStr, date) => {
        if (!timeStr || timeStr.toLowerCase() === 'off') return null;
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes) || 0;

        if (period && period.toLowerCase() === 'pm' && hours < 12) {
            hours += 12;
        }
        if (period && period.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
        }

        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    };

    const currentlyWorking = useMemo(() => {
        const dayOfWeek = currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long' });
        const working = { operators: [], managers: [] };

        const checkSchedule = (schedule, role) => {
            const todaySchedule = schedule.find(s => s.Days === dayOfWeek);
            if (todaySchedule) {
                Object.entries(todaySchedule).forEach(([name, timeRange]) => {
                    if (name !== 'Days' && timeRange.toLowerCase() !== 'off') {
                        const [startStr, endStr] = timeRange.replace(/am|pm/gi, '').split('-');
                        const startTime = parseTime(startStr + timeRange.match(/am|pm/i)?.[0], currentDate);
                        const endTime = parseTime(endStr + timeRange.match(/am|pm/i)?.[0], currentDate);
                        if (startTime && endTime && currentDate >= startTime && currentDate <= endTime) {
                            if (role === 'operator') working.operators.push(name);
                            else working.managers.push(name);
                        }
                    }
                });
            }
        };
        if (schedules.dispatching) checkSchedule(schedules.dispatching, 'operator');
        if (schedules.management) checkSchedule(schedules.management, 'manager');
        return working;
    }, [currentDate, schedules]);

    const handleCellChange = async (scheduleType, rowIndex, colName, value) => {
        const row = schedules[scheduleType][rowIndex];
        if (row) {
            try {
                await updateSchedule(scheduleType, row.id, { [colName]: value });
            } catch (error) {
                console.error('Error updating schedule:', error);
            }
        }
    };

    const ScheduleTable = ({ title, data, type }) => (
        <div className="mt-8 premium-card p-8 slide-up">
            <h3 className="text-3xl font-bold text-premium-text mb-6 flex items-center gap-3 font-display">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium">
                    <span className="text-lg">📅</span>
                </div>
                {title}
            </h3>
            <div className="overflow-x-auto">
                <table className="premium-table">
                    <thead>
                        <tr>
                            {data && data.length > 0 && Object.keys(data[0]).map(key => key !== 'id' && (
                                <th key={key} className="font-bold text-premium-text font-semibold uppercase tracking-wider text-xs">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="group">
                                {Object.entries(row).map(([key, value]) => (
                                    key !== 'id' && <td
                                        key={key}
                                        contentEditable={key !== 'Days'}
                                        onBlur={(e) => handleCellChange(type, rowIndex, key, e.currentTarget.textContent)}
                                        suppressContentEditableWarning={true}
                                        className="focus:outline-none focus:bg-premium-gold/20 focus:text-premium-text transition-all duration-200 group-hover:bg-white/5"
                                    >
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="premium-card text-center p-10 hover:scale-105 transition-all duration-500 group cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium group-hover:animate-bounce-subtle">
                        <span className="text-3xl">🕒</span>
                    </div>
                    <p className="text-5xl font-bold text-premium-text mb-3 font-display tracking-tight">{timeString}</p>
                    <p className="text-lg text-premium-text-secondary font-medium">{dateString}</p>
                    <div className="mt-4 w-16 h-1 bg-gradient-to-r from-premium-gold to-premium-gold-light rounded-full mx-auto"></div>
                </div>
                <div className="premium-card p-10 hover:scale-105 transition-all duration-500 group">
                    <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-premium-purple to-premium-blue flex items-center justify-center shadow-premium group-hover:animate-bounce-subtle">
                        <span className="text-3xl">👥</span>
                    </div>
                    <h3 className="text-2xl font-bold text-premium-text mb-6 font-display">Currently On Shift</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-premium-blue/20 backdrop-blur-sm border border-premium-blue/30">
                            <div className="w-3 h-3 rounded-full bg-premium-blue animate-pulse"></div>
                            <p className="text-premium-text font-semibold">
                                <span className="text-premium-blue-light">Operators:</span> {currentlyWorking.operators.join(', ') || 'None on shift'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-premium-purple/20 backdrop-blur-sm border border-premium-purple/30">
                            <div className="w-3 h-3 rounded-full bg-premium-purple animate-pulse"></div>
                            <p className="text-premium-text font-semibold">
                                <span className="text-premium-purple-light">Managers:</span> {currentlyWorking.managers.join(', ') || 'None on shift'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ScheduleTable title="Dispatcher Schedule" data={schedules.dispatching} type="dispatching" />
            <ScheduleTable title="Manager Schedule" data={schedules.management} type="management" />
        </div>
    );
};

export default Dashboard;