import * as Dialog from "@radix-ui/react-dialog"; // Assuming you're using Radix UI for Dialog
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next for translations
import { Loader } from "lucide-react";

interface props {
    isOpen : boolean ,
    message?: string ,
    subMessage?: string
}

const LoadingDialog = ({ isOpen , message = "Loading...", subMessage = "Please wait, your request is being processed."}: props) => {
  const { t } = useTranslation(); // Translation hook
  
  return (
    <div id="datatable" className="mt-10" style={{ position: "relative", top: "50%" }}>
        <Dialog.Root open={isOpen}>
          <Dialog.Overlay className="fixed inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 opacity-40 animate-pulse z-50" />
          
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg border-t-4 border-blue-500 animate-fade-in z-50">
            <div className="flex flex-col items-center">
              <Loader className={`w-16 h-16 animate-spin text-blue-600`} />
              
              <p className="text-lg font-semibold mt-4 text-gray-700">
                {t(message)}
              </p>

              <p className="text-sm mt-2 text-gray-500">
                {t(subMessage)}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Root>
    </div>
  );
};

export default LoadingDialog;
