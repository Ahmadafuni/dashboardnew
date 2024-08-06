import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import "./ProgressBar.css";

const AnimatedProgressBar = (props: any) => {
  return (
    <TooltipProvider>
      <Tooltip key={props.id}>
        <TooltipTrigger asChild>
          <div className="progress-bar-container" id={props.id}>
            <div
              className="progress-bar"
              style={{ width: `${props.progress}%` }}
            ></div>
            <span className="progress-label">
              {parseFloat(props.progress).toFixed(1)}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "5px",
          }}
        >
          {props.modelStats}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AnimatedProgressBar;
