import React, {useEffect} from 'react';

const Control = ({}) => {
  useEffect(() => {
    document.title = "Control | Verde";
  }, []);

  return (
    <div className="bg-white border rounded-xl shadow p-4 w-full h-full flex items-center justify-center">
    <p>Control</p>
  </div>
  );
};

export default Control;
