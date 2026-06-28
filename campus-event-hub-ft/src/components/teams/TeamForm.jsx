import React from 'react';
import { Save } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function TeamForm({
  name,
  setName,
  eventId,
  setEventId,
  description,
  setDescription,
  capacity,
  setCapacity,
  requiredSkills,
  setRequiredSkills,
  tags,
  setTags,
  objective,
  setObjective,
  events = [],
  loading,
  onSubmit,
  submitLabel = 'Save Team Details',
  queryEventId = ''
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 text-left">
      <Input
        label="Team / Squad Name"
        placeholder="e.g. AI Prompt Engineers"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        id="team-form-name"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-form-event" className="text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">
          Formed For Campus Event
        </label>
        <div className="relative">
          <select
            id="team-form-event"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 cursor-pointer font-medium"
            disabled={!!queryEventId}
          >
            <option value="" className="bg-slate-900 text-slate-400" disabled>Select an Event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id} className="bg-slate-900 text-slate-100">{e.title}</option>
            ))}
          </select>
        </div>
        {queryEventId && (
          <span className="text-[10px] text-indigo-400 font-semibold mt-0.5">
            ✓ Event locked from event deep link shortcut.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-form-desc" className="text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">
          Team Description
        </label>
        <textarea
          id="team-form-desc"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 placeholder:text-slate-600 resize-none font-medium"
          placeholder="Describe your team..."
        />
      </div>

      <Input
        label="Required Skills"
        placeholder="React, Node.js, MongoDB"
        value={requiredSkills}
        onChange={(e) => setRequiredSkills(e.target.value)}
        required
        id="team-form-skills"
      />

      <Input
        label="Maximum Members"
        type="number"
        placeholder="5"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
        id="team-form-capacity"
        min="2"
        max="30"
      />

      <Input
        label="Tags"
        placeholder="frontend, hackathon, AI"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        id="team-form-tags"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-form-objective" className="text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">
          Objective
        </label>
        <textarea
          id="team-form-objective"
          rows={4}
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full bg-slate-950/40 border border-slate-850 text-sm text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 placeholder:text-slate-600 resize-none font-medium"
          placeholder="What is the goal of this team?"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full mt-4"
        icon={Save}
        id="btn-team-form-submit"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
