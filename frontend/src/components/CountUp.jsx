import React, { useEffect, useState } from 'react';

/**
 * CountUp component animates a number from 0 to target value on mount.
 */
const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endNum = parseInt(end, 10) || 0;
    if (endNum === 0) {
      setCount(0);
      return;
    }
    
    const incrementTime = Math.max(Math.floor(duration / endNum), 12);
    const step = Math.ceil(endNum / (duration / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= endNum) {
        setCount(endNum);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default CountUp;
