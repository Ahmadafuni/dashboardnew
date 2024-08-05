import { Tooltip } from "react-tooltip";
import "./ProgressBar.css";

const AnimatedProgressBar = (props: any) => {
  return (
    <>
      <div className="progress-bar-container" id={props.id}>
        <div
          className="progress-bar"
          style={{ width: `${props.progress}%` }}
        ></div>
        <span className="progress-label">
          {parseFloat(props.progress).toFixed(1)}%
        </span>
      </div>

      <Tooltip anchorSelect={`#${props.id}`} place="bottom">
        {props.modelStats}
      </Tooltip>
    </>
  );
};

export default AnimatedProgressBar;
