import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function EditEventPage() {
  const { id } = useParams();
  // Redirect to master detail panel where modifications, deletions, and cancellations are handled interactively
  return <Navigate to={`/events/${id}`} replace />;
}
