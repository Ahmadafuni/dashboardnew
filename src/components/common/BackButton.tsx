import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      className="mt-1"
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowLeft className="h-8 w-8" />
    </Button>
  );
}
