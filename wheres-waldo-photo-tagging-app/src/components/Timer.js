import { useState, useEffect } from 'react';

function Timer (props) {
  const { fetchTimeStrCallback } = props;
  const [timeStr, setTimeStr] = useState('0:00');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const getTime = () => {
    if (seconds < 59) {
      setSeconds(seconds + 1);
      // console.log('seconds = ' + seconds);
    } else {
      setSeconds(0);
      setMinutes(minutes + 1);
    }
    const tempTimeStr = `${minutes}:${String(seconds).padStart(2, '0')}`;
    setTimeStr(tempTimeStr);
    fetchTimeStrCallback(tempTimeStr); // sends timeStr back to Level component
  }
  useEffect(() => {
    const interval = setInterval(getTime, 1000);
    // console.log('in first useeffect');

    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <h3 className="level-timer">{timeStr}</h3>
  );
}

export default Timer;