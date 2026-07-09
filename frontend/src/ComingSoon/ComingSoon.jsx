import Countdown from "react-countdown";
import "./ComingSoon.css";

const CountdownBox = ({ value, label }) => {
  return (
    <div className="count-box">
      <h2>{value}</h2>
      <span>{label}</span>
    </div>
  );
};


const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed
}) => {

  if (completed) {
    return (
      <h2 className="launch-text">
        🚀 We are Live!
      </h2>
    );
  }

  return (
    <div className="countdown">

      <CountdownBox
        value={days}
        label="Days"
      />

      <CountdownBox
        value={hours}
        label="Hours"
      />

      <CountdownBox
        value={minutes}
        label="Minutes"
      />

      <CountdownBox
        value={seconds}
        label="Seconds"
      />

    </div>
  );
};


export default function ComingSoon(){

  return (

    <section className="coming-container">

      <div className="glass-card">

        <p className="logo">
          🚀 MARKET FORGE
        </p>


        <h1>
          Coming Soon
        </h1>


        <p className="subtitle">
          Building the next generation marketplace.
          <br/>
          Stay tuned for something amazing.
        </p>


        <Countdown
          date={new Date("2026-08-31T23:59:59")}
          renderer={renderer}
        />


        {/* <div className="notify">

          <input
            type="email"
            placeholder="Enter your email"
          />

          <button>
            Notify Me
          </button>

        </div> */}


      </div>

    </section>

  );
}