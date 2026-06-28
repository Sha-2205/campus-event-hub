import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function EventAttendeesPage() {
  const { id } = useParams();
  return <Navigate to={`/events/${id}`} replace />;
}
