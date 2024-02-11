import React from 'react';

function Indicator() {
  return (
    <div className="-mb-px w-[calc(100%-35px)] self-end">
      <div className="absolute -ml-1.5 -mt-[3.5px] h-2 w-2 rounded-full bg-blue-500" />
      <div className="relative h-px bg-blue-500" />
    </div>
  );
}

export default Indicator;
