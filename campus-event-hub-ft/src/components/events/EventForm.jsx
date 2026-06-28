import React from 'react';
import { Calendar, MapPin, Save } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function EventForm({
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  category,
  setCategory,
  capacity,
  setCapacity,
  loading,
  onSubmit,
  submitLabel = 'Save Event Listing'
}) {
  const categories = [
    'Technical',
    'Sports',
    'Cultural',
    'Academic',
    'Social',
    'Workshop',
    'Seminar',
    'Competition',
    'Other'
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-left">
      <Input
        label="Event Title"
        placeholder="e.g. Android AI Capture Challenge"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        id="event-form-title"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="event-form-desc" className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Event Description / Brief
        </label>
        <textarea
          id="event-form-desc"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 placeholder:text-slate-600 resize-none font-medium"
          placeholder="State the core schedule outline, eligibility guidelines, and target technical skills required."
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 flex gap-4">
          <div className="flex-1">
            <Input
              label="Schedule Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              id="event-form-date"
            />
          </div>
          <div className="w-32">
            <Input
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              id="event-form-time"
            />
          </div>
        </div>

        <Input
          label="Room / Specific Location"
          placeholder="e.g. Innovation Hall Room 12"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          icon={MapPin}
          required
          id="event-form-location"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="event-form-category" className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Event Category
          </label>
          <select
            id="event-form-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 cursor-pointer font-medium"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-900 text-slate-100">{cat}</option>
            ))}
          </select>
        </div>

        <Input
          label="Seat Capacity Limit"
          type="number"
          placeholder="e.g. 100"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
          id="event-form-capacity"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full mt-4"
        icon={Save}
        id="btn-event-form-submit"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
