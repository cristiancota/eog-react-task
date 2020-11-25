import React from 'react';
import { useSelector } from 'react-redux';
import { lastMeasurementSelector } from './reducer';
import CurrentMeasurementCard from './CurrentMeasurementCard';

const LastMeasurementCards = () => {
  const lastMeasurements = useSelector(lastMeasurementSelector);
  return (
    <div>
      {lastMeasurements.map((measurement, i) => {
        return <CurrentMeasurementCard key={i} measurement={measurement} />;
      })}
    </div>
  );
};

export default LastMeasurementCards;
