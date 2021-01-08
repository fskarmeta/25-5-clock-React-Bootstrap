import React, { useState } from "react";
import "./App.css";

const iconStyle = {
  cursor: "pointer",
};

const audioSrc =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

export function App() {
  const [display, setDisplay] = useState(3);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(3);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio(audioSrc));

  const breakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatDisplayTime = (time) => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    return (
      (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    );
  };

  const formatTime = (time) => {
    return time / 60;
  };

  const updateTime = (amount, type) => {
    if (type === "break") {
      if (breakLength <= 60 && amount < 0) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if (sessionLength <= 60 && amount < 0) {
        return;
      }
      setSessionLength((prev) => prev + amount);
      if (!timerOn) {
        setDisplay(sessionLength + amount);
      }
    }
  };

  const timeControl = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplay((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              breakSound();

              console.log(
                `onBreakVariable: ${onBreakVariable}`,
                `onBreak: ${onBreak}`
              );

              onBreakVariable = true;
              setOnBreak(true);

              console.log(
                `onBreakVariable: ${onBreakVariable}`,
                `onBreak: ${onBreak}`
              );

              return breakLength;
            } else if (prev <= 0 && onBreakVariable) {
              breakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionLength;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    setDisplay(25 * 60);
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
  };

  return (
    <div className="container App">
      <div className="row">
        <h1 className="title display-3 m-5 col-md-12 text-center">
          Pomodoro Clock
        </h1>
      </div>

      <div className="row double d-flex">
        <LengthComponent
          title={"Break Length"}
          updateTime={updateTime}
          time={breakLength}
          formatTime={formatTime}
          type={"break"}
          formatDisplayTime={formatDisplayTime}
        />
        <LengthComponent
          title={"Session Length"}
          updateTime={updateTime}
          time={sessionLength}
          formatTime={formatTime}
          type={"session"}
          formatDisplayTime={formatDisplayTime}
        />
      </div>
      <div className="row">
        <div className="clock col-md-12 d-flex justify-content-center">
          <div className="border p-5 rounded">
            <h2 className="text-center disply-4" id="timer-label">
              {onBreak ? "Break" : "Session"}
            </h2>
            <h1 className="timer display-1" id="time-left">
              {formatDisplayTime(display)}
            </h1>
          </div>
        </div>
        <div className="col-md-12">
          <div className="buttons d-flex justify-content-center align-content-center mt-3">
            <span id="start_stop" onClick={timeControl}>
              {timerOn ? (
                <i className="fas fa-pause fa-4x m-3" style={iconStyle}></i>
              ) : (
                <i
                  className="fas fa-play fa-4x m-3"
                  style={iconStyle}
                  id="start_stop"
                ></i>
              )}
            </span>
            <i
              className="fas fa-sync-alt fa-4x m-3"
              style={iconStyle}
              id="reset"
              onClick={resetTime}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}

function LengthComponent({
  title,
  updateTime,
  type,
  time,
  formatTime,
  formatDisplayTime,
}) {
  return (
    <div className="col-md-6">
      <h1 id={type === "break" ? "break-label" : "session-label"}>{title}</h1>
      <div className="d-flex justify-content-center align-items-center">
        <div className="arrow">
          <i
            className="fas fa-arrow-circle-up fa-4x"
            id={type === "break" ? "break-increment" : "session-increment"}
            style={iconStyle}
            onClick={() => updateTime(60, type)}
          ></i>
        </div>
        <h3
          className="m-5 display-4"
          id={type === "break" ? "break-length" : "session-length"}
        >
          {formatDisplayTime(time)}
        </h3>
        <div className="arrow">
          <i
            className="fas fa-arrow-circle-down fa-4x"
            id={type === "break" ? "break-decrement" : "session-decrement"}
            style={iconStyle}
            onClick={() => updateTime(-60, type)}
          ></i>
        </div>
      </div>
    </div>
  );
}
