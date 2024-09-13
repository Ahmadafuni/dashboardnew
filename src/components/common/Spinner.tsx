import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div
      style={{
        zIndex: "10",
        position: "absolute",
        top: "100%",
        left: "50%",
        translate: "-50% -50%",
        scale: "3",
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5px",
        fontSize: "4px",
      }}
    >
      <Loader2
        className="animate-spin"
        style={{
          height: "15px",
        }}
      />
      <br />
      Please Wait . . .
    </div>
  );
};

export default Spinner;
